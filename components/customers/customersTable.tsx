import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getCustomers } from "@/app/actions/customers";
import Pagination from "../ui/pagination";

interface CustomersTableProps {
  page?: number;
}

export default async function CustomersTable({ page = 1 }: CustomersTableProps) {
  const t = await getTranslations("Customers");

  let data = null;
  let error = false;

  try {
    data = await getCustomers({ page });
  } catch (e) {
    console.error("Failed to fetch customers:", e);
    error = true;
  }

  if (error) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 m-4 text-center">
        <p className="text-red-500 font-medium">{t("fetchError")}</p>
      </div>
    );
  }

  if (!data || data.customers.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 m-4 text-center">
        <p className="text-gray-500">{t("noCustomers")}</p>
      </div>
    );
  }

  const { customers, totalPages } = data;

  return (
    <div className="bg-gray-100 rounded-2xl p-4 m-4 overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("customerName")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("customerCompany")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("customerPhone")}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{customer.name || "—"}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600">{customer.company || "—"}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600">{customer.phone || "—"}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                    {t("view")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
