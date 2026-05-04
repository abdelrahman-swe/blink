"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineErrorProps {
    reset?: () => void;
}

export default function OfflineError({ reset }: OfflineErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-6">
            <div className="bg-destructive/10 p-6 rounded-full animate-pulse">
                <WifiOff className="w-16 h-16 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">No Internet Connection</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    It looks like you're offline. Please check your internet connection and try again.
                </p>
            </div>
            {reset && (
                <Button onClick={reset} size="lg" className="min-w-[150px]">
                    Try Again
                </Button>
            )}
        </div>
    );
}
