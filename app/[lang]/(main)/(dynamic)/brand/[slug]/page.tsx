import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import BrandClient from "./BrandClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface BrandPageProps {
    params: Promise<{ lang: string; slug: string }>;
}

async function getBrandSeo(slug: string, lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/brands/${slug}/categories?include_seo=true`, {
            headers: { "X-Locale": lang },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const responseData = await getBrandSeo(slug, lang);
    
    const seo = responseData?.seo || responseData?.data?.seo || responseData?.data?.brand?.seo || null;
    const title = responseData?.data?.brand?.name || responseData?.data?.name || "Brand | Blink";
    
    return generateSeoMetadata(seo, lang, { title, description: "Shop this brand on Blink" });
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { slug, lang } = await params;
    const responseData = await getBrandSeo(slug, lang);
    const seo = responseData?.seo || responseData?.data?.seo || responseData?.data?.brand?.seo || null;

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <BrandClient />
        </>
    );
}
