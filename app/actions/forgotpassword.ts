"use server"

import { prisma } from "@/prisma/prisma";
import { sendEmail } from "@/services/email";
import PasswordChangeCode from "@/components/emails/PasswordChangeCode";
import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit code
 */
function generateSecureCode(): string {
  // Generate a random 6-digit number (100000 to 999999)
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

export async function forgotPassword(email: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if email exists or not for security
    return { success: true, message: "If the email exists, a reset code has been sent." };
  }

  // Generate secure 6-digit code
  const code = generateSecureCode();
  
  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store the code in database
  await prisma.passwordResetToken.create({
    data: {
      token: code,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });

  // Send email with the code
  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Code - AutoSpa Opus",
      component: PasswordChangeCode({ 
        name: user.name || "User", 
        code 
      }),
    });

    return { success: true, message: "Reset code sent to your email." };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return { success: false, message: "Failed to send email. Please try again." };
  }
}