"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/config";
import NavButton from "../ui/navbutton";
import Link from "next/link";
import Image from "next/image";
import SignOutBtn from "../ui/signoutbtn";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export default function NavBar() {
  const t = useTranslations("Navigation");

  return (
    <nav className="flex flex-row justify-between items-center p-4 w-full shadow-md">
      <div>
        <Link href="/">
          <Image src="/logo-car.png" alt="Autospa Opus" width={160} height={160} priority />
        </Link>
      </div>
      <div className="hidden md:flex flex-row gap-4 items-center">
        {navItems.map((item) => (
          <NavButton key={item.href} href={item.href} label={t(item.key)} />
        ))}
        <LanguageSwitcher />
        <SignOutBtn />
      </div>
      <MobileNav />
    </nav>
  );
}
