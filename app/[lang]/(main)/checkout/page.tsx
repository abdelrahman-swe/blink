import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface CheckoutPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("checkout", lang);
    return generateSeoMetadata(seo, lang, { title: "Checkout | Blink", description: "Complete your purchase on Blink" });
}

export default function CheckoutPage() {
    return <CheckoutClient />;
}