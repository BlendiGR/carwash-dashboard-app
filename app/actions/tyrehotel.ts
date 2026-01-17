"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/prisma/prisma";
import { tyreSchema } from "@/lib/schemas/tyreSchema";
import { PAGE_SIZE } from "@/lib/constants";
import { requireAuth } from "@/lib/auth-utils";
import type { ActionResult } from "@/lib/action-result";
import type { Tyre, Customer } from "@/app/generated/prisma/client";
import { normalizeNumber } from "@/lib/utils/normalizeNumber";

type TyreWithCustomer = Tyre & { customer: Customer | null };

type TyresData = {
  tyres: TyreWithCustomer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

/**
 * Fetches a paginated list of tyres based on search criteria.
 */
export async function fetchTyres(
  query?: string | null,
  page: number = 1,
  isStored = true
): Promise<ActionResult<TyresData>> {
  try {
    await requireAuth();

    const skip = (page - 1) * PAGE_SIZE;

    const normalizedQuery = query ? normalizeNumber(query) : query;

    const whereClause = {
      ...(query && {
        OR: [
          { plate: { contains: query, mode: "insensitive" as const } },
          { number: { contains: normalizedQuery || query, mode: "insensitive" as const } },
          { location: { contains: query, mode: "insensitive" as const } },
          { customer: { name: { contains: query, mode: "insensitive" as const } } },
        ],
      }),
    };

    const [tyres, total] = await Promise.all([
      prisma.tyre.findMany({
        where: {
          ...whereClause,
          isStored: isStored,
        },
        include: { customer: true },
        orderBy: { dateStored: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.tyre.count({ where: { ...whereClause, isStored: isStored } }),
    ]);

    return {
      success: true,
      data: {
        tyres,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / PAGE_SIZE),
          totalItems: total,
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error || "Failed to fetch tyres" };
  }
}

type CountsByLocation = {
  countsByLocation: { location: string; count: number }[];
  total: number;
};

/**
 * Retrieves statistics about stored tyres.
 */
export async function tyreCounts(): Promise<ActionResult<CountsByLocation>> {
  try {
    await requireAuth();

    const byLocation = await prisma.tyre.groupBy({
      by: ["location"],
      _count: { id: true },
      where: { isStored: true },
    });

    const countsByLocation = byLocation.map(
      (l: { location: string | null; _count: { id: number } }) => ({
        location: l.location ?? "Unknown",
        count: l._count.id,
      })
    );

    const total = countsByLocation.reduce(
      (acc: number, l: { location: string; count: number }) => acc + l.count,
      0
    );

    return {
      success: true,
      data: { countsByLocation, total },
    };
  } catch (error: any) {
    return { success: false, error: error || "Failed to fetch tyre counts" };
  }
}

/**
 * Gets the total number of customers in the system.
 */
export async function customerCount(): Promise<ActionResult<number>> {
  try {
    await requireAuth();
    const count = await prisma.customer.count();
    return { success: true, data: count };
  } catch {
    return { success: false, error: "Failed to fetch customer count" };
  }
}

type CustomerOption = { id: number; name: string };

/**
 * Fetches a list of all customers for selection purposes.
 */
export async function fetchCustomers(): Promise<ActionResult<CustomerOption[]>> {
  try {
    await requireAuth();

    const customers = await prisma.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: customers };
  } catch (error: any) {
    return { success: false, error: error || "Failed to fetch customers" };
  }
}

/**
 * Retrieves a list of unique storage locations currently in use.
 */
export async function fetchLocations(): Promise<ActionResult<string[]>> {
  try {
    await requireAuth();

    const locations = await prisma.tyre.findMany({
      where: { location: { not: null } },
      select: { location: true },
      distinct: ["location"],
    });
    return {
      success: true,
      data: locations
        .map((l: { location: string | null }) => l.location)
        .filter(Boolean) as string[],
    };
  } catch (error: any) {
    return { success: false, error: error || "Failed to fetch locations" };
  }
}

type CustomerMatch = { id: number; name: string } | null;

/** Schema for validating phone number for customer lookup */
const phoneLookupSchema = z.string().min(5, "Phone too short");

/**
 * Looks up a customer by phone number.
 */
export async function findCustomerByPhone(phone: string): Promise<ActionResult<CustomerMatch>> {
  try {
    await requireAuth();

    const validated = phoneLookupSchema.safeParse(phone);
    if (!validated.success) {
      return { success: false, error: validated.error.message };
    }

    const normalizedPhone = normalizeNumber(validated.data);

    const customer = await prisma.customer.findFirst({
      where: { phone: { contains: normalizedPhone } },
      select: { id: true, name: true },
    });

    return { success: true, data: customer };
  } catch (error: any) {
    return { success: false, error: error || "Failed to lookup customer" };
  }
}

interface CreateTyreInput {
  plate: string;
  number: string;
  location: string;
  customerId?: number;
}

/**
 * Creates a new tyre storage record.
 */
export async function createTyre(data: CreateTyreInput): Promise<ActionResult<Tyre>> {
  try {
    await requireAuth();

    const validatedData = tyreSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }
    const tyre = await prisma.tyre.create({
      data: {
        plate: validatedData.data.plate.toUpperCase(),
        number: normalizeNumber(validatedData.data.number),
        location: validatedData.data.location,
        dateStored: new Date(),
        isStored: true,
        customerId: data.customerId ?? null,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: tyre };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "A tyre with this plate already exists" };
    }
    return { success: false, error: error || "Failed to create tyre" };
  }
}

/** Schema for validating tyre ID parameter */
const tyreIdSchema = z.number().int().positive("Invalid tyre ID");

/**
 * Toggles the storage status of a tyre (Check-in / Check-out).
 */
export async function toggleTyreStatus(id: number): Promise<ActionResult<TyreWithCustomer>> {
  try {
    // Server-side validation
    const validated = tyreIdSchema.safeParse(id);
    if (!validated.success) {
      return { success: false, error: "Invalid tyre ID" };
    }

    await requireAuth();

    const tyre = await prisma.tyre.findUnique({ where: { id: validated.data } });

    if (!tyre) {
      return { success: false, error: "Tyre not found" };
    }

    const newIsStored = !tyre.isStored;

    const updatedTyre = await prisma.tyre.update({
      where: { id: validated.data },
      data: {
        isStored: newIsStored,
        deletedAt: newIsStored ? null : new Date(),
      },
      include: { customer: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedTyre };
  } catch (error: any) {
    return { success: false, error: error || "Failed to toggle tyre status" };
  }
}
