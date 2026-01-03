import { fetchTyres } from "@/app/actions/tyrehotel";
import TyreCard from "./tyreCard";
import Pagination from "../ui/pagination";
import { getTranslations } from "next-intl/server";

interface TyreListProps {
  query?: string;
  page?: number;
  isStored?: boolean;
}

export default async function TyreList({ query, page = 1, isStored = true }: TyreListProps) {
  const t = await getTranslations("Dashboard");

  let data = null;
  let error = false;

  try {
    data = await fetchTyres(query, page, isStored);
  } catch (e) {
    console.error("Failed to fetch tyres:", e);
    error = true;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{t("fetchError")}</p>;
  }

  if (!data || data.tyres.length === 0) {
    return <p className="text-gray-500 text-center py-8">{t("noTyresFound")}</p>;
  }

  const { tyres, pagination } = data;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tyres.map((tyre) => (
          <TyreCard key={tyre.id} tyre={tyre} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}
