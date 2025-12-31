"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useLoading, useInvoiceForm } from "@/hooks";
import { sendReceipt } from "@/app/actions/sendReceipt";
import SuccessMessage from "./successMessage";
import ReceiptForm from "./receiptForm";
import ReceiptPreviewSection from "./receiptPreviewSection";

export default function ReceiptBuilder() {
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 m-4">
        <ReceiptForm
          register={register}
          errors={errors}
          fields={fields}
          addItem={addItem}
          removeItem={removeItem}
          canRemoveItem={canRemoveItem}
          loading={loading}
          onSubmit={onSubmit}
          serverError={serverError}
        />
        <ReceiptPreviewSection watchedValues={watchedValues} />
      </div>
    </div>
  );
}
