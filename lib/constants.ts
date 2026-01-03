/** Pagination page size for tyre listings */
export const PAGE_SIZE = 12;

/** Password reset token expiration time in milliseconds (10 minutes) */
export const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000;

/** App name used in emails and UI */
export const APP_NAME = "AutoSpa Opus";

/** Base URL for the application (used for generating absolute URLs) */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Phone number regex - supports international formats like +358 40 123 4567, 040-1234567, etc. */
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
