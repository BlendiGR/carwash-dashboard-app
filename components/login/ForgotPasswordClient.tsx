"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";
import ForgotPasswordCodeConfirmForm from "@/components/login/ForgotPasswordCodeConfirmForm";
import { forgotPassword } from "@/app/actions/forgotpassword";

export default function ForgotPasswordClient() {
  const t = useTranslations("ForgotPassword");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendForgotPassEmail = async (data: { email: string }) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setEmail(data.email);
      setIsEmailSent(true);
    }
  };

  const handleForgotPassCodeConfirm = async (data: { code: string }) => {
    // TODO: Implement code verification logic
    console.log("Code submitted:", data.code);
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
            {!isEmailSent ? (
              <ForgotPasswordForm onSubmitEmail={handleSendForgotPassEmail} />
            ) : (
              <ForgotPasswordCodeConfirmForm 
                onSubmitCode={handleForgotPassCodeConfirm} 
                email={email}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
