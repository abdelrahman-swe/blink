// components/settings/ThemeWrapper.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

interface ThemeWrapperProps {
  children: ReactNode;
  initialTheme: "light" | "dark";
}

export function ThemeWrapper({ children, initialTheme }: ThemeWrapperProps) {
  const { theme } = useThemeStore();

  // Choose theme from store, fallback to initialTheme from server
  const activeTheme = theme || initialTheme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(activeTheme);
  }, [activeTheme]);

  return <>{children}</>;
}
