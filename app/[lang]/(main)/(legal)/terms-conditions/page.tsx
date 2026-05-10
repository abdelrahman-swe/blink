import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import TermsClient from "./TermsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

async function getLegalSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/legal/terms_conditions?include_seo=true`, {
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
    return generateSeoMetadata(seo, lang, { title: "Terms and Conditions | Blink", description: "Blink Terms and Conditions" });
}

export default async function TermsPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getLegalSeo(lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <TermsClient />
        </>
    );
}
