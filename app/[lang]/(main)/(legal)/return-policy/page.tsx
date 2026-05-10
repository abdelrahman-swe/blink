import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import ReturnPolicyClient from "./ReturnPolicyClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

async function getLegalSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/legal/return_policy?include_seo=true`, {
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
    return generateSeoMetadata(seo, lang, { title: "Return Policy | Blink", description: "Blink Return Policy" });
}

export default async function ReturnPolicyPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getLegalSeo(lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <ReturnPolicyClient />
        </>
    );
}
