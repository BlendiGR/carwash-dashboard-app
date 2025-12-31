"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ResetPasswordForm from "./ResetPasswordForm";
import { resetPassword } from "@/app/actions/password";

interface ResetPasswordClientProps {
  resetToken: string;
  userName: string | null;
}

export default function ResetPasswordClient({ resetToken, userName }: ResetPasswordClientProps) {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (data: { newPassword: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(resetToken, data.newPassword);

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError(t("genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{t("successTitle")}</h2>
        <p className="text-gray-600">{t("successMessage")}</p>
        <p className="text-sm text-gray-500">{t("redirecting")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {userName && (
        <p className="text-sm text-gray-600 mb-4">
          {t("resettingFor")} <span className="font-medium">{userName}</span>
        </p>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
    </div>
  );
}
