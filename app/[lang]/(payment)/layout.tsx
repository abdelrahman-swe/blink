import QueryProvider from "../providers/QueryProvider";
import LangWrapper from "../providers/LangWrapper";
import { ThemeWrapper } from "@/components/settings/ThemeWrapper";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { DictionaryProvider } from "@/components/providers/DictionaryProvider";
import { getDictionary, Locale } from "@/lib/dictionaries";


export default async function PaymentLayout({ children, params }: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const cookieStore = await cookies();
    const initialTheme = cookieStore.get("NEXT_THEME")?.value as "light" | "dark" | undefined;
    const checkoutDict = await getDictionary(lang as Locale, "checkout");

    return (
        <QueryProvider>
            {/* <ThemeWrapper initialTheme={initialTheme || "light"}> */}
                <LangWrapper lang={lang}>
                    <DictionaryProvider dictionaries={{ checkout: checkoutDict }}>
                        {children}
                    </DictionaryProvider>
                </LangWrapper>
            {/* </ThemeWrapper> */}
        </QueryProvider>
    );
}
