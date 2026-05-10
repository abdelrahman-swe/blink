import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import DealsClient from "./DealsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

async function getDealsSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/products/deals?include_seo=true`, {
            headers: { "X-Locale": lang },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.seo || json?.data?.seo || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getDealsSeo(lang);
    return generateSeoMetadata(seo, lang, { title: "Deals of the Day | Blink", description: "Best deals of the day on Blink" });
}

export default async function DealsPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getDealsSeo(lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <DealsClient />
        </>
    );
}
