import type { Metadata } from "next";
import DealsClient from "./DealsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("deals", lang);
    return generateSeoMetadata(seo, lang, { title: "Deals of the Day | Blink", description: "Best deals of the day on Blink" });
}

export default async function DealsPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("deals", lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <DealsClient />
        </>
    );
}
