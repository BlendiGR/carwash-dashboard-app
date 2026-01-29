import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { generatePDF } from "@/services/pdf";
import ReceiptPDF from "@/components/pdf/ReceiptPDF";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const invoiceId = parseInt(id);

    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    const invoice = await prisma.invoices.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const messages = await import("@/messages/fi.json");
    const t = (key: string) => (messages.default.SendReceipt as any)[key] || key;

    const date = new Date(invoice.createdAt).toLocaleDateString("fi-FI", {
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

    const items = invoice.items.map((item, index) => ({
      id: String(item.id || index),
      service: item.service,
      price: item.price.toString(),
    }));

    const pdfComponent = ReceiptPDF({
      customerName: invoice.customer?.name || undefined,
      plate: invoice.plate,
      items: items,
      date,
      logoUrl: path.join(process.cwd(), "public", "logo-opus.png"),
      t,
      businessInfo,
    });

    const { buffer } = await generatePDF(pdfComponent, `kuitti-${invoice.plate}.pdf`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="kuitti-${invoice.plate}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download PDF error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
