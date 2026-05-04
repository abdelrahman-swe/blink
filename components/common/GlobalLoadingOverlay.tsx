
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useLoadingStore } from "@/store/useLoadingStore";

function LoadingHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Safety timeout to prevent infinite loading if navigation is cancelled or same-page
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        stopLoading();
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, stopLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-primary/50 shadow-xl">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-white font-semibold text-sm animate-pulse tracking-widest uppercase">
          Blinking...
        </p>
      </div>
    </div>
  );
}

export default function GlobalLoadingOverlay() {
  const pathname = usePathname();
  
  return (
    <Suspense fallback={null}>
      <LoadingHandler key={pathname} />
    </Suspense>
  );
}