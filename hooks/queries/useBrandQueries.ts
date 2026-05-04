
"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getBrandCategories, getBrandProducts, BrandCategory } from "@/utils/services/brand";
import type { ProductsResponse } from "@/utils/types/categories";

export interface BrandProductsQueryResponse {
  products: ProductsResponse;
  brand_name?: string;
  pagination: {
    next_cursor?: string | null;
    has_more: boolean;
    limit?: number;
    per_page?: number;
    product_count?: number;
    total?: number;
    total_pages?: number;
    last_page?: number;
    current_page?: number;
    from?: number;
    to?: number;
    type?: string;
  };
}

// Get brand categories
export function getBrandCategoriesQuery(
  slug: string,
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<BrandCategory[], Error>({
    queryKey: ["brand-categories", slug, locale],
    queryFn: () => getBrandCategories(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false && !!slug,
  });
}

// Get brand products with filters
export function getBrandProductsQuery(
  slug: string,
  options: {
    enabled?: boolean;
    limit?: number;
    cursor?: string;
    availability?: boolean;
    categories?: string[];
    min_price?: number;
    max_price?: number;
    sort?: string;
    page?: number;
    pagination_type?: "offset" | "cursor";
  } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<BrandProductsQueryResponse, Error>({
    queryKey: [
      "products-by-brand",
      slug,
      locale,
      options.limit,
      options.cursor,
      options.availability,
      options.categories,
      options.min_price,
      options.max_price,
      options.sort,
      options.page,
      options.pagination_type,
    ],

    queryFn: () =>
      getBrandProducts(slug, {
        limit: options.limit,
        cursor: options.cursor,
        page: options.page,
        pagination_type: options.pagination_type,
        availability: options.availability,
        category: options.categories, // Pass categories as category parameter
        min_price: options.min_price,
        max_price: options.max_price,
        sort: options.sort,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false && !!slug,
  });
}
