import api from "../api";
import { CouponValidateRequest, CouponValidateResponse, GETAllCitiesForGovernorateResponse, GETAllGovernoratesResponse, OrderStatusResponse, PlaceCartOrderResponse } from "../types/checkout";

////////////////////////////////////////////////////////////////
// ALL GOVERNORATES
////////////////////////////////////////////////////////////////

export const getAllGovernorates = async (): Promise<GETAllGovernoratesResponse> => {
    const response = await api.get("/orders/governorates");
    return response.data;
};

////////////////////////////////////////////////////////////////
// ALL CITIES FOR GOVERNORATE
////////////////////////////////////////////////////////////////

export const getAllCitiesForGovernorate = async (governorateId: number): Promise<GETAllCitiesForGovernorateResponse> => {
    const response = await api.get(`orders/governorates/${governorateId}/cities`);
    return response.data;
};

////////////////////////////////////////////////////////////////
// PLACE CART ORDER
////////////////////////////////////////////////////////////////

export const getPlaceCartOrder = async (body: any): Promise<PlaceCartOrderResponse> => {
    const response = await api.post("/orders/place", body);
    return response.data;
};

export const getCouponValidate = async (body: CouponValidateRequest): Promise<CouponValidateResponse> => {
    const response = await api.post("/coupons/validate", body);
    return response.data;
};

////////////////////////////////////////////////////////////////
// ORDER STATUS
////////////////////////////////////////////////////////////////

export const getOrderStatus = async (orderId: number): Promise<OrderStatusResponse> => {
    const response = await api.get(`/orders/${orderId}/status`);
    return response.data;
};


