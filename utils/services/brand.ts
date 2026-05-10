import api from "../api";
import { Category, ProductsResponse } from "../types/categories";
import { Pagination } from "../types/product";

export interface CategoryProductsParams {
  limit?: number;
  cursor?: string;
  page?: number;
  pagination_type?: "offset" | "cursor";
  sort?: string | string[];
  min_price?: number;
  max_price?: number;
  brand?: string | string[];
  availability?: boolean;
}

export interface CategoryProductsResponse {
  category: Category;
  products: ProductsResponse;
  pagination: Pagination;
  brand_name?: string;
}

// Brand Categories Response
export interface BrandCategory {
  name: string;
  slug: string;
  products_count: number;
}

export interface BrandCategoriesResponse {
  categories: BrandCategory[];
}

////////////////////////////////////////////////////////////////
// BRAND CATEGORIES
////////////////////////////////////////////////////////////////

export const getBrandCategories = async (slug: string): Promise<BrandCategory[]> => {
  const endpoint = `/brands/${slug}/categories?include_seo=true`;
  const response = await api.get(endpoint);
  const data = response.data?.data;
  if (Array.isArray(data)) return data;
  return data?.categories ?? response.data?.categories ?? [];
};


////////////////////////////////////////////////////////////////
// BRAND PRODUCTS
////////////////////////////////////////////////////////////////

export const getBrandProducts = async (
  slug: string,
  params?: CategoryProductsParams & { category?: string | string[] }
): Promise<Omit<CategoryProductsResponse, "category"> & { brand_name?: string }> => {
  const queryParams = new URLSearchParams();

  // Handle query parameters for filtering and pagination
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pagination_type) queryParams.append("pagination_type", params.pagination_type);
  if (params?.sort) {
    if (Array.isArray(params.sort)) {
      params.sort.forEach((s) => queryParams.append("sort", s));
    } else {
      queryParams.append("sort", params.sort);
    }
  }
  if (params?.min_price !== undefined)
    queryParams.append("min_price", params.min_price.toString());
  if (params?.max_price !== undefined)
    queryParams.append("max_price", params.max_price.toString());

  // For brand products, we filter by categories
  if (params?.category) {
    if (Array.isArray(params.category)) {
      queryParams.append("categories", params.category.join(","));
    } else {
      queryParams.append("categories", params.category);
    }
  }

  if (params?.availability !== undefined)
    queryParams.append("availability", params.availability.toString());

  const queryString = queryParams.toString();
  const endpoint = `/brands/${slug}/products${queryString ? `?${queryString}` : ""}`;

  const response = await api.get(endpoint);
  const data = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination as any;
  const brandName = response.data?.data?.brand_name;
  const productsArray = Array.isArray(data) ? data : [];

  return {
    products: productsArray,
    brand_name: brandName,
    pagination: {
      type: paginationData?.type ?? "cursor",
      next_cursor: paginationData?.next_cursor ?? null,
      prev_cursor: paginationData?.prev_cursor ?? null,
      has_more: !!(paginationData?.has_more ?? paginationData?.Has_More ?? false),
      limit: paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.Product_Count ?? paginationData?.total ?? productsArray.length ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.Total_Pages ?? paginationData?.last_page ?? 0,
    },
  };
};
