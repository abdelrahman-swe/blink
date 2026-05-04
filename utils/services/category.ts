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
}

////////////////////////////////////////////////////////////////
// GET CATEGORY
////////////////////////////////////////////////////////////////

export const getCategory = async (slug: string): Promise<Category> => {
  const endpoint = `/categories/${slug}`;
  const response = await api.get(endpoint);

  const categoryData = response.data?.data?.category;
  const childrenData = response.data?.data?.children ?? [];
  const parentsData = response.data?.data?.parents ?? [];

  const categoryWithChildren = categoryData
    ? {
      ...categoryData,
      children: childrenData.length > 0 ? childrenData : [],
      parents: parentsData.length > 0 ? parentsData : [],
    }
    : null;

  return categoryWithChildren;
};

////////////////////////////////////////////////////////////////
// GET CATEGORY PRODUCTS
////////////////////////////////////////////////////////////////

export const getCategoryProducts = async (
  slug: string,
  params?: CategoryProductsParams
): Promise<Omit<CategoryProductsResponse, "category">> => {
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
  if (params?.brand) {
    if (Array.isArray(params.brand)) {
      queryParams.append("brand", params.brand.join(","));
    } else {
      queryParams.append("brand", params.brand);
    }
  }
  if (params?.availability !== undefined)
    queryParams.append("availability", params.availability.toString());

  const queryString = queryParams.toString();
  const endpoint = `/categories/${slug}/products${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get(endpoint);
  const data = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination as any;
  const productsArray = Array.isArray(data) ? data : [];

  return {
    products: productsArray,
    pagination: {
      type: paginationData?.type ?? "cursor",
      next_cursor: paginationData?.next_cursor ?? null,
      prev_cursor: paginationData?.prev_cursor ?? null,
      has_more: !!(paginationData?.has_more ?? paginationData?.Has_More ?? false),
      limit: paginationData?.limit ?? paginationData?.per_page ?? 12,
      product_count: paginationData?.Product_Count ?? paginationData?.total ?? paginationData?.product_count ?? productsArray.length ?? 0,
      total_pages: paginationData?.Total_Pages ?? paginationData?.last_page ?? paginationData?.total_pages ?? 0,
    },
  };
};
