import type { Metadata } from "next";
import BestSellingClient from "./BestSellingClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("best-selling", lang);
    return generateSeoMetadata(seo, lang, { title: "Best Selling | Blink", description: "Shop our best selling products on Blink" });
}

export default async function BestSellingPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("best-selling", lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <BestSellingClient />
        </>
    );
}
