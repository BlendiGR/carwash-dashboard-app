"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, FileText } from "lucide-react";
import AddJobForm from "./addJobForm";
import AddInvoiceForm from "./addInvoiceForm";

interface CustomerFormsProps {
  customerId: number;
  customerPhone: string;
}

type TabType = "job" | "invoice";

export default function CustomerForms({ customerId, customerPhone }: CustomerFormsProps) {
  const t = useTranslations("CustomerDetail");
  const [activeTab, setActiveTab] = useState<TabType>("job");

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("job")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === "job"
              ? "bg-[#111827] text-white shadow-md scale-105"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          {t("addJob")}
        </button>
        <button
          onClick={() => setActiveTab("invoice")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === "invoice"
              ? "bg-[#111827] text-white shadow-md scale-105"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
          }`}
        >
          <FileText className="w-4 h-4" />
          {t("addInvoice")}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "job" && <AddJobForm customerId={customerId} customerPhone={customerPhone} />}
      {activeTab === "invoice" && <AddInvoiceForm customerId={customerId} />}
    </div>
  );
}
