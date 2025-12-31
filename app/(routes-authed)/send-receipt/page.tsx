import ReceiptBuilder from "@/components/send-receipt/receiptBuilder";
import { getTranslations } from "next-intl/server";

export default async function SendReceipt() {
  const t = await getTranslations("send-receipt");

  return (
    <main>
      <ReceiptBuilder />
    </main>
  );
}
