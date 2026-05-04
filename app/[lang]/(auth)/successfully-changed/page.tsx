"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import AppLink from '@/components/common/AppLink';
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loader2Icon } from "lucide-react";
import { Locale } from "@/lib/dictionaries";

type SuccessfullyPasswordChangedProps = {
    params: { lang: Locale };
};

import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function SuccessfullyPasswordChanged() {
    const { lang } = useParams();
    const { auth: t } = useDictionary();
    const successResetPass = t.successResetPass;

    const [loading, setLoading] = useState(false);

    return (
        <div className="flex flex-col items-center mx-auto text-center justify-center gap-8">
            <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={80}
                color="#34C759"
                strokeWidth={1.5}
            />

            <h1 className="text-xl md:text-2xl font-medium">
                {successResetPass?.title}
            </h1>

            <AppLink
                href={`/${lang}/login`}
                onClick={() => setLoading(true)}
            >
                <Button
                    className="w-50 px-5"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">
                                <Loader2Icon className="h-4 w-4" />
                            </span>
                            {successResetPass?.lodding}...
                        </span>
                    ) : (
                        <span> {successResetPass?.signInButton}</span>
                    )}
                </Button>
            </AppLink>
        </div>
    );
}
