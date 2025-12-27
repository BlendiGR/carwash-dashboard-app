"use client";

import { InvoiceItem } from "@/lib/schemas/receiptSchema";

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
  };
}

export default function InvoicePreview({
  customerName,
  plate,
  items,
  translations: t,
}: InvoicePreviewProps) {
  const validItems = items.filter((item) => item.service && item.price);
  const total = validItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  );
  const vatRate = 0.255;
  const vatAmount = total * (vatRate / (1 + vatRate));
  const subtotal = total - vatAmount;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit sticky top-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primaryhover px-6 py-4">
        <h3 className="text-white font-semibold text-lg">{t.preview}</h3>
      </div>

      {/* Email Preview */}
      <div className="p-6">
        {/* Email Card */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          {/* Email Header */}
          <div className="bg-white px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">AS</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">AutoSpa Opus</p>
                <p className="text-xs text-gray-500">noreply@autospa-opus.fi</p>
              </div>
            </div>
            <h4 className="font-bold text-gray-900">{t.invoice}</h4>
          </div>

          {/* Email Body */}
          <div className="bg-white mx-3 my-3 rounded-lg p-4">
            {/* Customer Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              {customerName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.customer}</span>
                  <span className="font-medium text-gray-900">{customerName}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t.plate}</span>
                <span className="font-medium text-gray-900 font-mono">
                  {plate || "—"}
                </span>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>{t.service}</span>
                <span>{t.price}</span>
              </div>

              {validItems.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  {t.noItems}
                </div>
              ) : (
                <div className="space-y-2">
                  {validItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-2 border-b border-gray-50"
                    >
                      <span className="text-gray-700">{item.service}</span>
                      <span className="font-medium text-gray-900">
                        €{parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {validItems.length > 0 && (
              <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t.subtotal}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t.vat} (25.5%)</span>
                  <span>€{vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t.total}</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-3 text-xs text-gray-400">
            {t.thankYou}
          </div>
        </div>
      </div>
    </div>
  );
}
