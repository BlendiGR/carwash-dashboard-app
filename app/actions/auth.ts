"use server";

/**
 * Authentication Server Actions
 *
 * This file contains server-side actions for managing user authentication,
 * including login and logout functionality using NextAuth.
 */

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Authenticates a user with email and password credentials.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Object with error message if authentication fails, undefined on success
 * @throws Rethrows non-AuthError exceptions
 */
export async function login(email: string, password: string) {
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
