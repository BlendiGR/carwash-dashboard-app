"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/prisma/prisma";
import { sendEmail } from "@/services/email";
import PasswordChangeCode from "@/components/emails/PasswordChangeCode";
import crypto from "crypto";
import { cookies } from "next/headers";
import { RESET_TOKEN_EXPIRY_MS } from "@/lib/constants";
import { checkRateLimit } from "@/lib/ratelimit";

/**
 * Generates a cryptographically secure 6-digit code.
 *
 * @returns A 6-digit string code
 */
function generateSecureCode(): string {
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

/**
 * Initiates the password reset flow for a user.
 * Rate limited to 5 requests per minute.
 *
 * @param email - The email address of the user requesting a password reset
 * @returns Object with success status and message
 */
export async function forgotPassword(email: string) {
  const limit = await checkRateLimit("auth");
  if (!limit.success) return { success: false, message: limit.error };

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if email exists or not for security
    return { success: true, message: "If the email exists, a reset code has been sent." };
  }

  const code = generateSecureCode();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await prisma.passwordResetToken.create({
    data: {
      token: code,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });

  const store = await cookies();
  const locale = store.get("locale")?.value || "en";
  
  // Get translation function for PasswordEmail namespace
  // Fallback will happen automatically if locale isn't found
  const t = await getTranslations({ locale, namespace: "PasswordEmail" });

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Code - AutoSpa Opus",
      component: PasswordChangeCode({
        name: user.name || "User",
        code,
        t, // Pass translation function directly
      }),
    });

    return { success: true, message: "Reset code sent to your email." };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return { success: false, message: "Failed to send email. Please try again." };
  }
}
