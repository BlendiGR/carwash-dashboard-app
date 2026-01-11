import CustomerSearch from "@/components/customers/customerSearch";
import CustomersTable from "@/components/customers/customersTable";
import UnassignedInvoices from "@/components/customers/UnassignedInvoices";
import { CustomersTableSkeleton } from "@/components/customers/skeletons/CustomersTableSkeleton";
import { Suspense } from "react";

interface CustomersPageProps {
  searchParams: Promise<{ page?: string; invoicePage?: string }>;
}

export default async function Customers({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="w-full max-w-384 mt-4 mx-auto">
      {/* Unassigned invoices section */}
      <Suspense fallback={null}>
        <UnassignedInvoices searchParams={searchParams} />
      </Suspense>

      {/* Search section */}
      <CustomerSearch />

      {/* Customers table */}
      <Suspense key={page} fallback={<CustomersTableSkeleton />}>
        <CustomersTable page={page} />
      </Suspense>
    </div>
  );
}

