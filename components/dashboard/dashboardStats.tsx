"use client";

import { Package, Users, MapPin } from "lucide-react";
import { useCustomerCount } from "@/hooks";
import DashboardCard from "./dashboardCard";
import { useTranslations } from "next-intl";
import { useTyreContext } from "@/contexts/TyreContext";

export default function DashboardStats() {
  const t = useTranslations("Dashboard");
  const { counts: tyreCounts, countsLoading: tyreLoading } = useTyreContext();
  const { count: customerCount, loading: customerLoading } = useCustomerCount();

  const loading = tyreLoading || customerLoading;

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard
          title={t("totalTyres")}
          value={tyreCounts.total}
          icon={<Package className="w-6 h-6" />}
          accentColor="blue"
        />
        <DashboardCard
          title={t("totalCustomers")}
          value={customerCount}
          icon={<Users className="w-6 h-6" />}
          accentColor="green"
        />
      </div>
      {tyreCounts.countsByLocation.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tyreCounts.countsByLocation.map((loc) => (
            <div
              key={loc.location}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <MapPin className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 text-center truncate w-full">
                {loc.location}
              </span>
              <span className="text-lg font-bold text-gray-800">{loc.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
