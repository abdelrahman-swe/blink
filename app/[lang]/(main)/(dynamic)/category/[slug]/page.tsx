import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import CategoryClient from "./CategoryClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

interface CategoryPageProps {
    params: Promise<{ lang: string; slug: string }>;
}

async function getCategorySeo(slug: string, lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/categories/${slug}?include_seo=true`, {
            headers: { "X-Locale": lang },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data?.category || json?.data || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const data = await getCategorySeo(slug, lang);

    const title = data?.name || "Category | Blink";
    const description = data?.description || "Shop our categories on Blink";

    return generateSeoMetadata(data?.seo, lang, { title, description });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug, lang } = await params;
    const data = await getCategorySeo(slug, lang);

    return (
        <>
            <JsonLd data={data?.seo?.jsonLd} />
            <CategoryClient />
        </>
    );
}
