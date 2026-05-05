import api from "../api";
import { AddReviewResponse, DeleteReviewResponse, EditReviewResponse, ProductDetails, ProductReviewsResponse, ToggleHelpfulReviewResponse } from "../types/product";


////////////////////////////////////////////////////////////////
// PRODUCT DETAILS
////////////////////////////////////////////////////////////////

export const getProductDetails = async (slug: string,): Promise<ProductDetails | null> => {
  const queryParams = new URLSearchParams();
  queryParams.append("include_seo", "true");
  const queryString = queryParams.toString();
  const endpoint = `/products/slug/${slug}${queryString ? `?${queryString}` : ""
    }`;

  const response = await api.get(endpoint);
  const data = response.data?.data;

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data || null;
};


////////////////////////////////////////////////////////////////
// PRODUCT REVIEWS
////////////////////////////////////////////////////////////////

export const getProductReviews = async (
  slug: string,
  cursor?: string | null,
  limit?: number,
): Promise<ProductReviewsResponse["data"] | null> => {
  const queryParams = new URLSearchParams();
  if (cursor) queryParams.append("cursor", cursor);
  if (limit) queryParams.append("limit", limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/products/${slug}/reviews${queryString ? `?${queryString}` : ""}`;

  const response = await api.get(endpoint);
  return response.data?.data || null;
};


////////////////////////////////////////////////////////////////
// PRODUCT REVIEWS
////////////////////////////////////////////////////////////////

export const toggleProductReviewHelpful = async (id: string, guest_id?: string): Promise<ToggleHelpfulReviewResponse> => {
  const response = await api.post(`/reviews/${id}/helpful`, { guest_id });
  return response.data;
}

////////////////////////////////////////////////////////////////
// ADD PRODUCT REVIEWS
////////////////////////////////////////////////////////////////

export const addProductReview = async (data: { product_slug: string, rating: number, body: string }): Promise<AddReviewResponse> => {
  const response = await api.post(`/reviews`, data);
  return response.data;
}

////////////////////////////////////////////////////////////////
// EDIT PRODUCT REVIEWS
////////////////////////////////////////////////////////////////

export const EditProductReview = async (id: string, data: { rating: number, body: string }): Promise<EditReviewResponse> => {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data;
}

////////////////////////////////////////////////////////////////
// DELETE PRODUCT REVIEWS
////////////////////////////////////////////////////////////////

export const deleteProductReview = async (id: string): Promise<DeleteReviewResponse> => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
}