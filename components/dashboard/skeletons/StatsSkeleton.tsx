/**
 * Skeleton loading state for the stats section.
 * Shows placeholders for tyre counts, customer count, and location breakdown.
 */
export function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Main stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      {/* Location breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
