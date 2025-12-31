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
 * Uses next-intl translations based on selected language.
 *
 * @param data - Receipt form data (email, customer info, items, language)
 * @returns Promise resolving to the sent message info or error
 */
export async function sendReceipt(data: ReceiptFormData) {
  await requireAuth();

  // Rate limit email sending
  const limit = await checkRateLimit("general");
  if (!limit.success) return { success: false, error: limit.error };

  // Server-side validation
  const validated = receiptSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid receipt data" };
  }

  const language = data.language;

  // Determine translation map manually to bypass next-intl request context issues
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

  // Create a simple t function for the "SendReceipt" namespace
  const t = (key: string) => (messages.default.SendReceipt as any)[key] || key;

  console.log("SendReceipt Action Debug:", {
    inputLanguage: language,
    emailSubject: EMAIL_SUBJECTS[language],
    sampleTranslation: t("invoiceTitle")
  });

  // Format date in selected locale
  const date = new Date().toLocaleDateString(DATE_LOCALES[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Business info from environment
  const businessInfo = {
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "",
    website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
    ytunnus: process.env.NEXT_PUBLIC_COMPANY_YTUNNUS || "",
  };

  // Generate PDF with localized translations
  const pdfComponent = ReceiptPDF({
    customerName: data.customerName,
    plate: data.plate,
    items: data.items,
    date,
    logoUrl: `${APP_URL}/logo-opus.png`,
    t, // Pass translation function directly
    businessInfo,
  });

  const { buffer, filename } = await generatePDF(pdfComponent, `kuitti-${data.plate}.pdf`);

  // Generate email component with localized content
  const emailComponent = Receipt({
    customerName: data.customerName,
    plate: data.plate,
    t, // Pass translation function directly
  });

  // Send email with PDF attachment
  const result = await sendEmail({
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

  return result;
}
