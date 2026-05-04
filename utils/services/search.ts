import api from "../api";
import { ProductsResponse, SearchResultSuggestion, SearchByNameResponse } from "../types/categories";
import { Pagination } from "../types/product";

export interface SearchProductsParams {
  limit?: number;
  cursor?: string;
  page?: number;
  pagination_type?: "offset" | "cursor";
  sort?: string | string[];
  min_price?: number;
  max_price?: number;
  brand?: string | string[];
  availability?: boolean;
  category?: string;
  categories?: string[];

}

export interface SearchProductsResponse {
  products: ProductsResponse;
  pagination: Pagination;
}

////////////////////////////////////////////////////////////////
// SEARCH SUGGESTION
////////////////////////////////////////////////////////////////

export const getSearchSuggestion = async (
  keyword: string
): Promise<SearchResultSuggestion> => {
  const endpoint = `/products/suggestions?keyword=${keyword}`;
  const response = await api.get(endpoint);
  return response.data;
};


////////////////////////////////////////////////////////////////
// SEARCH PRODUCT BY NAME
////////////////////////////////////////////////////////////////

export const getSearchProductByName = async (name: string): Promise<SearchByNameResponse> => {
  const endpoint = `/products/by-name?name=${name}`;
  const response = await api.get(endpoint);
  return response.data.data;
};


////////////////////////////////////////////////////////////////
// SEARCH PRODUCTS BY NAME
////////////////////////////////////////////////////////////////

export const getSearchProducts = async (
  name: string,
  params?: SearchProductsParams
): Promise<SearchProductsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("name", name);

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

  if (params?.category)
    queryParams.append("category", params.category);

  if (params?.categories) {
    if (Array.isArray(params.categories)) {
      queryParams.append("category", params.categories.join(","));
    } else {
      queryParams.append("category", params.categories);
    }
  }

  const queryString = queryParams.toString();
  const endpoint = `/products/by-name/products?${queryString}`;


  const response = await api.get(endpoint);
  // Extract products from data.items array
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
      limit: paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.Product_Count ?? paginationData?.total ?? productsArray.length ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.Total_Pages ?? paginationData?.last_page ?? 0,
    },
  };
};
