"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/prisma/prisma";
import { jobSchema, JobFormData } from "@/lib/schemas/jobSchema";
import {
  customerInvoiceSchema,
  CustomerInvoiceFormData,
} from "@/lib/schemas/customerInvoiceSchema";
import { CUSTOMERS_PER_PAGE, VAT_RATE } from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import type { Customer, Tyre, Invoices, InvoiceItem } from "@/app/generated/prisma/client";
import { normalizeNumber } from "@/lib/utils/normalizeNumber";

type CustomerWithRelations = Customer & {
  tyres: Tyre[];
  invoices: (Invoices & { items: InvoiceItem[] })[];
};

type CustomersData = {
  customers: Customer[];
  totalCount: number;
  totalPages: number;
};

/**
 * Fetches a paginated list of customers.
 */
export async function getCustomers({
  page = 1,
  limit = CUSTOMERS_PER_PAGE,
}: { page?: number; limit?: number } = {}): Promise<ActionResult<CustomersData>> {
  try {
    await requireAuth();

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.customer.count(),
    ]);

    return {
      success: true,
      data: {
        customers,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch {
    return { success: false, error: "Failed to fetch customers" };
  }
}

type CreatedCustomer = { id: number };

/** Creates a new customer.
 */
export async function createCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
}): Promise<ActionResult<CreatedCustomer>> {
  try {
    await requireAuth();

    //TODO: validate data.

    const newCustomer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: normalizeNumber(data.phone),
        email: data.email || null,
        company: data.company || null,
      },
    });

    revalidatePath("/customers");

    return { success: true, data: { id: newCustomer.id } };
  } catch {
    return { success: false, error: "Failed to create customer" };
  }
}

/**
 * Fetches a customer by ID with related tyres and invoices.
 */
export async function getCustomerById(id: number): Promise<ActionResult<CustomerWithRelations>> {
  try {
    await requireAuth();

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        tyres: { orderBy: { dateStored: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    return { success: true, data: customer as unknown as CustomerWithRelations };
  } catch {
    return { success: false, error: "Failed to fetch customer" };
  }
}

/**
 * Adds a new tyre storage for a customer.
 */
export async function addJobToCustomer(
  customerId: number,
  data: JobFormData
): Promise<ActionResult<null>> {
  try {
    await requireAuth();

    const validatedData = jobSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }

    await prisma.tyre.create({
      data: {
        plate: validatedData.data.plate.toUpperCase(),
        number: validatedData.data.number,
        location: validatedData.data.location,
        customerId: customerId,
        dateStored: new Date(),
        isStored: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/customers/${customerId}`);
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "A tyre with this plate already exists" };
    }
    return { success: false, error: "Failed to create job" };
  }
}

/**
 * Adds a new job/invoice for a customer.
 */
export async function addInvoiceToCustomer(
  customerId: number,
  data: CustomerInvoiceFormData
): Promise<ActionResult<null>> {
  try {
    await requireAuth();

    const validatedData = customerInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }

    const subtotal = validatedData.data.items.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    const tax = subtotal * VAT_RATE;
    const total = subtotal;

    await prisma.invoices.create({
      data: {
        plate: validatedData.data.plate.toUpperCase(),
        items: {
          create: validatedData.data.items.map((item) => ({
            service: item.service,
            price: parseFloat(item.price),
          })),
        },
        totalAmount: total,
        totalTax: tax,
        customerId: customerId,
      },
    });

    revalidatePath(`/customers/${customerId}`);
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to create invoice" };
  }
}

/**
 * Deletes an invoice by ID.
 */
export async function deleteInvoice(id: number, customerId: number): Promise<ActionResult<null>> {
  try {
    await requireAuth();

    await prisma.invoices.delete({ where: { id } });

    revalidatePath(`/customers/${customerId}`);
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete invoice" };
  }
}

/**
 * Deletes a tyre storage by ID.
 */
export async function deleteTyre(id: number, customerId: number): Promise<ActionResult<null>> {
  try {
    await requireAuth();

    await prisma.tyre.delete({ where: { id } });

    revalidatePath(`/customers/${customerId}`);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete tyre storage" };
  }
}
