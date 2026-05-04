"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoryProducts, getCategory } from "@/utils/services/category";
import type { ProductsResponse, Category } from "@/utils/types/categories";
import { usePathname } from "next/navigation";

export interface CategoryProductsQueryResponse {
  products: ProductsResponse;
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


export function getCategoryQuery(
  slug: string,
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return useQuery<Category, Error>({
    queryKey: ["category", slug, lang],
    queryFn: () => getCategory(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

export function getProductsQuery(
  slug: string,
  options: {
    enabled?: boolean;
    limit?: number;
    cursor?: string;
    availability?: boolean;
    brands?: string[];
    min_price?: number;
    max_price?: number;
    sort?: string;
    page?: number;
    pagination_type?: "offset" | "cursor";
  } = {}
) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return useQuery<CategoryProductsQueryResponse, Error>({
    queryKey: [
      "products-by-category",
      slug,
      lang,
      options.limit,
      options.cursor,
      options.availability,
      options.brands,
      options.min_price,
      options.max_price,
      options.sort,
      options.page,
      options.pagination_type,
    ],

    queryFn: () =>
      getCategoryProducts(slug, {
        limit: options.limit,
        cursor: options.cursor,
        page: options.page,
        pagination_type: options.pagination_type,
        availability: options.availability,
        brand: options.brands,
        min_price: options.min_price,
        max_price: options.max_price,
        sort: options.sort,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

