import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { ReceiptFormData } from "@/lib/schemas/receiptSchema";
import InvoicePreview from "./invoicePreview";

interface ReceiptPreviewSectionProps {
  watchedValues: Partial<ReceiptFormData>;
}

export default function ReceiptPreviewSection({ watchedValues }: ReceiptPreviewSectionProps) {
  const t = useTranslations("SendReceipt");

  return (
    <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("preview")}</h2>
          <p className="text-sm text-gray-500">{t("emailPreview.subtitle")}</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 overflow-hidden flex flex-col">
        <InvoicePreview
          customerName={watchedValues.customerName}
          plate={watchedValues.plate || ""}
          items={watchedValues.items || []}
          t={t}
        />
      </div>
    </div>
  );
}
