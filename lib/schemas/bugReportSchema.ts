import { z } from "zod";

/** Validation schema for bug report form */
export const bugReportSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
});

export type BugReportFormData = z.infer<typeof bugReportSchema>;
