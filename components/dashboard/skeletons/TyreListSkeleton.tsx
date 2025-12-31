import { TyreCardSkeleton } from "./TyreCardSkeleton";

/**
 * Skeleton loading state for the tyre list grid.
 * Displays a grid of TyreCardSkeleton components as Suspense fallback.
 */
export function TyreListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <TyreCardSkeleton key={i} />
      ))}
    </div>
  );
}
