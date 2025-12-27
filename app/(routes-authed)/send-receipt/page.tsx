import SendReceiptForm from "@/components/send-receipt/sendReceiptForm";

export default function SendReceipt() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Send Invoice</h1>
        <p className="text-gray-500 mt-1">Create and send invoices to your customers</p>
      </div>
      <SendReceiptForm />
    </div>
  );
}
