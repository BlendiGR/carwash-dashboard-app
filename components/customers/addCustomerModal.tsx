"use client";

import Modal from "../ui/modal";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/lib/schemas/customerSchema";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useLoading } from "@/hooks";

export default function AddCustomerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Customers");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema(t)),
  });
  const { loading, withLoading } = useLoading();

  const onSubmit = async (data: FieldValues) => {
    await withLoading(async () => {
      console.log(data);
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} title={t("addCustomerTitle")}>
        <div className="space-y-4">
          <form className="flex flex-col gap-4">
            <FormField label={t("customerName")} error={errors.customerName?.message}>
              <Input {...register("customerName")} error={!!errors.customerName} />
            </FormField>
            <FormField label={t("customerEmail")} error={errors.customerEmail?.message}>
              <Input {...register("customerEmail")} error={!!errors.customerEmail} />
            </FormField>
            <FormField label={t("customerPhone")} error={errors.customerPhone?.message}>
              <Input {...register("customerPhone")} error={!!errors.customerPhone} />
            </FormField>
            <FormField label={t("customerPlate")} error={errors.customerPlate?.message}>
              <Input {...register("customerPlate")} error={!!errors.customerPlate} />
            </FormField>
            <FormField label={t("customerCompany")} error={errors.customerCompany?.message}>
              <Input {...register("customerCompany")} error={!!errors.customerCompany} />
            </FormField>
          </form>
          <div className="flex flex-row gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)} loading={loading}>
              {t("addCustomer")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
