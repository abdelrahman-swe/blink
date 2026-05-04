import AuthTopBar from "@/components/auth/AuthTopBar";
import { Locale, locales } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface AuthPageWrapperProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    footer?: ReactNode;
    lang: Locale;
}

const isLocale = (value: string): value is Locale => (
    locales as ReadonlyArray<string>
).includes(value);

import { DictionaryProvider } from "@/components/providers/DictionaryProvider";
import { getDictionary } from "@/lib/dictionaries";

export default async function AuthLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang: langParam } = await params;

    if (!isLocale(langParam)) {
        notFound();
    }

    const lang: Locale = langParam;
    const authDict = await getDictionary(lang, "auth");


    return (
        <DictionaryProvider dictionaries={{ auth: authDict }}>
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#F0EEEE] ">
                <div className="relative bg-white rounded-4xl w-full max-w-lg min-h-[600px] md:min-h-[750px] px-5 md:px-10 py-5 flex flex-col justify-center items-center mx-auto">
                    <div className="absolute top-5 left-3 md:left-5 right-3 md:right-5 mb-10">
                        <AuthTopBar locale={lang} />
                    </div>
                    <div className="mt-10 w-full">
                        {children}
                    </div>
                </div>
            </div>
        </DictionaryProvider>
    );
}
