import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Upstash Redis client for rate limiting.
 * Uses REST API, compatible with edge runtime.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * General rate limiter for API routes and server actions.
 * Allows 10 requests per 10 seconds using sliding window algorithm.
 */
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "autospa:ratelimit",
});

/**
 * Stricter rate limiter for sensitive operations (login, password reset).
 * Allows 5 requests per minute.
 */
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "autospa:auth:ratelimit",
});

type RateLimitType = "auth" | "general";

/**
 * Checks rate limit for the current request.
 * Use at the start of server actions to protect against abuse.
 *
 * @param type - "auth" for strict limiting (5/min), "general" for normal (10/10s)
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns Object with success status; if failed, includes error message
 *
 * @example
 * ```ts
 * export async function login(email: string, password: string) {
 *   const limit = await checkRateLimit("auth");
 *   if (!limit.success) return { error: limit.error };
 *   // ... rest of your action
 * }
 * ```
 */
export async function checkRateLimit(
  type: RateLimitType = "general",
  identifier?: string
): Promise<{ success: true } | { success: false; error: string }> {
  // Get IP from headers if no custom identifier provided
  const ip = identifier ?? (await headers()).get("x-forwarded-for") ?? "127.0.0.1";

  const limiter = type === "auth" ? authRatelimit : ratelimit;
  const { success } = await limiter.limit(ip);

  if (!success) {
    const message =
      type === "auth"
        ? "Too many attempts. Please try again in a minute."
        : "Too many requests. Please slow down.";
    return { success: false, error: message };
  }

  return { success: true };
}
