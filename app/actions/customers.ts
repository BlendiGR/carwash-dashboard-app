import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/prisma/prisma";

const CUSTOMERS_PER_PAGE = 10;

export async function getCustomers({
  page = 1,
  limit = CUSTOMERS_PER_PAGE,
}: { page?: number; limit?: number } = {}) {
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
    customers,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}
