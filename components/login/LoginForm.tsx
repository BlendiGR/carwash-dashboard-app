"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { loginSchema, LoginData } from "@/lib/schemas/loginSchema";
import { login } from "@/app/actions/auth";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Key } from "lucide-react";
import { useLoading } from "@/hooks";
import { Spinner } from "../ui/Spinner";
import { ForgotPassword } from "./forgotPassword";

export function LoginForm() {
  const t = useTranslations("Login");
  const [authError, setAuthError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setAuthError(null);

    await withLoading(async () => {
      const result = await login(data.email, data.password);

      if (result?.error) {
        setAuthError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Login Form"
      className="flex flex-col gap-4 w-full"
    >
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {authError}
        </div>
      )}
      <FormField label={t("email")} error={errors.email?.message}>
        <Input
          type="email"
          placeholder={t("email")}
          startIcon={<Mail className="size-4 text-gray-400" />}
          {...register("email")}
        />
      </FormField>
      <FormField label={t("password")} error={errors.password?.message}>
        <Input
          type="password"
          placeholder={t("password")}
          startIcon={<Key className="size-4 text-gray-400" />}
          {...register("password")}
        />
      </FormField>
      <ForgotPassword />
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner size={18} spinColor="white" ringColor="rgba(255,255,255,0.3)" />
            {t("loading")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
