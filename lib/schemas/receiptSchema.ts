import { z } from "zod";

/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Single invoice item schema */
export const invoiceItemSchema = z.object({
  id: z.string(),
  service: z.string().min(1, "Service name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a valid number",
    }),
});

/** Validation schema for send receipt form */
export const receiptSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Invalid email format"),
  customerName: z.string().optional(),
  plate: z.string().min(1, "Plate number is required"),
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required"),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type ReceiptFormData = z.infer<typeof receiptSchema>;
