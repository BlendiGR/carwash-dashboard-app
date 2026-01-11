"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { ActionResult } from "@/lib/action-result";


const INVOICES_PER_PAGE = 10;
/** Plain invoice type for client components */
export type UnassignedInvoice = {
  id: number;
  plate: string;
  services: string[];
  totalAmount: number;
  createdAt: Date;
};

export type UnassignedInvoicesData = {
  invoices: UnassignedInvoice[];
  totalCount: number;
  totalPages: number;
  page: number;
};

/**
 * Fetches all invoices that are not linked to a customer.
 * @param page - The page number to fetch (1-indexed, defaults to 1)
 */
export async function getUnassignedInvoices(page = 1): Promise<ActionResult<UnassignedInvoicesData>> {
  try {
    await requireAuth();

    const currentPage = Math.max(1, page);
    const skip = (currentPage - 1) * INVOICES_PER_PAGE;

    const [invoices, totalCount] = await Promise.all([
      prisma.invoices.findMany({
        where: {
          customerId: null,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: INVOICES_PER_PAGE,
        select: {
          id: true,
          plate: true,
          items: {
            select: {
              service: true,
            },
          },
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.invoices.count({
        where: {
          customerId: null,
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / INVOICES_PER_PAGE);

    const data = invoices.map((inv) => ({
      ...inv,
      services: inv.items.map((i) => i.service),
      totalAmount: Number(inv.totalAmount),
    }));

    const finalData = {
      invoices: data,
      totalCount,
      totalPages,
      page: currentPage,
    };

    return { success: true, data: finalData };
  } catch (error) {
    console.error("Failed to fetch unassigned invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

