import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import ProductDetailsClient from "./ProductDetailsClient";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";

// ---------------------------------------------------------------------------
// Server-side SEO: fetch product data and return dynamic <head> metadata
// ---------------------------------------------------------------------------

interface ProductPageProps {
    params: Promise<{ lang: string; slug: string }>;
}

async function getProductSeo(slug: string, lang: string) {
    try {
        const res = await fetch(
            `${PUBLIC_API}/products/slug/${slug}?include_seo=true`,
            {
                headers: { "X-Locale": lang },
                next: { revalidate: 60 }, // ISR: revalidate every 60s
            }
        );

        if (!res.ok) return null;

        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const product = await getProductSeo(slug, lang);

    if (!product) {
        return {
            title: "Product Not Found | Blink",
            description: "The requested product could not be found.",
        };
    }

    const title = product.name || "Blink";
    const description = product.description?.slice(0, 160) || "Shop the best deals on Blink";
    const image = product.images?.[0]?.large || product.images?.[0]?.original || "";

    return generateSeoMetadata(product.seo, lang, { title, description, image });
}

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------

export default async function ProductDetailsPage({ params }: ProductPageProps) {
    const { slug, lang } = await params;
    const product = await getProductSeo(slug, lang);

    return (
        <>
            <JsonLd data={product?.seo?.jsonLd} />
            <ProductDetailsClient />
        </>
    );
}
