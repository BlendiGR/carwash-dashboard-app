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

const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
  code: z.string(t("codeInvalid")).min(6, t("codeMinLength")).max(6, t("codeMaxLength")),
});

type ForgotPasswordData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export default function ForgotPasswordCodeConfirmForm({ 
  onSubmitCode,
  email 
}: { 
  onSubmitCode: (data: ForgotPasswordData) => void | Promise<void>;
  email: string;
}) {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();
  
  const forgotPasswordSchema = createForgotPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitCode)} className="flex flex-col gap-4 w-full">
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          {t("codeSentTo")}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {email}
        </p>
      </div>
      <FormField label={t("codeLabel")} error={errors.code?.message}>
        <Input
          type="text"
          placeholder={t("codePlaceholder")}
          startIcon={<Mail className="size-4 text-gray-400" />}
          {...register("code")}
        />
      </FormField>
      <Button type="submit" size="lg">
        {t("verifyCode")}
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