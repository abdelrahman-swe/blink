import { getAllCitiesForGovernorate, getAllGovernorates, getCouponValidate, getOrderStatus, getPlaceCartOrder } from "@/utils/services/checkout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckoutFormData, CouponValidateRequest, CouponValidateResponse } from "@/utils/types/checkout";




export function useGetGovernoratesQuery() {
    return useQuery({
        queryKey: ["governorates"],
        queryFn: () => getAllGovernorates(),
    });
}

export function useGetCitiesForGovernorateQuery(governorateId: number) {
    return useQuery({
        queryKey: ["cities", governorateId],
        queryFn: () => getAllCitiesForGovernorate(governorateId),
        enabled: !!governorateId,
    });
}


export function usePlaceOrderQuery() {
    const queryClient = useQueryClient();

    return useMutation<any, Error, CheckoutFormData>({
        mutationFn: (body) => getPlaceCartOrder(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-orders"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}

export function useGetOrderStatusQuery(orderId: number | null) {
    return useQuery({
        queryKey: ["orderStatus", orderId],
        queryFn: () => {
            return getOrderStatus(orderId!);
        },
        refetchInterval: (query) => {
            const status = query.state.data?.order_status;
            if (status === "paid" || status === "processing" || status === "failed") {
                return false;
            }
            return 3000;
        },
        refetchOnWindowFocus: false,
        enabled: !!orderId,
    });
}

////////////////////////////////////////////////////////////////
// VALIDATE COUPON
////////////////////////////////////////////////////////////////

export function useValidateCouponMutation() {
    return useMutation<CouponValidateResponse, Error, CouponValidateRequest>({
        mutationFn: (body) => getCouponValidate(body),
    });
}
