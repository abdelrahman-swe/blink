"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getBanner, getBestSellingProducts, getBrands, getDealsOfTheDayProducts, getNewArrivalProducts } from "@/utils/services/home";
import type {
  CategoriesResponse,
  Category,
} from "@/utils/types/categories";
import { usePathname } from "next/navigation";
import { Product as HomeProduct, DealProduct, Banner, Brand } from "@/utils/types/home";




////////////////////////////////////////////////////////////////////////////
export function getAllCategoriesQuery(options: { enabled?: boolean } = {}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories", locale, "force-refresh"], // Stable key but different from original

    queryFn: () => getAllCategories(locale) as Promise<Category[]>,
    staleTime: 30 * 60 * 1000, // ✅ 30 minutes (categories rarely change)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: false,
    enabled: options.enabled !== false,
  });
}

////////////////////////////////////////////////////////////////////////////
export function getBestSellingProductsQuery(
  options: { enabled?: boolean; limit?: number; pagination_type?: string; page?: number } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<{ items: HomeProduct[]; pagination?: { product_count: number; has_more: boolean; total_pages: number } }, Error>({
    queryKey: ["best-selling-products", locale, options.limit, options.pagination_type || "offset", options.page],

    queryFn: () => getBestSellingProducts(options.limit, options.pagination_type || "offset", options.page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

////////////////////////////////////////////////////////////////////////////
export function getNewArrivalProductsQuery(
  options: { enabled?: boolean; limit?: number; pagination_type?: string; page?: number } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<{ items: HomeProduct[]; pagination?: { product_count: number; has_more: boolean; total_pages: number } }, Error>({
    queryKey: ["new-arrival-products", locale, options.limit, options.pagination_type || "offset", options.page],

    queryFn: () => getNewArrivalProducts(options.limit, options.pagination_type || "offset", options.page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

////////////////////////////////////////////////////////////////////////////////// 
export function getDealsOfTheDayProductsQuery(
  options: { enabled?: boolean; limit?: number; pagination_type?: string; page?: number } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<{ items: DealProduct[]; pagination?: { product_count: number; has_more: boolean; total_pages: number } }, Error>({
    queryKey: ["deals-of-the-day-products", locale, options.limit, options.pagination_type || "offset", options.page],

    queryFn: () => getDealsOfTheDayProducts(options.limit, options.pagination_type || "offset", options.page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

//////////////////////////////////////////////////////////////////////////////////
export function getBannerQuery(
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<Banner[], Error>({
    queryKey: ["banners", locale],
    queryFn: () => getBanner(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}

//////////////////////////////////////////////////////////////////////////////////
export function getBrandsQuery(
  options: { enabled?: boolean } = {}
) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return useQuery<Brand[], Error>({
    queryKey: ["brands", locale],
    queryFn: () => getBrands(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: options.enabled !== false,
  });
}