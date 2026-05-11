import type { Metadata } from "next";
import NewArrivalsClient from "./NewArrivalsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface StaticPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("latest", lang);
    return generateSeoMetadata(seo, lang, { title: "New Arrivals | Blink", description: "Shop the latest arrivals on Blink" });
}

export default async function NewArrivalsPage({ params }: StaticPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("latest", lang);

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <NewArrivalsClient />
        </>
    );
}
