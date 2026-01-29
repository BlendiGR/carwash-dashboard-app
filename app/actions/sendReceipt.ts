"use server";

import { ReceiptFormData, receiptSchema, ReceiptLanguage } from "@/lib/schemas/receiptSchema";
import { sendEmail } from "@/services/email";
import { generatePDF } from "@/services/pdf";
import Receipt from "@/components/emails/Receipt";
import ReceiptPDF from "@/components/pdf/ReceiptPDF";
import { requireAuth } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/ratelimit";
import { prisma } from "@/prisma/prisma";
import { ActionResult } from "@/lib/action-result";
import path from "path";

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
 * Finds a customer ID by email first, then by plate (via Tyre).
 */
async function findCustomerId(email: string, plate: string): Promise<number | null> {
  // Try to find by email first
  const customerByEmail = await prisma.customer.findUnique({
    where: { email },
    select: { id: true },
  });
  if (customerByEmail) return customerByEmail.id;

  // Try to find by plate via Tyre
  const tyre = await prisma.tyre.findUnique({
    where: { plate },
    select: { customerId: true },
  });
  if (tyre?.customerId) return tyre.customerId;

  return null;
}



/**
 * Sends a receipt email with an attached PDF invoice.
 * Saves the invoice to the database and links to customer if found.
 */
export async function sendReceipt(data: ReceiptFormData): Promise<ActionResult<null>> {
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
      logoUrl: path.join(process.cwd(), "public", "logo-opus.png"),
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

    // Calculate totals
    const VAT_RATE = 0.255;
    const totalAmount = data.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const totalTax = totalAmount * (VAT_RATE / (1 + VAT_RATE));

    // Find customer by email or plate
    const customerId = await findCustomerId(data.email, data.plate);

    // Save invoice to database
    await prisma.invoices.create({
      data: {
        plate: data.plate,
        items: {
          create: data.items.map((item) => ({
            service: item.service,
            price: parseFloat(item.price),
          })),
        },
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalTax: parseFloat(totalTax.toFixed(2)),
        customerId,
      },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("Failed to send receipt:", error);
    return { success: false, error: "Failed to send receipt. Please try again." };
  }
}

