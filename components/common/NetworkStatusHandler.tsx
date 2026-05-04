"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";
import OfflineError from "./OfflineError";

export default function NetworkStatusHandler() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("You are back online!", {
                icon: <Wifi className="w-5 h-5" />,
                id: "network-status",
                duration: 5000,
            });
        };

        const handleOffline = () => {
            setIsOffline(true);
            toast.error("You are offline. Please check your connection.", {
                icon: <WifiOff className="w-5 h-5" />,
                id: "network-status",
                duration: Infinity, // Keep it open until they are back online or dismiss
            });
        };

        // Check initial status
        if (typeof window !== "undefined" && !window.navigator.onLine) {
            setIsOffline(true);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleReset = () => {
        if (typeof window !== "undefined") {
            if (window.navigator.onLine) {
                setIsOffline(false);
                toast.success("You are back online!", {
                    icon: <Wifi className="w-5 h-5" />,
                    id: "network-status",
                    duration: 3000,
                });
            } else {
                window.location.reload(); // Fallback to reload if they want to try forcing it
            }
        }
    };

    if (isOffline) {
        return (
            <div className="fixed inset-0 z-9999 bg-background flex items-center justify-center">
                <OfflineError reset={handleReset} />
            </div>
        );
    }

    return null;
}
