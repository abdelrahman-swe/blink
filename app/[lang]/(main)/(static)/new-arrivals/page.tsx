import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import NewArrivalsClient from "./NewArrivalsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

async function getNewArrivalsSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/products/latest?include_seo=true`, {
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
    const seo = await getNewArrivalsSeo(lang);
    return generateSeoMetadata(seo, lang, { title: "New Arrivals | Blink", description: "Shop the latest arrivals on Blink" });
}

export default async function NewArrivalsPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getNewArrivalsSeo(lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <NewArrivalsClient />
        </>
    );
}
