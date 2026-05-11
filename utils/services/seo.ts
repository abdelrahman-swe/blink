import { PUBLIC_API } from "@/lib/config";
import { SeoData } from "@/utils/seo";

/**
 * Fetches SEO data from the dedicated static SEO endpoint.
 *
 * Endpoint pattern: GET /api/seo/static/{pageName}
 *
 * @param pageName - The page identifier (e.g. "homepage", "bestselling", "latest", "deals", etc.)
 * @param lang     - The locale code ("en" | "ar")
 */
export async function getStaticPageSeo(
    pageName: string,
    lang: string
): Promise<SeoData | null> {
    try {
        const res = await fetch(`${PUBLIC_API}/seo/static/${pageName}`, {
            headers: { "X-Locale": lang },
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const json = await res.json();
        // Support multiple possible response shapes from the API
        return json?.data ?? json?.seo ?? json ?? null;
    } catch {
        return null;
    }
}
