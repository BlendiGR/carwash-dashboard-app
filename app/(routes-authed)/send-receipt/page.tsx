import SendReceiptForm from "@/components/send-receipt/sendReceiptForm";

export default function SendReceipt() {
  return (
    <main>
      <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 max-w-[1450px] mx-auto sm:p-6 md:p-8 gap-4 shadow-md">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Send Invoice</h1>
          <p className="text-gray-500 mt-1">Create and send invoices to your customers</p>
        </div>
        <SendReceiptForm />
      </div>
    </main>
  );
}
