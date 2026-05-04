// components/common/ThemeToggle.tsx
"use client";

import { useThemeStore } from "@/store/themeStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      type="button" onClick={toggleTheme} className="rounded-full border border-gray-300 p-2">
      {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
    </Button>
  );
}
