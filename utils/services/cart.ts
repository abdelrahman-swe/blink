import api from "../api";
import { ProductDetails } from "../types/product";

export interface CartResponse {
  status: string;
  message: string;
  data: [];
}

export interface AddToCartBody {
  product_id: number | string;
  quantity: number;
}

export interface RemoveFromCartBody {
  product_ids: number[];
}

export const getCartProduct = async (): Promise<ProductDetails[]> => {
  const endpoint = `/cart`;
  const response = await api.get(endpoint);
  const cartData = response.data?.data;

  if (cartData && Array.isArray(cartData.items)) {
    return cartData.items;
  }

  return [];
};

////////////////////////////////////////////////////////////////
// ADD ITEM TO CART IN PAGE DETIALS
////////////////////////////////////////////////////////////////

export const addToCart = async (body: AddToCartBody): Promise<CartResponse> => {
  const response = await api.post("/cart/items/add", body);
  if (response.data?.status === "fail" || response.data?.status === "error") {
    throw new Error(response.data.message || "Failed to add to cart");
  }
  return response.data;
};

////////////////////////////////////////////////////////////////
// CHANGE QUANTITY IN CART PAGE
////////////////////////////////////////////////////////////////

export const changeCartQuantity = async (body: AddToCartBody): Promise<CartResponse> => {
  const response = await api.post("/cart/items", body);
  if (response.data?.status === "fail" || response.data?.status === "error") {
    throw new Error(response.data.message || "Failed to change quantity");
  }
  return response.data;
};

////////////////////////////////////////////////////////////////
// REMOVE ITEM(S) FROM CART
////////////////////////////////////////////////////////////////

export const removeFromCart = async (body: RemoveFromCartBody): Promise<CartResponse> => {
  const response = await api.delete("/cart/remove", { data: body });
  return response.data;
};
