"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Locale } from "@/utils/types/locale";
import { useLoadingStore } from "@/store/useLoadingStore";

export function useLocale(currentLocale: Locale) {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoadingStore();
  const [locale, setLocale] = useState<Locale>(currentLocale);

  // Sync with cookie on client
  useEffect(() => {
    const cookieLocale = Cookies.get("NEXT_LOCALE") as Locale;
    if (cookieLocale && cookieLocale !== locale) setLocale(cookieLocale);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    startLoading();
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365, sameSite: "lax" });
    setLocale(newLocale);

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    // Using window.location.href instead of router.push ensures a clean transition 
    // for localized routing and server-side translations.
    window.location.href = newPath;
  };

  const toggleLocale = () => {
    const newLocale: Locale = locale === "en" ? "ar" : "en";
    switchLocale(newLocale);
  };

  return {
    currentLocale: locale,
    switchLocale,
    toggleLocale,
  };
}
