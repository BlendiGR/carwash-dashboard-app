"use client";

import Image from "next/image";
import { calculateInvoiceTotals, type InvoiceItem } from "@/hooks/useInvoiceForm";
import { TranslationFunction } from "@/lib/utils";

/** Business info from public env vars */
const businessInfo = {
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "",
  website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
  ytunnus: process.env.NEXT_PUBLIC_COMPANY_YTUNNUS || "",
};

interface InvoicePreviewProps {
  customerName?: string;
  plate: string;
  items: InvoiceItem[];
  t: TranslationFunction;
}

/**
 * InvoicePreview - Live preview of the invoice email.
 * Matches the PDF layout with company info header.
 */
export default function InvoicePreview({
  customerName,
  plate,
  items,
  t,
}: InvoicePreviewProps) {
  const { validItems, subtotal, vatAmount, vatRate, total } = calculateInvoiceTotals(items);

  const currentDate = new Date().toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-fit sticky top-8">
      <div className="text-sm font-medium text-gray-500 mb-3">{t("preview")}</div>

      <div className="bg-gray-100 p-4 sm:p-6 font-sans">
        <div className="max-w-[560px] mx-auto bg-white border border-gray-200">
          {/* Header */}
          <div className="p-6 sm:px-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              {/* Left: Logo + Contact Info */}
              <div className="flex flex-col">
                <Image
                  src="/logo-opus.png"
                  alt="AutoSpa Opus"
                  width={80}
                  height={40}
                  className="object-contain mb-3"
                />
                <div className="space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-[10px] text-gray-500 w-14">Puh:</span>
                    <span className="text-[10px] text-gray-700">{businessInfo.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-gray-500 w-14">Sähköposti:</span>
                    <span className="text-[10px] text-gray-700">{businessInfo.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-gray-500 w-14">Nettisivut:</span>
                    <span className="text-[10px] text-gray-700">{businessInfo.website}</span>
                  </div>
                </div>
              </div>

              {/* Right: Invoice Title + Business Info */}
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{t("invoiceTitle")}</h3>
                <p className="text-xs text-gray-500 mb-3">{currentDate}</p>
                <div className="space-y-0.5">
                  <div className="flex justify-end gap-2">
                    <span className="text-[10px] text-gray-500">Osoite:</span>
                    <span className="text-[10px] text-gray-700">{businessInfo.address}</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <span className="text-[10px] text-gray-500">Y-tunnus:</span>
                    <span className="text-[10px] text-gray-700">{businessInfo.ytunnus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-5 sm:px-8">
            <div className="bg-gray-50 p-4 mb-5">
              {customerName && (
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">{t("customerName")}</span>
                  <span className="text-xs font-medium text-gray-800">{customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">{t("plate")}</span>
                <span className="text-xs font-medium text-gray-800">{plate || "—"}</span>
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-5">
              <div className="flex justify-between border-b-2 border-gray-800 pb-1.5 mb-2">
                <span className="text-[11px] font-semibold uppercase text-gray-800">{t("service")}</span>
                <span className="text-[11px] font-semibold uppercase text-gray-800">{t("price")}</span>
              </div>

              {validItems.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">{t("noItems")}</div>
              ) : (
                validItems.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-gray-200 py-2.5">
                    <span className="text-sm text-gray-800">{item.service}</span>
                    <span className="text-sm text-gray-800">€{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            {validItems.length > 0 && (
              <div>
                <div className="flex justify-end gap-10 mb-1">
                  <span className="text-xs text-gray-500">{t("subtotal")}</span>
                  <span className="text-xs text-gray-500">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-10 mb-2">
                  <span className="text-xs text-gray-500">{t("vat")} ({(vatRate * 100).toFixed(1)}%)</span>
                  <span className="text-xs text-gray-500">€{vatAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-end gap-10">
                  <span className="text-sm font-semibold text-gray-800">{t("total")}</span>
                  <span className="text-sm font-semibold text-gray-800">€{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 sm:px-8 border-t border-gray-200 bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-1">{t("thankYou")}</p>
            <p className="text-[11px] text-gray-400">{t("footer")}</p>
          </div>

          {/* Copyright */}
          <div className="py-3.5 px-8 border-t border-gray-200 text-center">
            <p className="text-[10px] text-gray-400">
              © {new Date().getFullYear()} AutoSpa Opus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
