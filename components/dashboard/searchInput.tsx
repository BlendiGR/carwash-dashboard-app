"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SearchInput({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("Dashboard");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      placeholder={t("searchPlaceholder")}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query")?.toString()}
      className={className}
      startIcon={<Search className="size-4 text-gray-400" />}
    />
  );
}
