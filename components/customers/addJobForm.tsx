"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Check, Car, MapPin, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SuccessMessage from "@/components/ui/successMessage";
import { addJobToCustomer } from "@/app/actions/customers";
import { fetchLocations } from "@/app/actions/tyrehotel";
import { jobSchema, JobFormData } from "@/lib/schemas/jobSchema";
import { useLoading } from "@/hooks";
import { useState } from "react";

interface AddJobFormProps {
  customerId: number;
  customerPhone: string;
}

export default function AddJobForm({ customerId, customerPhone }: AddJobFormProps) {
  const t = useTranslations("CustomerDetail");
  const [locations, setLocations] = useState<string[]>([]);
  const { loading, success, setSuccess, serverError, setServerError, withLoading, resetState } =
    useLoading();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      plate: "",
      number: customerPhone,
      location: "",
    },
  });

  useEffect(() => {
    fetchLocations().then((result) => {
      if (result.success) setLocations(result.data);
    });
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetState();
        reset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, reset, resetState]);

  const onSubmit = async (data: JobFormData) => {
    await withLoading(async () => {
      const result = await addJobToCustomer(customerId, data);

      if (result.success) {
        setSuccess(true);
      } else {
        setServerError(result.error ?? t("genericError"));
      }
    });
  };

  if (success) {
    return <SuccessMessage title={t("jobSuccess")} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white rounded-xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Plate */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="plate">{t("jobPlate")}</Label>
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
          {errors.plate && <span className="text-xs text-red-500">{errors.plate.message}</span>}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">{t("jobLocation")}</Label>
          <Input
            id="location"
            list="locations"
            placeholder={t("jobLocationPlaceholder")}
            startIcon={<MapPin className="w-4 h-4" />}
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
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" className="rounded-xl min-w-28" loading={loading}>
          {t("addJobButton")}
        </Button>
      </div>
    </form>
  );
}
