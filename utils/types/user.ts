import { Product, Image } from "./product";

////////////////////////////////////////////////


export interface AddAddressPayload {
    governorate_id: number;
    city_id: number;
    address: string;
    // phone: string;
    label: string;
    is_default: boolean
}

export interface AddAddressResponse {
    status: string;
    message: string;
    data: {
        address: {
            id: number;
            user_id: number;
            label: string;
            governorate_id: number;
            city_id: number;
            governorate?: string;
            city?: string;
            address: string;
            // phone: string;
            is_default: boolean;
            created_at: string;
            updated_at: string;
        };
    };
}
////////////////////////////////////////////////

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

export interface DeleteAddressPayload {
    id: number
}

export interface DeleteAddressResponse {
    status: string;
    message: string;
    data: null
}

export interface EditAddressPayload {
    id: number;
    governorate_id: number;
    city_id: number;
    address: string;
    // phone: string;
    label: string;
}

export interface EditAddressResponse {
    status: string;
    message: string;
    data: {
        address: {
            id: number;
            user_id: number;
            label: string;
            governorate_id: number;
            city_id: number;
            governorate?: string;
            city?: string;
            address: string;
            phone: string;
            is_default: boolean;
            created_at: string;
            updated_at: string;
        };
    };
}

export interface DefaultAddressPayload {
    id: number
}

export interface DefaultAddressResponse {
    status: string;
    message: string;
    data: {
        address: {
            id: number;
            user_id: number;
            label: string;
            governorate_id: number;
            city_id: number;
            governorate?: string;
            city?: string;
            address: string;
            phone: string;
            is_default: boolean;
            created_at: string;
            updated_at: string;
        };
    };
}

export interface GetAddressesResponse {
    status: string;
    message: string;
    data: {
        addresses: {
            id: number;
            user_id: number;
            label: string;
            governorate_id: number;
            city_id: number;
            address: string;
            phone: string;
            is_default: boolean;
            created_at: string;
            updated_at: string;
            governorate?: string;
            city?: string;
        }[];
    };
}


////////////////////////////////////////////////

export interface ProfileAccountResponse {
    status: string;
    message: string;
    data: {
        full_name: string;
        email: string;
        phone: string;
        avatar?: Image;
    }
}

////////////////////////////////////////////////


export interface UpdateProfilePayload {
    full_name?: string;
    email?: string;
    phone?: string | number;
    avatar?: File | string;
}


export interface UpdateProfileResponse {
    status: string;
    message: string;
    data: {
        full_name: string;
        email: string;
        phone: number;
        avatar?: Image;
        otp_required?: boolean;

    }
}


////////////////////////////////////////////////

export interface VerifyProfileInfoPayload {
    otp: string;
}

export interface VerifyProfileInfoResponse {
    status: string;
    message: string;
    data: {
        email: string;
        phone: string;
    }
}
////////////////////////////////////////////////

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface ChangePasswordResponse {
    status: string;
    message: string;
}

////////////////////////////////////////////////

export interface DeleteAccountPayload {
    password: string;
}

export interface DeleteAccountResponse {
    status: string;
    message: string;
}

////////////////////////////////////////////////

export interface UserToggleFavoritePayload {
    id: number
}

export interface UserToggleFavoriteResponse {
    status: string;
    message: string;
    data: {
        is_favorite: boolean;
    }
}


/////////////////////////////////////////////////
export interface UserAllFavoritesPayload {
    token: string
}

export interface UserAllFavoritesResponse {
    products: Product[];
    pagination: {
        next_cursor?: string | null;
        has_more: boolean;
        limit?: number;
        per_page?: number;
        product_count?: number;
        total?: number;
        total_pages?: number;
        last_page?: number;
        current_page?: number;
        from?: number;
        to?: number;
        type?: string;
    };
}

export interface UserAllFavoritesRawResponse {
    status: string;
    message: string;
    data: {
        items: Product[];
        pagination?: UserAllFavoritesResponse['pagination'];
    }
}

/////////////////////////////////////////////////

export interface CursorPagination {
    type: string;
    next_cursor: string | null;
    prev_cursor: string | null;
    has_more: boolean;
    limit: number;
}

/////////////////////////////////////////////////



export interface OrderShippingAddress {
    governorate: string;
    city: string;
    address: string;
}

export interface OrderItem {
    product_id: number;
    name: string;
    slug: string;
    sku: string | null;
    quantity: number;
    unit_price: string;
    total: string;
    image: Image;
    is_deleted: boolean;
    is_active: boolean;
}


export interface Order {
    id: number;
    order_number: string;
    status: string;
    total_price: string;
    currency: string;
    shipping_address: OrderShippingAddress;
    discount_amount: string;
    estimated_delivery_time: string;
    delivered_at: string;
    items: OrderItem[];
    items_count: number;
    is_returned: boolean;
    can_return: boolean;
    created_at: string;
}



export interface UserOrdersResponse {
    status: string;
    message: string;
    data: {
        items: Order[];
        pagination?: CursorPagination;
    }
}

export interface UserCancelOrderPayload {
    order_id: number;
}

export interface UserCancelOrderResponse {
    status: string;
    message: string;
    data: null
}
////////////////////////////////////////////////

export interface ReturnShippingAddress {
    city: string;
    address: string;
    city_id: number;
    governorate: string;
    governorate_id: number;
}

export interface ReturnItem {
    id: number;
    order_item_id: number;
    quantity: number;
    product_id: number;
    name: string;
    slug: string;
    sku: string | null;
    unit_price: string;
    total: number;
    image: Image | null;
    is_deleted: boolean;
    is_active: boolean;

}


export interface Return {
    id: number;
    order_id: number;
    order_number: string;
    total_price: string;
    currency: string;
    shipping_address: ReturnShippingAddress;
    discount_amount: string;
    status: string;
    created_at: string;
    items: ReturnItem[];
    items_count: number;
}



export interface UserReturnsResponse {
    status: string;
    message: string;
    data: {
        items: Return[];
        pagination: CursorPagination;
    };
}

///////////////////////////////////////////////////////////////////////
// order return for form 

export interface UserReturnOrder {
    id: number;
    order_number: string;
    total_price: string;
    currency: string;
    items: {
        id: number;
        product_id: number;
        name: string;
        slug: string;
        sku: string | null;
        quantity: number;
        unit_price: string;
        total: string;
        image: Image | null;
        is_deleted: boolean;
    }[];
    items_count: number;
    created_at: string;
    updated_at: string;
}


///////////////////////////////////////////////////////////////////////

export interface UserReturnReason {
    key: string;
    label: string;
}

export interface ReturnReasonsResponse {
    status: string;
    message: string;
    data: UserReturnReason[];
}

///////////////////////////////////////////////////////////////////////
export interface CreateReturnPayload {
    order_id: number;
    reason: string;
    description?: string;
    items: {
        order_item_id: number;
        quantity: number;
    }[];
    media: File[];
}

export interface CreateReturnResponse {
    status: string;
    message: string;
    data: any;
}
