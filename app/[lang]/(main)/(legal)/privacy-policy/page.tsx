import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import PrivacyPolicyClient from "./PrivacyPolicyClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

async function getLegalSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/legal/privacy_policy?include_seo=true`, {
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

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getLegalSeo(lang);
    return generateSeoMetadata(seo, lang, { title: "Privacy Policy | Blink", description: "Blink Privacy Policy" });
}

export default async function PrivacyPolicyPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getLegalSeo(lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <PrivacyPolicyClient />
        </>
    );
}
