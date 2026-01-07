import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCustomerById } from "@/app/actions/customers";
import CustomerInfo from "@/components/customers/customerInfo";
import CustomerForms from "@/components/customers/customerForms";
import { CustomerInfoSkeleton } from "@/components/customers/skeletons/CustomerInfoSkeleton";
import CustomerServicesTable from "@/components/customers/CustomerServicesTable";
import { CustomerServicesTableSkeleton } from "@/components/customers/skeletons/CustomerServicesTableSkeleton";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customerId = parseInt(id, 10);

  if (isNaN(customerId)) {
    notFound();
  }

  const t = await getTranslations("CustomerDetail");

  const result = await getCustomerById(customerId);
  if (!result.success) {
    notFound();
  }
  const customer = result.data;

  // Transform invoices to plain objects (convert Decimal to number)
  const invoices = customer.invoices.map((inv) => ({
    ...inv,
    totalAmount: Number(inv.totalAmount),
    totalTax: Number(inv.totalTax),
  }));

  return (
    <main className="max-w-384 mx-auto p-4">
      {/* Customer Info Section */}
      <div className="flex flex-col bg-gray-100 rounded-2xl p-6 shadow-md mb-6">
        <Suspense fallback={<CustomerInfoSkeleton />}>
          <CustomerInfo customer={customer} />
        </Suspense>
      </div>

      {/* Services Table Section */}
      <div className="flex flex-col bg-gray-100 rounded-2xl p-6 shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("services")}</h2>
        <Suspense fallback={<CustomerServicesTableSkeleton />}>
          <CustomerServicesTable
            customerId={customerId}
            tyres={customer.tyres}
            invoices={invoices}
          />
        </Suspense>
      </div>

      {/* Forms Section */}
      <div className="flex flex-col bg-gray-100 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("addToCustomer")}</h2>
        <CustomerForms customerId={customerId} customerPhone={customer.phone || ""} />
      </div>
    </main>
  );
}
