import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import BestSellingClient from "./BestSellingClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

async function getBestSellingSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/products/best-selling?include_seo=true`, {
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
    const seo = await getBestSellingSeo(lang);
    return generateSeoMetadata(seo, lang, { title: "Best Selling | Blink", description: "Shop our best selling products on Blink" });
}

export default async function BestSellingPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getBestSellingSeo(lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <BestSellingClient />
        </>
    );
}
