import {
  getSearchProductByName,
  getSearchProducts,
  getSearchSuggestion,
  SearchProductsResponse,
} from "@/utils/services/search";
import {
  SearchSuggestionResponse,
  SearchByNameResponse,
} from "@/utils/types/categories";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export function getSearchSuggestionQuery(
  keyword: string,
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<SearchSuggestionResponse, Error>({
    queryKey: ["search-suggestion", keyword, locale],

    queryFn: () => getSearchSuggestion(keyword),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}


export function getSearchQuery(
  name: string,
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<SearchByNameResponse, Error>({
    queryKey: ["search", name, locale],
    queryFn: () => getSearchProductByName(name),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false && !!name,
  });
}

export function getSearchProductsQuery(
  name: string,
  options: {
    enabled?: boolean;
    limit?: number;
    cursor?: string;
    availability?: boolean;
    brands?: string[];
    min_price?: number;
    max_price?: number;
    sort?: string;
    category?: string;
    categories?: string[];
    page?: number;
    pagination_type?: "offset" | "cursor";
  } = {}
) {
  const { enabled, ...queryParams } = options;

  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<SearchProductsResponse, Error>({
    queryKey: [
      "search-products",
      name,
      locale,
      queryParams.limit,
      queryParams.cursor,
      queryParams.availability,
      queryParams.brands,
      queryParams.min_price,
      queryParams.max_price,
      queryParams.sort,
      queryParams.category,
      queryParams.categories,
      queryParams.page,
      queryParams.pagination_type,
    ],

    queryFn: () =>
      getSearchProducts(name, {
        limit: queryParams.limit,
        cursor: queryParams.cursor,
        page: queryParams.page,
        pagination_type: queryParams.pagination_type,
        availability: queryParams.availability,
        brand: queryParams.brands,
        min_price: queryParams.min_price,
        max_price: queryParams.max_price,
        sort: queryParams.sort,
        category: queryParams.category,
        categories: queryParams.categories,
      }),
    staleTime: 2 * 60 * 1000, // ✅ 2 minutes (users expect fresh results)
    gcTime: 5 * 60 * 1000, // 5 minutes    retry: false,
    enabled: enabled !== false && !!name,
  });
}
