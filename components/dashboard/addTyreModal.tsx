"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import Modal from "../ui/modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/Spinner";

import { useCreateTyre } from "@/hooks";
import { tyreSchema, TyreFormData } from "@/lib/schemas/tyreSchema";
import { fetchCustomers, fetchLocations } from "@/app/actions/tyrehotel";

interface AddTyreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Customer = { id: number; name: string; plate: string | null };

export default function AddTyreModal({ isOpen, onClose, onSuccess }: AddTyreModalProps) {
  const t = useTranslations("AddTyreModal");
  const { create, loading, error: hookError } = useCreateTyre();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TyreFormData>({
    resolver: zodResolver(tyreSchema),
    defaultValues: {
      plate: "",
      number: "",
      location: "",
      customerId: undefined,
    },
  });

  // Reset state and load data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Reset state synchronously before fetching
    reset();

    // Fetch data asynchronously
    fetchCustomers().then(setCustomers);
    fetchLocations().then(setLocations);
  }, [isOpen, reset]);

  // Auto-close on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose, onSuccess]);

  const onSubmit = async (data: TyreFormData) => {
    setServerError(null);

    const result = await create(data);

    if (result?.success) {
      setSuccess(true);
    } else {
      setServerError(hookError ?? result?.error ?? t("genericError"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("title")}>
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-900">{t("success")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plate">{t("plate")}</Label>
            <Input
              id="plate"
              placeholder="ABC-123"
              {...register("plate")}
              error={!!errors.plate}
            />
            {errors.plate && <span className="text-xs text-red-500">{errors.plate.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="number">{t("phone")}</Label>
            <Input
              id="number"
              placeholder="+358 40 123 4567"
              {...register("number")}
              error={!!errors.number}
            />
            {errors.number && <span className="text-xs text-red-500">{errors.number.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              list="locations"
              placeholder={t("locationPlaceholder")}
              {...register("location")}
              error={!!errors.location}
            />
            <datalist id="locations">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
            {errors.location && (
              <span className="text-xs text-red-500">{errors.location.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerId">{t("customer")}</Label>
            <select
              id="customerId"
              {...register("customerId", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              className="flex h-10 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-600"
            >
              <option value="">{t("noCustomer")}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.plate && `(${c.plate})`}
                </option>
              ))}
            </select>
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="rounded-xl min-w-[100px]" disabled={loading}>
              {loading ? <Spinner size={20} spinColor="#fff" /> : t("submit")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
