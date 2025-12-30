"use server";

import { ReceiptFormData, receiptSchema } from "@/lib/schemas/receiptSchema";
import { sendEmail } from "@/services/email";
import { generatePDF } from "@/services/pdf";
import Receipt from "@/components/emails/Receipt";
import ReceiptPDF from "@/components/pdf/ReceiptPDF";
import { APP_URL } from "@/lib/constants";
import { requireAuth } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/ratelimit";

/** Default translations for the PDF (Finnish) */
const pdfTranslations = {
  invoice: "Kuitti",
  customer: "Asiakas",
  plate: "Rekisterinumero",
  service: "Palvelu",
  price: "Hinta",
  subtotal: "Välisumma",
  vat: "ALV",
  total: "Yhteensä",
  thankYou: "Kiitos kun valitsit AutoSpa Opuksen!",
  footer: "Odotamme innolla palvelevamme sinua uudelleen.",
};

/**
 * Sends a receipt email with an attached PDF invoice.
 * Rate limited to prevent abuse.
 *
 * @param data - Receipt form data (email, customer info, items)
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

  // Format date for PDF
  const date = new Date().toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate PDF
  const pdfComponent = ReceiptPDF({
    customerName: data.customerName,
    plate: data.plate,
    items: data.items,
    date,
    logoUrl: `${APP_URL}/logo-opus.png`,
    translations: pdfTranslations,
  });

  const { buffer, filename } = await generatePDF(pdfComponent, `kuitti-${data.plate}.pdf`);

  // Generate email component
  const emailComponent = Receipt(data);

  // Send email with PDF attachment
  const result = await sendEmail({
    to: data.email,
    subject: "Kuitti - AutoSpa Opus",
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
