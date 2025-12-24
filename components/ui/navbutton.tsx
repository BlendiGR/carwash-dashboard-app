"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const btnColor = isActive
    ? "bg-primary-gradient text-white hover:bg-primaryhover shadow-primary-lg"
    : "bg-gray-200 text-gray-500 hover:bg-gray-300";

  return (
    <Link href={href} className={`py-2 px-4 rounded-lg ${btnColor}`}>
      {label}
    </Link>
  );
}
