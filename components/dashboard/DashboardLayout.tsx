"use client";

import { useSearchParams } from "next/navigation";
import { TyreProvider } from "@/contexts/TyreContext";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout - Client wrapper that provides TyreContext
 *
 * Reads URL search params and passes them to TyreProvider
 * to centralize data fetching for all dashboard components.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page")) || 1;
  const isStored = searchParams.get("stored") !== "false";

  return (
    <TyreProvider query={query} page={page} isStored={isStored}>
      {children}
    </TyreProvider>
  );
}
