"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/ratelimit";

/**
 * Authenticates a user with email and password credentials.
 * Rate limited to 5 attempts per minute per IP.
 */
export async function login(email: string, password: string) {
  try {
    const limit = await checkRateLimit("auth");
    if (!limit.success) return { success: false, error: limit.error };

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    throw error;
  }
}

/**
 * Signs out the current user and redirects to the home page.
 */
export async function logout() {
  await signOut({ redirectTo: "/" });
}
