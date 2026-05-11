import type { Metadata } from "next";
import TermsClient from "./TermsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("terms_conditions", lang);
    return generateSeoMetadata(seo, lang, { title: "Terms and Conditions | Blink", description: "Blink Terms and Conditions" });
}

export default async function TermsPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("terms_conditions", lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <TermsClient />
        </>
    );
}
