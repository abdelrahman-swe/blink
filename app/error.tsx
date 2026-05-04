"use client";

import { Button } from "@/components/ui/button";
import OfflineError from "@/components/common/OfflineError";
import { useEffect, useState } from "react";

// Detects Next.js "Failed to load chunk" errors caused by stale browser cache
// after a new deployment. The old chunk hashes no longer exist on the CDN.
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /loading chunk \d+ failed/i.test(error.message) ||
    /failed to load chunk/i.test(error.message) ||
    /loading css chunk/i.test(error.message)
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // If it's a chunk load error, do ONE hard reload to pick up fresh chunks.
    // The sessionStorage flag prevents an infinite reload loop.
    if (isChunkLoadError(error)) {
      const hasReloaded = sessionStorage.getItem("chunk_error_reloaded");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk_error_reloaded", "1");
        window.location.reload();
        return;
      }
    }
    // Clear the flag for any other kind of error so a future chunk error
    // can still trigger its reload.
    sessionStorage.removeItem("chunk_error_reloaded");

    const checkOffline = () => {
      setIsOffline(!window.navigator.onLine);
    };

    checkOffline();
    window.addEventListener("online", checkOffline);
    window.addEventListener("offline", checkOffline);

    return () => {
      window.removeEventListener("online", checkOffline);
      window.removeEventListener("offline", checkOffline);
    };
  }, [error]);

  if (isOffline) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <OfflineError reset={reset} />
      </div>
    );
  }

  return (
    <div className="bg-primary text-primary-foreground min-h-screen flex items-center justify-center p-4">
      <div className="bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-3xl font-semibold mb-4">
          Something went wrong!
        </h2>
        <p className="text-lg opacity-90 mb-8 break-words">{error.message || "An unexpected error occurred"}</p>
        <Button
          aria-label="Try again"
          variant="secondary"
          onClick={reset}
          className="w-full sm:w-auto min-w-[120px]"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
