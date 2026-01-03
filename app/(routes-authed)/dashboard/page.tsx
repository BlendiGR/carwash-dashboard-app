import { Suspense } from "react";
import DashboardStats from "@/components/dashboard/dashboardStats";
import DashboardSearch from "@/components/dashboard/dashboardSearch";
import TyreList from "@/components/dashboard/TyreList";
import { StatsSkeleton, TyreListSkeleton } from "@/components/dashboard/skeletons";

interface DashboardPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    stored?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const query = params.query;
  const page = Number(params.page) || 1;
  const isStored = params.stored !== "false";

  return (
    <main className="max-w-384 mx-auto">
      {/* Stats Section */}
      <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 sm:p-6 md:p-8 gap-4 shadow-md">
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>

      {/* Tyre List Section */}
      <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 sm:p-6 md:p-8 gap-4 shadow-md">
        <DashboardSearch />
        <Suspense key={`${query}-${page}-${isStored}`} fallback={<TyreListSkeleton />}>
          <TyreList query={query} page={page} isStored={isStored} />
        </Suspense>
      </div>
    </main>
  );
}
