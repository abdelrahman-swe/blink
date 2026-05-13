import { MetadataRoute } from "next";
import { SERVER_API } from "@/lib/config";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blink-sigma-mocha.vercel.app";

const locales = ["en", "ar"] as const;

// ── helpers ──────────────────────────────────────────────────────────────

/** Build a bilingual sitemap entry with hreflang alternates */
function localizedEntry(
  path: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  }
): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const languages: Record<string, string> = {
      "x-default": `${BASE_URL}/en${path}`,
    };
    for (const alt of locales) {
      languages[alt] = `${BASE_URL}/${alt}${path}`;
    }

    return {
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: opts.lastModified ?? new Date(),
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: { languages },
    };
  });
}

// ── API fetchers ─────────────────────────────────────────────────────────

interface SlugItem {
  slug: string;
}

interface CategoryItem extends SlugItem {
  children?: CategoryItem[];
}

interface PaginatedResponse<T> {
  data: {
    items: T[];
    pagination: {
      next_cursor: string | number | null;
      has_more: boolean;
    };
  };
}

/** Recursively collect every category slug (parents + children) */
function flattenCategorySlugs(categories: CategoryItem[]): string[] {
  const slugs: string[] = [];
  for (const cat of categories) {
    slugs.push(cat.slug);
    if (cat.children?.length) {
      slugs.push(...flattenCategorySlugs(cat.children));
    }
  }
  return slugs;
}

async function fetchCategorySlugs(): Promise<string[]> {
  try {
    const res: Response = await fetch(`${SERVER_API}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json: { data: CategoryItem[] } = await res.json();
    const categories: CategoryItem[] = json.data ?? [];
    return flattenCategorySlugs(categories);
  } catch {
    return [];
  }
}

async function fetchBrandSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let cursor: string | number | null = null;
  const limit = 50;

  try {
    // paginate through all brands
    for (let i = 0; i < 20; i++) {
      const apiUrl: string = cursor
        ? `${SERVER_API}/brands?limit=${limit}&cursor=${cursor}`
        : `${SERVER_API}/brands?limit=${limit}`;

      const res: Response = await fetch(apiUrl, { next: { revalidate: 3600 } });
      if (!res.ok) break;

      const json: PaginatedResponse<SlugItem> = await res.json();
      const items: SlugItem[] = json.data?.items ?? [];
      slugs.push(...items.map((b) => b.slug));

      if (!json.data?.pagination?.has_more) break;
      cursor = json.data.pagination.next_cursor;
    }
  } catch {
    /* swallow – return whatever we collected */
  }

  return slugs;
}

async function fetchProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let cursor: string | number | null = null;
  const limit = 50;

  try {
    // paginate through all products
    for (let i = 0; i < 100; i++) {
      const apiUrl: string = cursor
        ? `${SERVER_API}/products?limit=${limit}&cursor=${cursor}`
        : `${SERVER_API}/products?limit=${limit}`;

      const res: Response = await fetch(apiUrl, { next: { revalidate: 3600 } });
      if (!res.ok) break;

      const json: PaginatedResponse<SlugItem> = await res.json();
      const items: SlugItem[] = json.data?.items ?? [];
      slugs.push(...items.map((p) => p.slug));

      if (!json.data?.pagination?.has_more) break;
      cursor = json.data.pagination.next_cursor;
    }
  } catch {
    /* swallow */
  }

  return slugs;
}

// ── main sitemap ─────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic slugs in parallel
  const [categorySlugs, brandSlugs, productSlugs] = await Promise.all([
    fetchCategorySlugs(),
    fetchBrandSlugs(),
    fetchProductSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // ── 1. Static pages ────────────────────────────────────────────────────
  entries.push(
    ...localizedEntry("/home", {
      changeFrequency: "daily",
      priority: 1.0,
    })
  );

  entries.push(
    ...localizedEntry("/deals-of-day", {
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  entries.push(
    ...localizedEntry("/new-arrivals", {
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  entries.push(
    ...localizedEntry("/best-selling", {
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // ── 2. Legal / info pages ──────────────────────────────────────────────
  const legalPages = [
    "/contact-us",
    "/privacy-policy",
    "/return-policy",
    "/terms-conditions",
  ];

  for (const page of legalPages) {
    entries.push(
      ...localizedEntry(page, {
        changeFrequency: "monthly",
        priority: 0.3,
      })
    );
  }

  // ── 3. Category pages ──────────────────────────────────────────────────
  for (const slug of categorySlugs) {
    entries.push(
      ...localizedEntry(`/category/${slug}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  }

  // ── 4. Brand pages ─────────────────────────────────────────────────────
  for (const slug of brandSlugs) {
    entries.push(
      ...localizedEntry(`/brand/${slug}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  }

  // ── 5. Product pages ───────────────────────────────────────────────────
  for (const slug of productSlugs) {
    entries.push(
      ...localizedEntry(`/product/${slug}`, {
        changeFrequency: "daily",
        priority: 0.9,
      })
    );
  }

  return entries;
}