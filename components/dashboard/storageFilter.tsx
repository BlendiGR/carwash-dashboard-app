"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function StorageFilter() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentValue = searchParams.get("stored") ?? "true";

  const handleChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("stored", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <select
      defaultValue={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
    >
      <option value="true">{t("inStorage")}</option>
      <option value="false">{t("returned")}</option>
    </select>
  );
}
