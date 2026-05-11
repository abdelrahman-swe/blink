import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface LegalPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("contact_us", lang);
    return generateSeoMetadata(seo, lang, { title: "Contact Us | Blink", description: "Contact Blink" });
}

export default async function ContactUsPage({ params }: LegalPageProps) {
    const { lang } = await params;
    const seo = await getStaticPageSeo("contact_us", lang);
    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <ContactUsClient />
        </>
    );
}
