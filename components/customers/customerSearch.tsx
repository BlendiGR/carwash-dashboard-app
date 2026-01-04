"use client";

import SearchInput from "../dashboard/searchInput";
import { UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddCustomerModal from "./addCustomerModal";

export default function CustomerSearch() {
  const t = useTranslations("Customers");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 justify-center bg-gray-100 rounded-2xl p-4 m-4 shadow-md">
        <div className="flex flex-row sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
              <UsersRound size={30} />
            </div>
            <div>
              <p className="text-lg font-semibold">{t("title")}</p>
              <p className="text-sm text-gray-500">{t("subtitle")}</p>
            </div>
          </div>
          <Button className="rounded-xl" size="lg" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span className="ml-2">{t("addCustomer")}</span>
          </Button>
        </div>
        <SearchInput />
      </div>
      <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
