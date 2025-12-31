/**
 * Skeleton loading state for a single tyre card.
 * Mimics the layout of TyreCard with placeholder elements.
 */
export function TyreCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3">
        {/* Plate number */}
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        {/* Customer name */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        {/* Location */}
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        {/* Date */}
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        {/* Action button */}
        <div className="h-8 w-full bg-gray-200 rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}
