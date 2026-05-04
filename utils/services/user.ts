import api from "../api";
import {
  AddAddressPayload,
  AddAddressResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  DefaultAddressResponse,
  DeleteAccountPayload,
  DeleteAccountResponse,
  DeleteAddressResponse,
  EditAddressPayload,
  EditAddressResponse,
  GetAddressesResponse,
  GETAllCitiesForGovernorateResponse,
  GETAllGovernoratesResponse,
  Order,
  ProfileAccountResponse,
  Return,
  ReturnReasonsResponse,
  UserReturnReason,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserAllFavoritesResponse,
  UserReturnOrder,
  UserToggleFavoriteResponse,

  CreateReturnPayload,
  CreateReturnResponse,
  UserCancelOrderResponse,
  VerifyProfileInfoPayload,
  VerifyProfileInfoResponse,
} from "@/utils/types/user";

import { LogoutPayload, LogoutResponse } from "../types/auth";



////////////////////////////////////////////////////////////////
// USER PROFILE 
////////////////////////////////////////////////////////////////

export const getProfileAccount = async (): Promise<ProfileAccountResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};


export const getUpdateProfile = async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  if (payload.full_name) {
    formData.append("full_name", payload.full_name);
  }
  if (payload.email) {
    formData.append("email", payload.email);
  }
  if (payload.phone) {
    formData.append("phone", payload.phone.toString());
  }

  if (payload.avatar instanceof File) {
    formData.append("avatar", payload.avatar);
  }

  const response = await api.post("/profile/update", formData);
  return response.data;
};


export const verifyProfileInfo = async (payload: VerifyProfileInfoPayload): Promise<VerifyProfileInfoResponse> => {
  const response = await api.post("/profile/verify-update", payload);
  return response.data;
};

export const profileResendOtp = async (payload: { phone: string, email: string }): Promise<UpdateProfileResponse> => {
  const formData = new FormData();
  formData.append("phone", payload.phone);
  formData.append("email", payload.email);

  const response = await api.post("/profile/update", formData);
  return response.data;
};




////////////////////////////////////////////////////////////////
// USER ADDRESSES 
////////////////////////////////////////////////////////////////

export const getAllGovernorates = async (): Promise<GETAllGovernoratesResponse> => {
  const response = await api.get("/orders/governorates");
  return response.data;
};

export const getAllCitiesForGovernorate = async (governorateId: number): Promise<GETAllCitiesForGovernorateResponse> => {
  const response = await api.get(`orders/governorates/${governorateId}/cities`);
  return response.data;
};


export const getAddress = async (): Promise<GetAddressesResponse> => {
  const response = await api.get("/profile/addresses");
  return response.data;
};

export const createAddress = async (payload: AddAddressPayload): Promise<AddAddressResponse> => {
  const response = await api.post("/profile/addresses", payload);
  return response.data;
};


export const deleteAddress = async (id: number): Promise<DeleteAddressResponse> => {
  const response = await api.delete(`/profile/addresses/${id}`);
  return response.data;
};


export const editAddress = async (payload: EditAddressPayload): Promise<EditAddressResponse> => {
  const { id, ...data } = payload;
  const response = await api.put(`/profile/addresses/${id}`, data);
  return response.data;
};


export const defaultAddress = async (id: number): Promise<DefaultAddressResponse> => {
  const response = await api.patch(`/profile/addresses/${id}/default`);
  return response.data;
};


////////////////////////////////////////////////////////////////
// SECURITY SERRINGS
////////////////////////////////////////////////////////////////

export const getLogoutUser = async (body: LogoutPayload): Promise<LogoutResponse> => {
  const response = await api.post("/auth/logout", body);
  return response.data;
};

export const deleteAccount = async (payload: DeleteAccountPayload): Promise<DeleteAccountResponse> => {
  const response = await api.delete("/profile/delete", { data: payload });
  return response.data;
};


export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  const response = await api.post("/password/change", payload);
  return response.data;
};



////////////////////////////////////////////////////////////////
// USER FAVORITES 
////////////////////////////////////////////////////////////////

export const getToggleUserFavorites = async (id: number): Promise<UserToggleFavoriteResponse> => {
  const response = await api.post(`/products/${id}/favorite`);
  return response.data;
};

export const getUserAllFavorites = async (params?: { page?: number; limit?: number; pagination_type?: "offset" | "cursor" }): Promise<UserAllFavoritesResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.pagination_type) queryParams.append("pagination_type", params.pagination_type);

  const queryString = queryParams.toString();
  const endpoint = `/products/favorites${queryString ? `?${queryString}` : ""}`;
  const response = await api.get(endpoint);

  const data = response.data?.data?.items ?? [];
  const paginationData = response.data?.data?.pagination;

  return {
    products: Array.isArray(data) ? data : [],
    pagination: {
      next_cursor: paginationData?.next_cursor ?? null,
      has_more: paginationData?.has_more ?? false,
      limit: paginationData?.limit ?? paginationData?.per_page ?? 12,
      per_page: paginationData?.per_page ?? paginationData?.limit ?? 12,
      product_count: paginationData?.product_count ?? paginationData?.total ?? data.length ?? 0,
      total: paginationData?.total ?? paginationData?.product_count ?? 0,
      total_pages: paginationData?.total_pages ?? paginationData?.last_page ?? 0,
      last_page: paginationData?.last_page ?? paginationData?.total_pages ?? 0,
      current_page: paginationData?.current_page ?? 1,
    },
  };
};


////////////////////////////////////////////////////////////////
// USER ORDERS 
////////////////////////////////////////////////////////////////

export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get("profile/orders");
  return response.data.data.orders;
};


////////////////////////////////////////////////////////////////
// USER CANCEL ORDER 
////////////////////////////////////////////////////////////////

export const getUserCancelOrder = async (id: string | number): Promise<UserCancelOrderResponse> => {
  const response = await api.post(`/orders/${id}/cancel`);
  return response.data.data;
};


////////////////////////////////////////////////////////////////
// USER RETURNS 
////////////////////////////////////////////////////////////////

export const getUserReturns = async (): Promise<Return[]> => {
  const response = await api.get("/returns");
  return response.data.data.items;
};


////////////////////////////////////////////////////////////////
// USER RETURN ORDER 
////////////////////////////////////////////////////////////////

export const getUserReturnOrder = async (id: string | number): Promise<UserReturnOrder> => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

////////////////////////////////////////////////////////////////
// USER RETURN REASONS (RADIO BUTTON GROUP) 
////////////////////////////////////////////////////////////////
export const getUserReturnReasons = async (): Promise<UserReturnReason[]> => {
  const response = await api.get("/returns/reasons");
  return response.data.data;
};


export const createReturn = async (payload: CreateReturnPayload): Promise<CreateReturnResponse> => {
  const formData = new FormData();
  formData.append("order_id", payload.order_id.toString());
  formData.append("reason", payload.reason);

  // Always append description if it exists in the payload, even if empty string
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  payload.items.forEach((item, index) => {
    formData.append(`items[${index}][order_item_id]`, item.order_item_id.toString());
    formData.append(`items[${index}][quantity]`, item.quantity.toString());
  });

  payload.media.forEach((file) => {
    formData.append("media[]", file);
  });


  const response = await api.post("/returns", formData);
  return response.data;
};
