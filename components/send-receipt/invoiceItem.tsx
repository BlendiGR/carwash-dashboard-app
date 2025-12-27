"use client";

import { UseFormRegister } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReceiptFormData } from "@/lib/schemas/receiptSchema";

interface InvoiceItemProps {
  index: number;
  register: UseFormRegister<ReceiptFormData>;
  onRemove: () => void;
  canRemove: boolean;
  serviceError?: string;
  priceError?: string;
  translations: {
    servicePlaceholder: string;
    pricePlaceholder: string;
    remove: string;
  };
}

export default function InvoiceItem({
  index,
  register,
  onRemove,
  canRemove,
  serviceError,
  priceError,
  translations: t,
}: InvoiceItemProps) {
  return (
    <div className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Service Input */}
      <div className="flex-1 flex flex-col gap-1">
        <Input
          placeholder={t.servicePlaceholder}
          {...register(`items.${index}.service`)}
          className={serviceError ? "border-red-500" : ""}
        />
        {serviceError && (
          <span className="text-xs text-red-500">{serviceError}</span>
        )}
      </div>

      {/* Price Input */}
      <div className="w-28 flex flex-col gap-1">
        <Input
          type="text"
          inputMode="decimal"
          placeholder={t.pricePlaceholder}
          {...register(`items.${index}.price`)}
          className={priceError ? "border-red-500" : ""}
        />
        {priceError && (
          <span className="text-xs text-red-500">{priceError}</span>
        )}
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30"
        title={t.remove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
