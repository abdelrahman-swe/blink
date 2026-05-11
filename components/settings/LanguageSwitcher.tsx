"use client";

// Client Component Example - components/LanguageSwitcher.tsx

import { useLocale } from "@/hooks/useLocale";
import { Locale } from "@/lib/dictionaries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const { switchLocale } = useLocale(currentLocale);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <div className="w-[80px] h-[40px] flex items-center justify-center">
        <Image priority src="/global.svg" alt="language icon" width={20} height={20} />
        <span className="text-md font-medium capitalize ms-2">
          {currentLocale === "ar" ? "Ar" : "En"}
        </span>
      </div>
    );
  }

  return (
    <Select value={currentLocale.toLowerCase()} onValueChange={(val) => switchLocale(val as Locale)} onOpenChange={setIsOpen}>
      <SelectTrigger className="w-[80px] border-none bg-transparent shadow-none focus:ring-0! focus:ring-offset-0! cursor-pointer [&>svg]:hidden">
        <Image priority src="/global.svg" alt="language icon" width={20} height={20} />
        <span className="text-md font-medium capitalize ">
          {currentLocale === "ar" ? "Ar" : "En"}
        </span>
        <Image priority src="/dropdown.svg" alt="dropdown icon" width={20} height={20} className={`ms-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </SelectTrigger>
      <SelectContent className="w-[130px]">
        <SelectGroup>
          <SelectItem className="text-md" value="ar">العربية</SelectItem>
          <SelectItem className="text-md" value="en">English</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}