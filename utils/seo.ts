import { Metadata } from "next";

export interface SeoData {
    meta?: {
        title?: string;
        description?: string;
        robots?: string;
        canonical?: string;
    };
    og?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        site_name?: string;
        locale?: string;
    };
    alternates?: Array<{ lang: string; href: string }>;
    jsonLd?: Record<string, unknown>[];
}

export function generateSeoMetadata(
    seoData: SeoData | null | undefined,
    lang: string,
    fallback: { title: string; description: string; image?: string }
): Metadata {
    const title = seoData?.meta?.title || fallback.title;
    const description = seoData?.meta?.description || fallback.description;
    const ogImage = seoData?.og?.image || fallback.image || "";

    return {
        title,
        description,
        robots: seoData?.meta?.robots || "index,follow",
        alternates: {
            canonical: seoData?.meta?.canonical || undefined,
            languages: seoData?.alternates?.reduce(
                (acc: Record<string, string>, alt: { lang: string; href: string }) => {
                    acc[alt.lang] = alt.href;
                    return acc;
                },
                {} as Record<string, string>
            ),
        },
        openGraph: {
            title: seoData?.og?.title || title,
            description: seoData?.og?.description || description,
            url: seoData?.og?.url || undefined,
            siteName: seoData?.og?.site_name || "Blink",
            locale: seoData?.og?.locale || (lang === "ar" ? "ar_EG" : "en_US"),
            type: "website",
            images: ogImage ? [{ url: ogImage }] : [],
        },
    };
}
