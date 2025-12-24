"use client";

import TyreCard from "./tyreCard";
import Pagination from "../ui/pagination";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/Spinner";
import { useTyreContext } from "@/contexts/TyreContext";

export default function TyreCardSection() {
  const t = useTranslations("Dashboard");
  const { tyres, pagination, loading, toggle } = useTyreContext();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Spinner size={32} spinColor="#3b82f6" />
          </div>
        ) : tyres.length === 0 ? (
          <p>{t("noTyresFound")}</p>
        ) : (
          tyres.map((tyre) => (
            <TyreCard
              key={tyre.id}
              id={tyre.id}
              customerName={tyre.customer?.name}
              plate={tyre.plate}
              number={tyre.number}
              location={tyre.location ?? undefined}
              dateStored={tyre.dateStored}
              deletedAt={tyre.deletedAt}
              isStored={tyre.isStored}
              onToggleStatus={() => toggle(tyre.id)}
            />
          ))
        )}
      </div>

      {!loading && tyres.length > 0 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}
