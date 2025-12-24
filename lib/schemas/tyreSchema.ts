import { z } from "zod";

// Finnish plate format: ABC-123, AB-1, ABC-1, etc.
const FINNISH_PLATE_REGEX = /^[A-ZÄÖÅ]{2,3}-\d{1,3}$/i;

// Phone number: digits, spaces, dashes, plus allowed
const PHONE_REGEX = /^[\d\s\-+()]+$/;

export const tyreSchema = z.object({
  plate: z
    .string()
    .min(1, "Plate is required")
    .regex(FINNISH_PLATE_REGEX, "Invalid Finnish plate format (e.g., ABC-123)"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid phone number format"),
  location: z.string().min(1, "Location is required"),
  customerId: z.number().optional(),
});

export type TyreFormData = z.infer<typeof tyreSchema>;
