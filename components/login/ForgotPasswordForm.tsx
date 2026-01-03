"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { FormField } from "../ui/form";
import { Button } from "../ui/button";
import { Mail, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm({
  onSubmitEmail,
  loading,
}: {
  onSubmitEmail: (data: ForgotPasswordData) => void | Promise<void>;
  loading: boolean;
}) {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitEmail)} className="flex flex-col gap-4 w-full">
      <FormField label={t("email")} error={errors.email?.message}>
        <Input
          type="email"
          placeholder={t("email")}
          startIcon={<Mail className="size-4 text-gray-400" />}
          {...register("email")}
        />
      </FormField>
      <Button type="submit" size="lg" loading={loading}>
        {t("submit")}
      </Button>
      <Button
        type="button"
        variant="link"
        size="link"
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-primary"
      >
        <ArrowLeft className="size-4" />
        {t("backToLogin")}
      </Button>
    </form>
  );
}
