"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";
import ForgotPasswordCodeConfirmForm from "@/components/login/ForgotPasswordCodeConfirmForm";
import { forgotPassword, verifyResetCode } from "@/app/actions/password";
import { useLoading } from "@/hooks";

export default function ForgotPasswordClient() {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading, loading } = useLoading();

  const handleSendForgotPassEmail = async (data: { email: string }) => {
    startLoading();
    setError(null);
    const result = await forgotPassword(data.email);
    if (result.success) {
      setEmail(data.email);
      setIsEmailSent(true);
      stopLoading();
    } else {
      setError(result.message);
      stopLoading();
    }
  };

  const handleForgotPassCodeConfirm = async (data: { code: string }) => {
    startLoading();
    setError(null);
    const result = await verifyResetCode(email, data.code);

    if (result.success && result.resetToken) {
      // Redirect to reset password page with the UUID token
      router.push(`/reset-password/${result.resetToken}`);
    } else {
      setError(result.message);
      stopLoading();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gradient">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <Image
          src="/logo-opus.png"
          alt="opus logo"
          width={400}
          height={400}
          className="w-60 object-contain"
          priority
        />

        <div className="flex w-full max-w-md flex-col items-center justify-center relative gap-8 p-5 shadow-md border border-gray-200 rounded-2xl">
          <div className="flex w-full flex-col absolute top-0 left-0 items-center text-center justify-center gap-2 rounded-t-2xl bg-primary-gradient p-6 text-white">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-white">{t("subtitle")}</p>
          </div>
          <div className="pt-30 w-full">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            {!isEmailSent ? (
              <ForgotPasswordForm onSubmitEmail={handleSendForgotPassEmail} loading={loading} />
            ) : (
              <ForgotPasswordCodeConfirmForm
                onSubmitCode={handleForgotPassCodeConfirm}
                email={email}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
