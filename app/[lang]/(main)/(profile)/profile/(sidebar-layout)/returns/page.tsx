import type { Metadata } from "next";
import ReturnsClient from "./ReturnsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface ReturnsPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ReturnsPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("returns", lang);
    return generateSeoMetadata(seo, lang, { title: "Returns | Blink", description: "View your returns on Blink" });
}

export default function ReturnsPage() {
    return <ReturnsClient />;
}
