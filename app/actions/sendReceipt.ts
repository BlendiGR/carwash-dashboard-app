"use server";

import { ReceiptFormData, receiptSchema, ReceiptLanguage } from "@/lib/schemas/receiptSchema";
import { sendEmail } from "@/services/email";
import { generatePDF } from "@/services/pdf";
import Receipt from "@/components/emails/Receipt";
import ReceiptPDF from "@/components/pdf/ReceiptPDF";
import { APP_URL } from "@/lib/constants";
import { requireAuth } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/ratelimit";

/** Date format locale mapping */
const DATE_LOCALES: Record<ReceiptLanguage, string> = {
  fi: "fi-FI",
  en: "en-US",
};

/** Email subject by language */
const EMAIL_SUBJECTS: Record<ReceiptLanguage, string> = {
  fi: "Kuitti - AutoSpa Opus",
  en: "Receipt - AutoSpa Opus",
};

/**
 * Sends a receipt email with an attached PDF invoice.
 */
export async function sendReceipt(data: ReceiptFormData) {
  try {
    await requireAuth();

    const limit = await checkRateLimit("general");
    if (!limit.success) return { success: false, error: limit.error };

    const validated = receiptSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid receipt data" };
    }

    const language = data.language;

    let messages;
    switch (language) {
      case "fi":
        messages = await import("@/messages/fi.json");
        break;
      case "en":
        messages = await import("@/messages/en.json");
        break;
      default:
        messages = await import("@/messages/fi.json");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (key: string) => (messages.default.SendReceipt as any)[key] || key;

    const date = new Date().toLocaleDateString(DATE_LOCALES[language], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const businessInfo = {
      phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "",
      email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "",
      website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "",
      address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
      ytunnus: process.env.NEXT_PUBLIC_COMPANY_YTUNNUS || "",
    };

    const pdfComponent = ReceiptPDF({
      customerName: data.customerName,
      plate: data.plate,
      items: data.items,
      date,
      logoUrl: `${APP_URL}/logo-opus.png`,
      t,
      businessInfo,
    });

    const { buffer, filename } = await generatePDF(pdfComponent, `kuitti-${data.plate}.pdf`);

    const emailComponent = Receipt({
      customerName: data.customerName,
      plate: data.plate,
      t,
    });

    await sendEmail({
      to: data.email,
      subject: EMAIL_SUBJECTS[language],
      component: emailComponent,
      attachments: [
        {
          filename,
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send receipt:", error);
    return { success: false, error: "Failed to send receipt. Please try again." };
  }
}
