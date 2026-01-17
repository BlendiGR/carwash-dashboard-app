"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { loginSchema } from "@/lib/schemas/loginSchema";

/**
 * Authenticates a user with email and password credentials.
 * Rate limited to 5 attempts per minute per IP.
 */
export async function login(email: string, password: string) {
  try {
    const validated = loginSchema.safeParse({ email, password });
    if (!validated.success) {
      return { success: false, error: "Invalid credentials format" };
    }

    const limit = await checkRateLimit("auth");
    if (!limit.success) return { success: false, error: limit.error };

    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
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
