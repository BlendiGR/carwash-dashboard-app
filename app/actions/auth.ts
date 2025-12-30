"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/ratelimit";

/**
 * Authenticates a user with email and password credentials.
 * Rate limited to 5 attempts per minute per IP.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Object with error message if authentication fails, undefined on success
 * @throws Rethrows non-AuthError exceptions
 */
export async function login(email: string, password: string) {
  const limit = await checkRateLimit("auth");
  if (!limit.success) return { error: limit.error };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

/**
 * Signs out the current user and redirects to the home page.
 *
 * @returns Promise that resolves when the user is signed out
 */
export async function logout() {
  await signOut({ redirectTo: "/" });
}
