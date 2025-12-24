"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTyre, useTyreCounts, useToggleTyreStatus } from "@/hooks";

type FetchResult = Awaited<ReturnType<typeof import("@/app/actions/tyrehotel").fetchTyres>>;
type Tyre = FetchResult["tyres"][number];
type Pagination = FetchResult["pagination"];
type TyreCounts = Awaited<ReturnType<typeof import("@/app/actions/tyrehotel").tyreCounts>>;

interface TyreContextType {
  // Tyre data
  tyres: Tyre[];
  pagination: Pagination;
  loading: boolean;

  // Counts
  counts: TyreCounts;
  countsLoading: boolean;

  // Actions
  refetch: () => void;
  toggle: (id: number) => Promise<any>;
  toggleLoading: boolean;
}

const TyreContext = createContext<TyreContextType | undefined>(undefined);

interface TyreProviderProps {
  children: ReactNode;
  query: string | null;
  page: number;
  isStored: boolean;
}

/**
 * TyreProvider - Centralizes tyre data management
 *
 * Provides tyre data, counts, and actions to all child components
 * to prevent duplicate API calls.
 */
export function TyreProvider({ children, query, page, isStored }: TyreProviderProps) {
  const { tyres, pagination, loading, refetch } = useTyre(query, page, isStored);
  const { counts, loading: countsLoading } = useTyreCounts();
  const { toggle, loading: toggleLoading } = useToggleTyreStatus(refetch);

  const value: TyreContextType = {
    tyres,
    pagination,
    loading,
    counts,
    countsLoading,
    refetch,
    toggle,
    toggleLoading,
  };

  return <TyreContext.Provider value={value}>{children}</TyreContext.Provider>;
}

/**
 * useTyreContext - Hook to access tyre data and actions
 *
 * Must be used within a TyreProvider
 */
export function useTyreContext() {
  const context = useContext(TyreContext);
  if (!context) {
    throw new Error("useTyreContext must be used within a TyreProvider");
  }
  return context;
}
