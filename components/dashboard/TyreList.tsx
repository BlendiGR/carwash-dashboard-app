import { fetchTyres } from "@/app/actions/tyrehotel";
import TyreCard from "./tyreCard";
import Pagination from "../ui/pagination";
import { getTranslations } from "next-intl/server";

interface TyreListProps {
  query?: string;
  page?: number;
  isStored?: boolean;
}

/**
 * TyreList - Server Component for fetching and displaying tyre records.
 *
 * Fetches tyres based on search/filter params and renders a grid of TyreCards.
 * Loading state is handled by parent Suspense boundary.
 */
export default async function TyreList({ query, page = 1, isStored = true }: TyreListProps) {
  const t = await getTranslations("Dashboard");
  const { tyres, pagination } = await fetchTyres(query, page, isStored);

  if (tyres.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{t("noTyresFound")}</p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tyres.map((tyre) => (
          <TyreCard key={tyre.id} tyre={tyre} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  );
}
