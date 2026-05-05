import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import ProductDetailsClient from "./ProductDetailsClient";

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

    const seo = product.seo;

    // Fallback values from product data when seo block is missing
    const title = seo?.meta?.title || product.name || "Blink";
    const description =
        seo?.meta?.description ||
        product.description?.slice(0, 160) ||
        "Shop the best deals on Blink";
    const ogImage =
        seo?.og?.image ||
        product.images?.[0]?.large ||
        product.images?.[0]?.original ||
        "";

    const metadata: Metadata = {
        title,
        description,
        robots: seo?.meta?.robots || "index,follow",
        alternates: {
            canonical: seo?.meta?.canonical || undefined,
            languages: seo?.alternates?.reduce(
                (acc: Record<string, string>, alt: { lang: string; href: string }) => {
                    acc[alt.lang] = alt.href;
                    return acc;
                },
                {} as Record<string, string>
            ),
        },
        openGraph: {
            title: seo?.og?.title || title,
            description: seo?.og?.description || description,
            url: seo?.og?.url || undefined,
            siteName: seo?.og?.site_name || "Blink",
            locale: seo?.og?.locale || (lang === "ar" ? "ar_EG" : "en_US"),
            type: "website",
            images: ogImage ? [{ url: ogImage }] : [],
        },
    };

    return metadata;
}

// ---------------------------------------------------------------------------
// JSON-LD Structured Data (injected as <script> in the server HTML)
// ---------------------------------------------------------------------------

async function ProductJsonLd({ slug, lang }: { slug: string; lang: string }) {
    const product = await getProductSeo(slug, lang);
    const jsonLd = product?.seo?.jsonLd;

    if (!jsonLd || !Array.isArray(jsonLd) || jsonLd.length === 0) return null;

    return (
        <>
            {jsonLd.map((ld: Record<string, unknown>, idx: number) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                />
            ))}
        </>
    );
}

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------

export default async function ProductDetailsPage({ params }: ProductPageProps) {
    const { slug, lang } = await params;

    return (
        <>
            <ProductJsonLd slug={slug} lang={lang} />
            <ProductDetailsClient />
        </>
    );
}
