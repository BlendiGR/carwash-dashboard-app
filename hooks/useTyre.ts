import { useState, useEffect, useCallback } from "react";
import { fetchTyres, tyreCounts, createTyre, toggleTyreStatus } from "@/app/actions/tyrehotel";
import { useLoading } from "./useLoading";
import type { TyreFormData } from "@/lib/schemas/tyreSchema";

/** Type helper: Extracts the return type from fetchTyres server action */
type FetchResult = Awaited<ReturnType<typeof fetchTyres>>;

/** Type: Represents a single tyre record */
type Tyre = FetchResult["tyres"][number];

/** Type: Pagination metadata for tyre lists */
type Pagination = FetchResult["pagination"];

/** Type: Statistics about tyre storage locations */
type TyreCounts = Awaited<ReturnType<typeof tyreCounts>>;

/**
 * Fetches and manages paginated tyre records with search and filter capabilities.
 *
 * @param query - Optional search string for filtering tyres
 * @param page - Page number for pagination (default: 1)
 * @param isStored - Filter by storage status (default: undefined = all)
 * @returns Object containing tyres array, pagination metadata, loading state, and refetch function
 */
export function useTyre(query: string | null, page: number = 1, isStored?: boolean) {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { loading, withLoading } = useLoading(true);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    withLoading(async () => {
      const result = await fetchTyres(query, page, isStored);
      setTyres(result.tyres);
      setPagination(result.pagination);
    });
  }, [query, page, isStored, withLoading, refetchTrigger]);

  return { tyres, pagination, loading, refetch };
}

/**
 * Fetches statistics about stored tyres grouped by location.
 *
 * @returns Object containing counts by location and total count, plus loading state
 */
export function useTyreCounts() {
  const [counts, setCounts] = useState<TyreCounts>({ countsByLocation: [], total: 0 });
  const { loading, withLoading } = useLoading(true);

  useEffect(() => {
    withLoading(async () => {
      const result = await tyreCounts();
      setCounts(result);
    });
  }, [withLoading]);

  return { counts, loading };
}

/**
 * Provides functionality to create a new tyre storage record.
 *
 * @returns Object containing create function, loading state, and error message
 */
export function useCreateTyre() {
  const { loading, withLoading } = useLoading(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: TyreFormData) => {
      setError(null);
      return await withLoading(async () => {
        const result = await createTyre(data);
        if (!result.success) {
          setError(result.error ?? "Failed to create tyre");
        }
        return result;
      });
    },
    [withLoading]
  );

  return { create, loading, error };
}

/**
 * Toggles the storage status of a tyre (check-in/check-out).
 *
 * @param onSuccess - Optional callback function to execute after successful status toggle
 * @returns Object containing toggle function, loading state, and error message
 */
export function useToggleTyreStatus(onSuccess?: () => void) {
  const { loading, withLoading } = useLoading(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(
    async (id: number) => {
      setError(null);
      return await withLoading(async () => {
        const result = await toggleTyreStatus(id);
        if (!result.success) {
          setError(result.error ?? "Failed to toggle tyre status");
        } else {
          onSuccess?.();
        }
        return result;
      });
    },
    [withLoading, onSuccess]
  );

  return { toggle, loading, error };
}
