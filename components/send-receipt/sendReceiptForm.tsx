"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, User, Car, Plus, Globe } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/select";
import InvoiceItem from "./invoiceItem";
import InvoicePreview from "./invoicePreview";
import SuccessMessage from "./successMessage";

import { useLoading, useInvoiceForm } from "@/hooks";
import { sendReceipt } from "@/app/actions/sendReceipt";
import { RECEIPT_LANGUAGES, ReceiptLanguage } from "@/lib/schemas/receiptSchema";

/** Language display labels */
const LANGUAGE_LABELS: Record<ReceiptLanguage, string> = {
  fi: "Suomi",
  en: "English",
};

export default function SendReceiptForm() {
  const t = useTranslations("SendReceipt");
  const { loading, withLoading } = useLoading();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    form,
    register,
    fields,
    watchedValues,
    addItem,
    removeItem,
    resetForm,
    canRemoveItem,
  } = useInvoiceForm();

  const { handleSubmit, formState: { errors } } = form;

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);

    await withLoading(async () => {
      try {
        await sendReceipt(data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          resetForm();
        }, 3000);
      } catch {
        setServerError(t("genericError"));
      }
    });
  });

  if (success) {
    return <SuccessMessage title={t("success")} description={t("successDescription")} />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-primary to-primaryhover" />

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
              <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {/* Email & Language row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Email - takes 2 columns */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    startIcon={<Mail className="w-4 h-4" />}
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
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

              {/* Customer Name (Optional) */}
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
                  className={errors.plate ? "border-red-500" : ""}
                />
                {errors.plate && (
                  <span className="text-xs text-red-500">{errors.plate.message}</span>
                )}
              </div>

              {/* Invoice Items */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>{t("invoiceItems")}</Label>
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

                {/* Items Header */}
                <div className="flex gap-3 text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
                  <span className="flex-1">{t("service")}</span>
                  <span className="w-28">{t("priceWithVat")}</span>
                  <span className="w-9" />
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

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size={20} spinColor="#fff" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {t("submit")}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
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
