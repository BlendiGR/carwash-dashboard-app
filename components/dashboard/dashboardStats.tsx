import { Package, Users, MapPin } from "lucide-react";
import { tyreCounts, customerCount } from "@/app/actions/tyrehotel";
import DashboardCard from "./dashboardCard";
import { getTranslations } from "next-intl/server";

/**
 * Dashboard statistics section - Server Component
 *
 * Fetches and displays tyre counts, customer count, and location breakdown.
 * Uses Suspense for loading state (skeleton is handled by parent).
 */
export default async function DashboardStats() {
  const t = await getTranslations("Dashboard");

  const [counts, custCount] = await Promise.all([tyreCounts(), customerCount()]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard
          title={t("totalTyres")}
          value={counts.total}
          icon={<Package className="w-6 h-6" />}
          accentColor="blue"
        />
        <DashboardCard
          title={t("totalCustomers")}
          value={custCount}
          icon={<Users className="w-6 h-6" />}
          accentColor="green"
        />
      </div>
      {counts.countsByLocation.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {counts.countsByLocation.map((loc) => (
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
