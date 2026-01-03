"use client";

import { UseFormReturn, UseFieldArrayReturn, FieldErrors } from "react-hook-form";
import { Mail, User, Car, Plus, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/select";
import InvoiceItem from "./invoiceItem";
import { ReceiptFormData, RECEIPT_LANGUAGES, ReceiptLanguage } from "@/lib/schemas/receiptSchema";

interface ReceiptFormProps {
  register: UseFormReturn<ReceiptFormData>["register"];
  errors: FieldErrors<ReceiptFormData>;
  fields: any[];
  addItem: () => void;
  removeItem: (index: number) => void;
  canRemoveItem: boolean;
  loading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  serverError: string | null;
}

const LANGUAGE_LABELS: Record<ReceiptLanguage, string> = {
  fi: "Suomi",
  en: "English",
};

export default function ReceiptForm({
  register,
  errors,
  fields,
  addItem,
  removeItem,
  canRemoveItem,
  loading,
  onSubmit,
  serverError,
}: ReceiptFormProps) {
  const t = useTranslations("SendReceipt");

  return (
    <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 flex-1">
        {/* Email & Language row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              startIcon={<Mail className="w-4 h-4" />}
              {...register("email")}
              error={!!errors.email}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Language Selector */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="language">{t("language")}</Label>
            <Select
              id="language"
              {...register("language")}
              startIcon={<Globe className="w-4 h-4" />}
            >
              {RECEIPT_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Customer Name & Plate Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">
              {t("customerName")} <span className="text-gray-400 font-normal">({t("optional")})</span>
            </Label>
            <Input
              id="customerName"
              placeholder={t("customerNamePlaceholder")}
              startIcon={<User className="w-4 h-4" />}
              {...register("customerName")}
            />
          </div>

          {/* Plate Number */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plate">{t("plate")}</Label>
            <Input
              id="plate"
              placeholder="ABC-123"
              startIcon={<Car className="w-4 h-4" />}
              {...register("plate", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              error={!!errors.plate}
            />
            {errors.plate && (
              <span className="text-xs text-red-500">{errors.plate.message}</span>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Invoice Items */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-900">{t("invoiceItems")}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addItem}
              className="text-primary hover:text-primaryhover hover:bg-primary/5"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("addItem")}
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <InvoiceItem
                key={field.id}
                index={index}
                register={register}
                onRemove={() => removeItem(index)}
                canRemove={canRemoveItem}
                serviceError={errors.items?.[index]?.service?.message}
                priceError={errors.items?.[index]?.price?.message}
                t={t}
              />
            ))}
          </div>

          {errors.items?.message && (
            <span className="text-xs text-red-500">{errors.items.message}</span>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Button type="submit" className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={20} spinColor="#fff" />
                {t("sending")}
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                {t("submit")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
