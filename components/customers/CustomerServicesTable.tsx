"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteInvoice, deleteTyre } from "@/app/actions/customers";
import type { Tyre, Invoices } from "@/app/generated/prisma/client";
import { Download } from "lucide-react";

type InvoiceItem = {
  id: number;
  service: string;
  price: any;
};

export type PlainInvoice = Omit<Invoices, "totalAmount" | "totalTax"> & {
  totalAmount: number;
  totalTax: number;
  items: InvoiceItem[];
};

interface CustomerServicesTableProps {
  customerId: number;
  tyres: Tyre[];
  invoices: PlainInvoice[];
}

type ServiceRow = {
  id: number;
  type: "tyre" | "job";
  date: Date;
  plate: string;
  details: string;
  amount: number | null;
};

export default function CustomerServicesTable({
  customerId,
  tyres,
  invoices,
}: CustomerServicesTableProps) {
  const t = useTranslations("CustomerDetail");
  const [isPending, startTransition] = useTransition();

  // Combine tyres and invoices into unified rows
  const rows: ServiceRow[] = [
    ...tyres.map((tyre) => ({
      id: tyre.id,
      type: "tyre" as const,
      date: tyre.dateStored ?? new Date(),
      plate: tyre.plate,
      details: tyre.location ?? "—",
      amount: null,
    })),
    ...invoices.map((inv) => ({
      id: inv.id,
      type: "job" as const,
      date: inv.createdAt,
      plate: inv.plate,
      details: inv.items?.map((i) => i.service).join(", ") || "—",
      amount: Number(inv.totalAmount),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate total from invoices
  const total = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

  const handleDelete = (row: ServiceRow) => {
    startTransition(async () => {
      if (row.type === "tyre") {
        await deleteTyre(row.id, customerId);
      } else {
        await deleteInvoice(row.id, customerId);
      }
    });
  };

  if (rows.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <p className="text-gray-500">{t("noServices")}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("date")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("type")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("plate")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("details")}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t("amount")}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.type}-${row.id}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-gray-600 text-sm">
                    {row.date.toLocaleDateString("fi-FI")}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.type === "tyre"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.type === "tyre" ? t("tyreStorage") : t("job")}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{row.plate}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600 text-sm">{row.details}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-gray-900">
                    {row.amount !== null ? `€${row.amount.toFixed(2)}` : "—"}
                  </span>
                </td>
                <td className="space-x-2 py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={isPending}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title={t("delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {row.type === "job" && (
                    <a
                      href={`/api/invoices/${row.id}/download`}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg inline-flex text-gray-700 transition-colors"
                      title={t("downloadInvoice") || "Download PDF"}
                      download
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
          {/* Total Row */}
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="py-3 px-4 text-right font-semibold text-gray-700">
                {t("total")}
              </td>
              <td className="py-3 px-4 text-right font-bold text-gray-900">€{total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
