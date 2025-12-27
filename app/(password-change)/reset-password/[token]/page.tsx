import { redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ResetPasswordClient from "@/components/login/ResetPasswordClient";
import { validateResetToken } from "@/app/actions/resetPassword";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  const t = await getTranslations("ResetPassword");

  // Validate token server-side
  const validation = await validateResetToken(token);

  if (!validation.valid) {
    // Redirect to forgot password if token is invalid
    redirect("/forgot-password");
  }

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
            <ResetPasswordClient resetToken={token} userName={validation.name ?? null} />
          </div>
        </div>
      </div>
    </main>
  );
}
