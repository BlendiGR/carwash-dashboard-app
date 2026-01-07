"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Bug } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SuccessMessage from "@/components/ui/successMessage";
import { useLoading } from "@/hooks";
import { bugReportSchema, BugReportFormData } from "@/lib/schemas/bugReportSchema";
import { submitBugReport } from "@/app/actions/settings";

export default function BugReportForm() {
  const t = useTranslations("Settings");
  const { loading, success, setSuccess, serverError, setServerError, withLoading, resetState } =
    useLoading();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BugReportFormData>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: BugReportFormData) => {
    await withLoading(async () => {
      const result = await submitBugReport(data);
      if (!result.success) {
        setServerError(result.error || t("genericError"));
        return;
      }
      setSuccess(true);
      reset();
    });
  };

  if (success) {
    return (
      <SuccessMessage
        title={t("bugReportSuccess")}
        description={t("bugReportSuccessDescription")}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
          <Bug size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("bugReport")}</h2>
          <p className="text-sm text-gray-500">{t("bugReportSubtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-4 space-y-4">
        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject">{t("subject")}</Label>
          <Input
            id="subject"
            placeholder={t("subjectPlaceholder")}
            {...register("subject")}
            error={!!errors.subject}
          />
          {errors.subject && (
            <span className="text-xs text-red-500">{errors.subject.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">{t("description")}</Label>
          <textarea
            id="description"
            placeholder={t("descriptionPlaceholder")}
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-base outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            {...register("description")}
          />
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description.message}</span>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" className="rounded-xl" loading={loading}>
            {t("submitBugReport")}
          </Button>
        </div>
      </form>
    </>
  );
}
