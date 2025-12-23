"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

const locales = [
  { code: 'en', name: 'English' },
  { code: 'sq', name: 'Shqip' },
  { code: 'fi', name: 'Suomi' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const getCurrentLocale = () => {
    if (typeof document === 'undefined') return 'en';
    const match = document.cookie.match(/locale=([^;]+)/);
    return match ? match[1] : 'en';
  };

  const handleSelect = (code: string) => {
    setIsOpen(false);
    startTransition(() => {
      document.cookie = `locale=${code};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex flex-row justify-center bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer py-2 px-4 rounded-lg text-center items-center disabled:opacity-50"
        aria-label="Change language"
      >
        <Globe />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border py-1 min-w-[120px] z-50">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleSelect(locale.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                getCurrentLocale() === locale.code ? 'font-semibold bg-gray-50' : ''
              }`}
            >
              {locale.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

