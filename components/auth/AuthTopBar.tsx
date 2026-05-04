"use client";
import Image from "next/image";
import { Locale } from "@/lib/dictionaries";
import AppLink from '@/components/common/AppLink';
import LanguageSwitcher from "../settings/LanguageSwitcher";

interface AuthTopBarProps {
  locale: Locale;
}

export default function AuthTopBar({ locale }: AuthTopBarProps) {
  return (
    <div className="flex justify-between items-center px-3 ">
      <div>
        <AppLink href="/login">
          <Image src="/logo-icon-only.svg" alt="Logo" width={100} height={100} />
        </AppLink>
      </div>
      <div className="flex justify-center items-center ">
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </div>
  );
}