"use server"

import { ActionResult } from "@/lib/action-result";
import { sendEmail } from "@/services/email";
import BugReport from "@/components/emails/BugReport";
import { bugReportSchema, BugReportFormData } from "@/lib/schemas/bugReportSchema";
import { requireAuth } from "@/lib/auth-utils";

const DEVELOPER_EMAIL = process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "";

/**
 * @param data - The bug report data
 * @returns An action result
 */
export async function submitBugReport(data: BugReportFormData): Promise<ActionResult<BugReportFormData>> {
  try {
    const session = await requireAuth();
    
    const bugReportData = bugReportSchema.safeParse(data);
    if (!bugReportData.success) {
      return { success: false, error: bugReportData.error.message };
    }
    
    const email = BugReport({
      subject: bugReportData.data.subject,
      description: bugReportData.data.description,
      reporterName: session.user?.name || "UNKNOWN",
    });

    await sendEmail({
      to: DEVELOPER_EMAIL,
      subject: bugReportData.data.subject,
      component: email,
    });

    return { success: true, data };

  } catch (error) {
    return { success: false, error: error as string };
  }
}
