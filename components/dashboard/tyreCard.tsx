"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Undo2, Package } from "lucide-react";
import ConfirmDialog from "../ui/confirm-dialog";
import { useTranslations } from "next-intl";

interface TyreCardProps {
  id: number;
  customerName?: string;
  plate: string;
  number: string;
  location?: string;
  dateStored?: Date | null;
  deletedAt?: Date | null;
  isStored: boolean;
  onToggleStatus?: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export default function TyreCard({
  id,
  customerName,
  plate,
  number,
  location,
  dateStored,
  deletedAt,
  isStored,
  onToggleStatus,
}: TyreCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const t = useTranslations("TyreCard");
  const tConfirm = useTranslations("ConfirmDialog");

  const displayDate = isStored ? dateStored : deletedAt;
  const formattedDate = displayDate ? new Date(displayDate).toLocaleDateString("fi-FI") : "—";

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border
                        ${isStored ? "border-emerald-200" : "border-red-200"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{location || "—"}</h3>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium
                    ${isStored ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
        >
          {isStored ? t("occupied") : t("returned")}
        </span>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-400">{t("customer")}</p>
        <p className="text-lg font-semibold text-gray-900">{customerName || "—"}</p>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-400">{t("plate")}</p>
        <p className="text-xl font-bold text-gray-900 tracking-wide">{plate}</p>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-400">{t("tyreNumber")}</p>
        <p className="text-lg font-semibold text-gray-900">{number}</p>
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{isStored ? t("storedAt") : t("returnedAt")}</p>
          <p className="text-lg font-semibold text-gray-900">{formattedDate}</p>
        </div>
        <Button
          variant={isStored ? "destructive" : "default"}
          size="sm"
          onClick={() => setShowConfirm(true)}
          className="rounded-xl"
        >
          {isStored ? (
            <>
              <Undo2 size={16} className="text-white" />
              <span className="text-white ml-2">{t("returnButton")}</span>
            </>
          ) : (
            <>
              <Package size={16} className="text-white" />
              <span className="text-white ml-2">{t("storeButton")}</span>
            </>
          )}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onToggleStatus?.(id)}
        title={isStored ? tConfirm("returnTitle") : tConfirm("storeTitle")}
        message={
          isStored ? tConfirm("returnMessage", { plate }) : tConfirm("storeMessage", { plate })
        }
        confirmLabel={isStored ? t("returnButton") : t("storeButton")}
        variant={isStored ? "destructive" : "default"}
      />
    </div>
  );
}
