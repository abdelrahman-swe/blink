import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("privacy_policy", lang);
    return generateSeoMetadata(seo, lang, { title: "Privacy Policy | Blink", description: "Blink Privacy Policy" });
}

export default async function PrivacyPolicyPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("privacy_policy", lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <PrivacyPolicyClient />
        </>
    );
}
