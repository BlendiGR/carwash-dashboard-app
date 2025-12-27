"use client";

import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Check, Mail, User, Car, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import InvoiceItem from "./invoiceItem";
import InvoicePreview from "./invoicePreview";

import { useLoading } from "@/hooks";
import { receiptSchema, ReceiptFormData } from "@/lib/schemas/receiptSchema";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function SendReceiptForm() {
  const t = useTranslations("SendReceipt");
  const { loading, withLoading } = useLoading();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      email: "",
      customerName: "",
      plate: "",
      items: [{ id: generateId(), service: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch form values for live preview
  const watchedValues = watch();

  const addItem = useCallback(() => {
    append({ id: generateId(), service: "", price: "" });
  }, [append]);

  const resetForm = useCallback(() => {
    reset({
      email: "",
      customerName: "",
      plate: "",
      items: [{ id: generateId(), service: "", price: "" }],
    });
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);

    await withLoading(async () => {
      try {
        // TODO: Implement the actual send receipt action
        console.log("Sending receipt:", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

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
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">{t("success")}</p>
            <p className="text-sm text-gray-500">{t("successDescription")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-primaryhover" />

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("title")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
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
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Customer Name (Optional) */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customerName">
                  {t("customerName")}{" "}
                  <span className="text-gray-400 font-normal">
                    ({t("optional")})
                  </span>
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
                  {...register("plate")}
                  className={errors.plate ? "border-red-500" : ""}
                />
                {errors.plate && (
                  <span className="text-xs text-red-500">
                    {errors.plate.message}
                  </span>
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
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 1}
                      serviceError={errors.items?.[index]?.service?.message}
                      priceError={errors.items?.[index]?.price?.message}
                      translations={{
                        servicePlaceholder: t("servicePlaceholder"),
                        pricePlaceholder: t("pricePlaceholder"),
                        remove: t("remove"),
                      }}
                    />
                  ))}
                </div>

                {errors.items?.message && (
                  <span className="text-xs text-red-500">
                    {errors.items.message}
                  </span>
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
          translations={{
            preview: t("preview"),
            invoice: t("invoiceTitle"),
            customer: t("customerName"),
            plate: t("plate"),
            service: t("service"),
            price: t("price"),
            subtotal: t("subtotal"),
            vat: t("vat"),
            total: t("total"),
            noItems: t("noItems"),
            thankYou: t("thankYou"),
          }}
        />
      </div>
    </div>
  );
}