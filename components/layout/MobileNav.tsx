"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { navItems } from "@/config";
import NavButton from "../ui/navbutton";
import SignOutBtn from "../ui/signoutbtn";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navigation");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
        className="md:hidden p-2 text-gray-700"
      >
        <Menu size={28} />
      </button>
      <div
        className={`fixed inset-0 z-[100] bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-lg z-[101] p-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close mobile drawer"
          className="absolute top-5 right-5 p-2 text-gray-700"
        >
          <X size={28} />
        </button>
        <div className="mb-8">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image src="/logo-opus.png" alt="Autospa Opus" width={100} height={100} priority />
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {navItems.map((item) => (
            <li
              key={item.href}
              onClick={() => setIsOpen(false)}
              className="[&>a]:w-full [&>a]:block [&>a]:text-center"
            >
              <NavButton href={item.href} label={t(item.key)} />
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
        <div className="mt-8 [&>button]:w-full" onClick={() => setIsOpen(false)}>
          <SignOutBtn />
        </div>
      </div>
    </>
  );
}
