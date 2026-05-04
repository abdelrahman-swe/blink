// hooks/useAppRouter.ts
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useTransition } from "react";

export function useAppRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startLoading } = useLoadingStore();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (href: string, method: (href: string) => void) => {
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (href === currentPath || href === pathname) {
      method(href);
      return;
    }

    startLoading();
    startTransition(() => {
      method(href);
    });
  };

  return {
    ...router,
    push: (href: string) => {
      handleNavigation(href, (h) => router.push(h));
    },
    replace: (href: string) => {
      handleNavigation(href, (h) => router.replace(h));
    },
    back: () => {
      startLoading();
      router.back();
    },
    isPending,
  };
}