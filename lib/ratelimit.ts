import "server-only";

import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";

/**
 * Postgres-backed fixed-window rate limiting.
 * Counters live in the RateLimit table, so limits are shared across
 * serverless instances and survive restarts without an external service.
 */
const LIMITS = {
  // General limiter for API routes and server actions: 10 requests per 10 seconds
  general: { max: 10, windowSeconds: 10 },
  // Stricter limiter for sensitive operations (login, password reset): 5 requests per minute
  auth: { max: 5, windowSeconds: 60 },
} as const;

type RateLimitType = keyof typeof LIMITS;

/**
 * Atomically increments the counter for a key, starting a new window if the
 * previous one has expired. Returns the request count within the current window.
 */
async function increment(key: string, windowSeconds: number): Promise<number> {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "windowStart")
    VALUES (${key}, 1, now() AT TIME ZONE 'UTC')
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."windowStart" <= (now() AT TIME ZONE 'UTC') - make_interval(secs => ${windowSeconds})
        THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "RateLimit"."windowStart" <= (now() AT TIME ZONE 'UTC') - make_interval(secs => ${windowSeconds})
        THEN now() AT TIME ZONE 'UTC'
        ELSE "RateLimit"."windowStart"
      END
    RETURNING "count"
  `;
  return rows[0].count;
}

/**
 * Occasionally removes expired rows so the table doesn't grow unbounded.
 */
async function cleanupExpired() {
  if (Math.random() > 0.01) return;
  await prisma.$executeRaw`
    DELETE FROM "RateLimit" WHERE "windowStart" < (now() AT TIME ZONE 'UTC') - interval '1 hour'
  `;
}

/**
 * @param type - "auth" for strict limiting (5/min), "general" for normal (10/10s)
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns Object with success status; if failed, includes error message
 */
export async function checkRateLimit(
  type: RateLimitType = "general",
  identifier?: string
): Promise<{ success: true } | { success: false; error: string }> {
  // Get IP from headers if no custom identifier provided (first entry is the client)
  const ip =
    identifier ??
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1";

  const { max, windowSeconds } = LIMITS[type];

  try {
    const count = await increment(`${type}:${ip}`, windowSeconds);
    await cleanupExpired();

    if (count > max) {
      const message =
        type === "auth"
          ? "Too many attempts. Please try again in a minute."
          : "Too many requests. Please slow down.";
      return { success: false, error: message };
    }
  } catch (error) {
    // Fail open: a rate limiter error shouldn't lock users out
    console.error("Rate limit error:", error);
  }

  return { success: true };
}
