"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function ForgotPassword() {
    const t = useTranslations("Login");
    const router = useRouter();
    
    return (
        <div>
            <Button variant="link" size="link" type="button" className="text-primary" aria-label="Forgot Password" onClick={() => router.push("/forgot-password")}>
                {t("forgotPassword")}
            </Button>
        </div>
    );
}