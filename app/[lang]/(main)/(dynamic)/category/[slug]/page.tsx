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
        return json;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const json = await getCategorySeo(slug, lang);
    
    const category = json?.data?.category || json?.data;
    const seo = json?.data?.seo || json?.seo || null;

    const title = category?.name || "Category | Blink";
    const description = category?.description || "Shop our categories on Blink bruh you've got to buy things i mean ? we blink can you imagine !!!";

    return generateSeoMetadata(seo, lang, { title, description });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug, lang } = await params;
    const json = await getCategorySeo(slug, lang);
    const seo = json?.data?.seo || json?.seo || null;

    return (
        <>
            <JsonLd data={seo?.jsonLd} />
            <CategoryClient />
        </>
    );
}
