import api from "../api";
import type {
  CategoriesResponse,
} from "../types/categories";
import { BestSellingProductsResponse, NewArrivalProductsResponse, Product as HomeProduct, DealsOfTheDayResponse, DealProduct, BannerResponse, Banner, BrandsResponse, Brand } from "../types/home";
import { Pagination } from "../types/product";


////////////////////////////////////////////////////////////////
// ALL CATEGORIES
////////////////////////////////////////////////////////////////
export const getAllCategories = async (
  locale?: string
): Promise<CategoriesResponse> => {
  const endpoint = locale ? `/categories?locale=${locale}` : "/categories";
  const response = await api.get(endpoint);
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

////////////////////////////////////////////////////////////////
// All BANNERS
////////////////////////////////////////////////////////////////
export const getBanner = async (
  locale?: string
): Promise<Banner[]> => {
  const endpoint = locale ? `/banners?locale=${locale}` : "/banners";
  const response = await api.get<BannerResponse>(endpoint);
  const data = response.data?.data ?? [];
  return Array.isArray(data) ? data : [];
};

////////////////////////////////////////////////////////////////
// ALL BRANDS
////////////////////////////////////////////////////////////////
export const getBrands = async (): Promise<Brand[]> => {
  const endpoint = `/brands/all`;
  const response = await api.get<BrandsResponse>(endpoint);
  const data = response.data?.data ?? [];
  return Array.isArray(data) ? data : [];
};

////////////////////////////////////////////////////////////////
// BEST SELLING PRODUCTS
////////////////////////////////////////////////////////////////

export const getBestSellingProducts = async (
  limit?: number,
  pagination_type: string = "offset",
  page?: number
): Promise<{ items: HomeProduct[]; pagination: Pagination }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("include_seo", "true");
  if (limit) queryParams.append("limit", limit.toString());
  if (pagination_type) queryParams.append("pagination_type", pagination_type);
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/products/best-selling${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get<BestSellingProductsResponse>(endpoint);
  const items = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination as any;

  return {
    items: Array.isArray(items) ? items : [],
    pagination: {
      type: (paginationData?.type as string) ?? "cursor",
      next_cursor: paginationData?.next_cursor ?? null,
      prev_cursor: paginationData?.prev_cursor ?? null,
      has_more: !!(paginationData?.has_more ?? paginationData?.Has_More ?? false),
      limit: paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.Product_Count ?? paginationData?.total ?? items.length ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.Total_Pages ?? paginationData?.last_page ?? 1,
    }
  };
};

////////////////////////////////////////////////////////////////
//  NEW ARRIVALS PRODUCTS
////////////////////////////////////////////////////////////////

export const getNewArrivalProducts = async (
  limit?: number,
  pagination_type: string = "offset",
  page?: number
): Promise<{ items: HomeProduct[]; pagination: Pagination }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("include_seo", "true");
  if (limit) queryParams.append("limit", limit.toString());
  if (pagination_type) queryParams.append("pagination_type", pagination_type);
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/products/latest${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get<NewArrivalProductsResponse>(endpoint);
  const items = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination as any;

  return {
    items: Array.isArray(items) ? items : [],
    pagination: {
      type: (paginationData?.type as string) ?? "cursor",
      next_cursor: paginationData?.next_cursor ?? null,
      prev_cursor: paginationData?.prev_cursor ?? null,
      has_more: !!(paginationData?.has_more ?? paginationData?.Has_More ?? false),
      limit: paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.Product_Count ?? paginationData?.total ?? items.length ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.Total_Pages ?? paginationData?.last_page ?? 1,
    }
  };
};

////////////////////////////////////////////////////////////////
// DEALS OF THE DAY PRODUCTS
////////////////////////////////////////////////////////////////

export const getDealsOfTheDayProducts = async (
  limit?: number,
  pagination_type: string = "offset",
  page?: number
): Promise<{ items: DealProduct[]; pagination: Pagination }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("include_seo", "true");
  if (limit) queryParams.append("limit", limit.toString());
  if (pagination_type) queryParams.append("pagination_type", pagination_type);
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/products/deals${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get<DealsOfTheDayResponse>(endpoint);
  const items = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination as any;

  return {
    items: Array.isArray(items) ? items : [],
    pagination: {
      type: (paginationData?.type as string) ?? "cursor",
      next_cursor: paginationData?.next_cursor ?? null,
      prev_cursor: paginationData?.prev_cursor ?? null,
      has_more: !!(paginationData?.has_more ?? paginationData?.Has_More ?? false),
      limit: paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.Product_Count ?? paginationData?.total ?? items.length ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.Total_Pages ?? paginationData?.last_page ?? 1,
    }
  };
};
