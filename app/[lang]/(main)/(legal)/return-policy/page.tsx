import type { Metadata } from "next";
import ReturnPolicyClient from "./ReturnPolicyClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("return_policy", lang);
    return generateSeoMetadata(seo, lang, { title: "Return Policy | Blink", description: "Blink Return Policy" });
}

export default async function ReturnPolicyPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("return_policy", lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <ReturnPolicyClient />
        </>
    );
}
