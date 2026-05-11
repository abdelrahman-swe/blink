import type { Metadata } from "next";
import SearchResultClient from "./SearchResultClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface SearchPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("search", lang);
    return generateSeoMetadata(seo, lang, { title: "Search | Blink", description: "Search for products on Blink" });
}

export default function SearchPage() {
    return <SearchResultClient />;
}
