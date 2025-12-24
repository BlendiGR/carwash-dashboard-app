"use client";

import { useState } from "react";
import SearchInput from "./searchInput";
import StorageFilter from "./storageFilter";
import AddTyreModal from "./addTyreModal";
import { Package, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function DashboardSearch() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
              <Package size={30} />
            </div>
            <div>
              <p className="text-lg font-semibold">{t("title")}</p>
              <p className="text-sm text-gray-500">{t("subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-xl" size="lg" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              <span className="ml-2">{t("addStorageUnit")}</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <SearchInput className="bg-white" />
          <StorageFilter />
        </div>
      </div>

      <AddTyreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
