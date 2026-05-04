
export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone_number: string;
  save_address: boolean,
  shipping_address: {
    governorate_id: number;
    city_id: number;
    address: string;
  };
  notes?: string;
  terms: boolean;
  paymentMethod: PaymentMethod;
  coupon_code?: string;
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "cod",
  PAYMOB = "paymob",
}

export interface OrderSummary {
  subtotal: number;
  shippingFee: number;
  cashOnDeliveryFee: number;
  discountAmount?: number;
  total: number;
}

/////////////////////////////////////////////////////

export interface CouponValidateRequest {
  code: string;
  order_total: number;
}

export interface CouponValidateResponse {
  status: string;
  message?: string;
  data: {
    coupon_code?: string;
    discount_amount?: number;
    final_total?: number;
    description?: string | null;
    error?: string | null;
  };
}

export interface PlaceCartOrderResponse {
  status: string;
  message: string;
  data: {
    message: string;
    payment_key?: string;
    redirect_url?: string;
    order: {
      id: number;
      order_number: string;
      status: string;
      total_price: string;
      currency: string;
    }
  }
}

export interface OrderStatusResponse {
  status: string;
  order_status: string;
  order_number: string;
}

export interface GETAllGovernoratesResponse {
  status: string,
  message: string,
  data: {
    governorates: [
      {
        id: number,
        name: string
      },
    ]
  }
}

export interface GETAllCitiesForGovernorateResponse {
  status: string,
  message: string,
  data: {
    cities: [
      {
        id: number,
        name: string
      },
    ]
  }
}
