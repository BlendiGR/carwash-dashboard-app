import { InvoiceItem } from "@/lib/schemas/receiptSchema";
import Image from "next/image";

interface InvoicePreviewProps {
  customerName?: string;
  plate: string;
  items: InvoiceItem[];
  translations: {
    preview: string;
    invoice: string;
    customer: string;
    plate: string;
    service: string;
    price: string;
    subtotal: string;
    vat: string;
    total: string;
    noItems: string;
    thankYou: string;
    footer: string;
  };
}

/**
 * InvoicePreview - Live preview of the invoice that will be sent via email.
 *
 * Mirrors the Receipt email template styling for accurate preview.
 */
export default function InvoicePreview({
  customerName,
  plate,
  items,
  translations: t,
}: InvoicePreviewProps) {
  const validItems = items.filter((item) => item.service && item.price);
  const total = validItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const vatRate = 0.255;
  const vatAmount = total * (vatRate / (1 + vatRate));
  const subtotal = total - vatAmount;

  const currentDate = new Date().toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-fit sticky top-8">
      {/* Preview Label */}
      <div className="text-sm font-medium text-gray-500 mb-3">{t.preview}</div>

      {/* Email Container */}
      <div className="bg-gray-100 p-4 sm:p-6 font-sans">
        <div className="max-w-[560px] mx-auto bg-white border border-gray-200">
          {/* Header */}
          <div className="p-6 sm:px-8 border-b border-gray-200 flex justify-between items-start">
            <Image
              src="/logo-opus.png"
              alt="AutoSpa Opus"
              width={80}
              height={40}
              className="object-contain"
            />
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{t.invoice}</h3>
              <p className="text-xs text-gray-500">{currentDate}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-5 sm:px-8">
            {/* Customer Info Box */}
            <div className="bg-gray-50 p-4 mb-5">
              {customerName && (
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">{t.customer}</span>
                  <span className="text-xs font-medium text-gray-800">{customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">{t.plate}</span>
                <span className="text-xs font-medium text-gray-800">{plate || "—"}</span>
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-5">
              {/* Table Header */}
              <div className="flex justify-between border-b-2 border-gray-800 pb-1.5 mb-2">
                <span className="text-[11px] font-semibold uppercase text-gray-800">
                  {t.service}
                </span>
                <span className="text-[11px] font-semibold uppercase text-gray-800">
                  {t.price}
                </span>
              </div>

              {/* Table Rows */}
              {validItems.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">{t.noItems}</div>
              ) : (
                validItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-gray-200 py-2.5"
                  >
                    <span className="text-sm text-gray-800">{item.service}</span>
                    <span className="text-sm text-gray-800">
                      €{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            {validItems.length > 0 && (
              <div>
                <div className="flex justify-end gap-10 mb-1">
                  <span className="text-xs text-gray-500">{t.subtotal}</span>
                  <span className="text-xs text-gray-500">€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-end gap-10 mb-2">
                  <span className="text-xs text-gray-500">{t.vat} (25.5%)</span>
                  <span className="text-xs text-gray-500">€{vatAmount.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-800 pt-2 flex justify-end gap-10">
                  <span className="text-sm font-semibold text-gray-800">{t.total}</span>
                  <span className="text-sm font-semibold text-gray-800">€{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 sm:px-8 border-t border-gray-200 bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-1">{t.thankYou}</p>
            <p className="text-[11px] text-gray-400">{t.footer}</p>
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
