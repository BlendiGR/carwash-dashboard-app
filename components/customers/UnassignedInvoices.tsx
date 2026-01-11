import { getTranslations } from "next-intl/server";
import { getUnassignedInvoices } from "@/app/actions/invoices";
import { FileX, Download } from "lucide-react";
import Pagination from "../ui/pagination";

interface UnassignedInvoicesProps {
  searchParams: Promise<{ page?: string; invoicePage?: string }>;
}

export default async function UnassignedInvoices({ searchParams }: UnassignedInvoicesProps) {
  const t = await getTranslations("Customers");
  const params = await searchParams;
  const invoicePage = Number(params.invoicePage) || 1;

  const result = await getUnassignedInvoices(invoicePage);

  if (!result.success || !result.data?.invoices.length) {
    return null;
  }

  const { invoices, page, totalPages } = result.data;

  return (
    <div className="bg-gray-100 rounded-2xl p-4 m-4 overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
            <FileX size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold">{t("unassignedInvoices")}</p>
            <p className="text-sm text-gray-500">{t("unassignedInvoicesSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("invoicePlate")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("invoiceServices")}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                {t("invoiceTotal")}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                {t("invoiceDate")}
              </th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{invoice.plate}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600">{invoice.services.join(", ") || "—"}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-gray-900">€{invoice.totalAmount.toFixed(2)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-gray-600">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`/api/invoices/${invoice.id}/download`}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg inline-flex text-gray-700 transition-colors"
                    title={t("downloadInvoice") || "Download PDF"}
                    download
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={page} totalPages={totalPages} queryParam="invoicePage" />
      </div>
    </div>
  );
}
