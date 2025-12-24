"use server";

/**
 * Tyre Hotel Server Actions
 *
 * This file contains server-side actions for managing the Tyre Hotel feature,
 * including fetching, creating, and updating tyre storage records.
 */

import { prisma } from "@/prisma/prisma";

/** Number of items per page for pagination */
const PAGE_SIZE = 12;

/**
 * Fetches a paginated list of tyres based on search criteria.
 *
 * @param query - Optional search string for plate, number, location, or customer name
 * @param page - Page number for pagination (default: 1)
 * @param isStored - Filter by storage status (default: true)
 * @returns Object containing paginated tyre records and pagination metadata
 */
export async function fetchTyres(query?: string | null, page: number = 1, isStored = true) {
  const skip = (page - 1) * PAGE_SIZE;

  const whereClause = {
    ...(query && {
      OR: [
        { plate: { contains: query, mode: "insensitive" as const } },
        { number: { contains: query, mode: "insensitive" as const } },
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
    tyres,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / PAGE_SIZE),
      totalItems: total,
    },
  };
}

/**
 * Retrieves statistics about stored tyres.
 *
 * @returns Object containing counts by location and total count
 */
export async function tyreCounts() {
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
    countsByLocation,
    total,
  };
}

/**
 * Gets the total number of customers in the system.
 *
 * @returns Total customer count
 */
export async function customerCount() {
  const count = await prisma.customer.count();
  return count;
}

/**
 * Fetches a list of all customers for selection purposes.
 *
 * @returns Array of customers with id, name, and plate
 */
export async function fetchCustomers() {
  const customers = await prisma.customer.findMany({
    select: { id: true, name: true, plate: true },
    orderBy: { name: "asc" },
  });
  return customers;
}

/**
 * Retrieves a list of unique storage locations currently in use.
 *
 * @returns Array of distinct location strings
 */
export async function fetchLocations() {
  const locations = await prisma.tyre.findMany({
    where: { location: { not: null } },
    select: { location: true },
    distinct: ["location"],
  });
  return locations.map((l: { location: string }) => l.location).filter(Boolean) as string[];
}

interface CreateTyreInput {
  plate: string;
  number: string;
  location: string;
  customerId?: number;
}

/**
 * Creates a new tyre storage record.
 *
 * @param data - The tyre data to create
 * @returns Object indicating success/failure and the created tyre or error message
 */
export async function createTyre(data: CreateTyreInput) {
  try {
    const tyre = await prisma.tyre.create({
      data: {
        plate: data.plate.toUpperCase(),
        number: data.number,
        location: data.location,
        customerId: data.customerId ?? null,
        dateStored: new Date(),
        isStored: true,
      },
      include: { customer: true },
    });
    return { success: true, tyre };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "A tyre with this plate already exists" };
    }
    return { success: false, error: "Failed to create tyre" };
  }
}

/**
 * Toggles the storage status of a tyre (Check-in / Check-out).
 *
 * @param id - The ID of the tyre to update
 * @returns Object indicating success/failure and updated tyre data
 */
export async function toggleTyreStatus(id: number) {
  try {
    const tyre = await prisma.tyre.findUnique({ where: { id } });

    if (!tyre) {
      return { success: false, error: "Tyre not found" };
    }

    const newIsStored = !tyre.isStored;

    const updatedTyre = await prisma.tyre.update({
      where: { id },
      data: {
        isStored: newIsStored,
        deletedAt: newIsStored ? null : new Date(),
      },
      include: { customer: true },
    });

    return { success: true, tyre: updatedTyre };
  } catch (error) {
    console.error("Failed to toggle tyre status:", error);
    return { success: false, error: "Failed to toggle tyre status" };
  }
}
