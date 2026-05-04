"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LangWrapper({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Update HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, pathname]);

  // Also set it immediately on mount
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  return <div dir={lang === "ar" ? "rtl" : "ltr"}>{children}</div>;
}
