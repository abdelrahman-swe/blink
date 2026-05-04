import { changePassword, createAddress, createReturn, defaultAddress, deleteAccount, deleteAddress, editAddress, getAddress, getAllCitiesForGovernorate, getAllGovernorates, getLogoutUser, getProfileAccount, getToggleUserFavorites, getUpdateProfile, getUserAllFavorites, getUserCancelOrder, getUserOrders, getUserReturnOrder, getUserReturnReasons, getUserReturns, profileResendOtp, verifyProfileInfo } from "@/utils/services/user";
import { AddAddressPayload, AddAddressResponse, ChangePasswordPayload, ChangePasswordResponse, CreateReturnPayload, CreateReturnResponse, DefaultAddressPayload, DefaultAddressResponse, DeleteAccountPayload, DeleteAccountResponse, DeleteAddressPayload, DeleteAddressResponse, EditAddressPayload, EditAddressResponse, GetAddressesResponse, Order, ProfileAccountResponse, Return, UpdateProfilePayload, UpdateProfileResponse, UserAllFavoritesResponse, UserCancelOrderResponse, UserOrdersResponse, UserReturnOrder, UserReturnReason, UserToggleFavoriteResponse, VerifyProfileInfoPayload, VerifyProfileInfoResponse } from "@/utils/types/user";
import { LogoutResponse } from "@/utils/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";



/////////////////////////////////////////////////////
// PROFILE ACCOUNT 
/////////////////////////////////////////////////////

export function useProfileAccount() {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<ProfileAccountResponse, Error>({
        queryKey: ["profile-account", lang],
        queryFn: getProfileAccount,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: isAuthenticated,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
        mutationFn: async (body: UpdateProfilePayload) => {
            return getUpdateProfile(body);
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["profile-account"] });
            toast.success(data.message || "Profile updated successfully!");

            const currentUser = useUserStore.getState().user;
            if (currentUser && data.data) {
                useUserStore.getState().setUser({
                    ...currentUser,
                    full_name: data.data.full_name,
                    email: data.data.email,
                    phone: String(data.data.phone),
                });
            }

            const otp = data.otp || data.data?.otp;
            if (otp) {
                toast.info(`Verification code: ${otp}`, {
                    duration: 10000,
                });
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });
}

export function useVerifyProfileInfo() {
    const queryClient = useQueryClient();

    return useMutation<VerifyProfileInfoResponse, Error, VerifyProfileInfoPayload>({
        mutationFn: async (body: VerifyProfileInfoPayload) => {
            return verifyProfileInfo(body);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-account"] });
            toast.success(data.message || "Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });
}

export function useResendProfileOtp() {
    const queryClient = useQueryClient();

    return useMutation<UpdateProfileResponse, Error, { phone: string, email: string }>({
        mutationFn: async (body: { phone: string, email: string }) => {
            return profileResendOtp(body);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-account"] });
            toast.success(data.message || "Resend Profile Otp Successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to resend otp");
        },
    });
}



/////////////////////////////////////////////////////
// PROFILE ADDRESSES
/////////////////////////////////////////////////////
export function useGetGovernoratesQuery() {
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery({
        queryKey: ["governorates", lang],
        queryFn: () => getAllGovernorates(),
    });
}

export function useGetCitiesForGovernorateQuery(governorateId: number) {
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery({
        queryKey: ["cities", governorateId, lang],
        queryFn: () => getAllCitiesForGovernorate(governorateId),
        enabled: !!governorateId,
    });
}


export function useGetAddresses() {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<GetAddressesResponse, Error>({
        queryKey: ["profile-addresses", lang],
        queryFn: getAddress,
        staleTime: 0,
        refetchOnMount: true,
        enabled: isAuthenticated,
    });
}

export function useAddAddress() {
    const queryClient = useQueryClient();

    return useMutation<AddAddressResponse, Error, AddAddressPayload>({
        mutationFn: async (body: AddAddressPayload) => {
            return createAddress(body);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-addresses"] });
            toast.success(data.message || "Address added successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add address");
        },
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation<DeleteAddressResponse, Error, DeleteAddressPayload>({
        mutationFn: async (body: DeleteAddressPayload) => {
            return deleteAddress(body.id);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-addresses"] });
            toast.success(data.message || "Address deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete address");
        },
    });
}

export function useEditAddress() {
    const queryClient = useQueryClient();

    return useMutation<EditAddressResponse, Error, EditAddressPayload>({
        mutationFn: async (body: EditAddressPayload) => {
            return editAddress(body);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-addresses"] });
            toast.success(data.message || "Address updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update address");
        },
    });
}

export function useDefaultAddress() {
    const queryClient = useQueryClient();

    return useMutation<DefaultAddressResponse, Error, DefaultAddressPayload>({
        mutationFn: async (body: DefaultAddressPayload) => {
            return defaultAddress(body.id);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile-addresses"] });
            toast.success(data.message || "Default address updated!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to set default address");
        },
    });
}


/////////////////////////////////////////////////////
// SECURITY SETTINGS
/////////////////////////////////////////////////////

export function useChangePassword() {
    const queryClient = useQueryClient();

    return useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
        mutationFn: (body: ChangePasswordPayload) => changePassword(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["change-password"] });
        },
    });
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation<DeleteAccountResponse, Error, DeleteAccountPayload>({
        mutationFn: (body: DeleteAccountPayload) => deleteAccount(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delete-account"] });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation<LogoutResponse, Error, void>({
        mutationFn: async () => {
            const token = useUserStore.getState().user?.token || Cookies.get("token") || "";
            return getLogoutUser({ token });
        },
        onSuccess: (response) => {
            toast.success(response.message || "Logout successfully!");

            // Clear all React Query cache before logging out
            queryClient.clear();

            useUserStore.getState().logout();
        },

        onError: (error: any) => {
            // Clear all React Query cache even on error
            queryClient.clear();

            useUserStore.getState().logout();
            toast.error(error.response?.data?.message || "Logout failed");
        },
    });
}

/////////////////////////////////////////////////////
// FAVURITES
/////////////////////////////////////////////////////

export function useToggleUserFavorites() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang as string || 'en';

    return useMutation<UserToggleFavoriteResponse, Error, number>({
        mutationFn: async (id: number) => {
            return getToggleUserFavorites(id);
        },
        // Optimistic update - update UI immediately before API call completes
        onMutate: async (productId: number) => {
            // Snapshot previous values for rollback
            const previousData = new Map();

            // Define the keys we care about
            const listKeys = [
                "products",
                "products-by-category",
                "products-by-brand",
                "search-products",
                "best-selling-products",
                "new-arrival-products",
                "deals-of-the-day-products",
                "user-all-favorites"
            ];

            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({
                predicate: (query) => {
                    const key = query.queryKey[0] as string;
                    return listKeys.includes(key) || key === "product";
                }
            });

            // Helper function to update a product or a list of products
            const updateProduct = (item: any, isWishlist: boolean = false): any => {
                if (!item) return item;

                // If it's an array, map over it
                if (Array.isArray(item)) {
                    if (isWishlist) {
                        return item.filter((p: any) => p.id !== productId && p.product_id !== productId);
                    }
                    return item.map((subItem) => updateProduct(subItem, isWishlist));
                }

                // If it's a product, toggle its status
                if (item.id === productId || item.product_id === productId) {
                    item = { ...item, is_favorite: !item.is_favorite };
                }

                // Recursively update similar_products if they exist
                if (Array.isArray(item.similar_products)) {
                    item = {
                        ...item,
                        similar_products: item.similar_products.map((p: any) => updateProduct(p, false)),
                    };
                }

                // Handle structures with 'products', 'items', or 'data' arrays
                const collections = ['products', 'items', 'data'];
                collections.forEach(key => {
                    if (item[key] && Array.isArray(item[key])) {
                        if (isWishlist && key === 'products') {
                            const originalLen = item[key].length;
                            const filtered = item[key].filter((p: any) => p.id !== productId && p.product_id !== productId);

                            if (filtered.length < originalLen) {
                                item = {
                                    ...item,
                                    [key]: filtered,
                                    pagination: item.pagination ? {
                                        ...item.pagination,
                                        product_count: Math.max(0, (item.pagination.product_count || 0) - 1)
                                    } : item.pagination
                                };
                            }
                        } else {
                            item = { ...item, [key]: item[key].map((p: any) => updateProduct(p, false)) };
                        }
                    } else if (item[key] && typeof item[key] === 'object') {
                        // Recursively handle nested object in 'data'
                        item = { ...item, [key]: updateProduct(item[key], isWishlist) };
                    }
                });

                return item;
            };

            // Update all product lists
            const queries = queryClient.getQueryCache().findAll({
                predicate: (query) => listKeys.includes(query.queryKey[0] as string)
            });

            queries.forEach(query => {
                queryClient.setQueryData(query.queryKey, (old: any) => {
                    if (!old) return old;
                    previousData.set(JSON.stringify(query.queryKey), old);
                    const isWishlist = query.queryKey[0] === "user-all-favorites";
                    return updateProduct(old, isWishlist);
                });
            });

            // Update single product detail if it's cached
            const productQueries = queryClient.getQueryCache().findAll({
                predicate: (query) => query.queryKey[0] === "product"
            });

            productQueries.forEach(query => {
                queryClient.setQueryData(query.queryKey, (old: any) => {
                    if (!old) return old;
                    previousData.set(JSON.stringify(query.queryKey), old);

                    const updateProductDetail = (item: any): any => {
                        if (!item) return item;
                        if (item.id === productId || item.product_id === productId) {
                            item = { ...item, is_favorite: !item.is_favorite };
                        }
                        if (Array.isArray(item.similar_products)) {
                            item = {
                                ...item,
                                similar_products: item.similar_products.map((p: any) =>
                                    (p.id === productId || p.product_id === productId)
                                        ? { ...p, is_favorite: !p.is_favorite }
                                        : p
                                ),
                            };
                        }
                        if (item.data) {
                            item = { ...item, data: updateProductDetail(item.data) };
                        }
                        return item;
                    };

                    return updateProductDetail(old);
                });
            });

            return { previousData };
        },
        onSuccess: (response) => {
            toast.success(response.message || "Product favorites updated!");

            // Invalidate to ensure data is fresh from server
            queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
            queryClient.invalidateQueries({ queryKey: ["user-all-favorites"] });

            // Invalidate all product lists to refresh favorite status
            queryClient.invalidateQueries({ queryKey: ["deals-of-the-day-products"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
            queryClient.invalidateQueries({ queryKey: ["products-by-brand"] });
            queryClient.invalidateQueries({ queryKey: ["search-products"] });
            queryClient.invalidateQueries({ queryKey: ["best-selling-products"] });
            queryClient.invalidateQueries({ queryKey: ["new-arrival-products"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
        onError: (error: any, productId, context: any) => {
            // Rollback optimistic updates on error
            if (context?.previousData) {
                context.previousData.forEach((value: any, key: string) => {
                    const queryKey = JSON.parse(key);
                    queryClient.setQueryData(queryKey, value);
                });
            }

            if (error?.response?.status === 401) {
                toast.error("Please login to add to favorites");
                router.push(`/${lang}/login`);
                return;
            }
            toast.error(error.response?.data?.message || "Failed to update favorites");
        },
    });
}

export function useUserAllFavorites(params?: { page?: number; limit?: number; pagination_type?: "offset" | "cursor" }) {
    const { isAuthenticated } = useUserStore();
    const routeParams = useParams();
    const lang = routeParams?.lang || 'en';
    return useQuery<UserAllFavoritesResponse, Error>({
        queryKey: ["user-all-favorites", params?.page, params?.limit, params?.pagination_type, lang],
        queryFn: () => getUserAllFavorites(params),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: isAuthenticated,
    });
}


/////////////////////////////////////////////////////
// ORDERS
/////////////////////////////////////////////////////

export function useUserAllOrders() {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<Order[], Error>({
        queryKey: ["user-orders", lang],
        queryFn: getUserOrders,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 5,
        enabled: isAuthenticated,
    });
}

export function useUserCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation<UserCancelOrderResponse, Error, string | number>({
        mutationFn: (id: string | number) => getUserCancelOrder(id),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["user-orders"] });
            toast.success(data?.message || "Order cancelled successfully!");
        },
        onError: (error: any) => {
            const serverData = error.response?.data;
            const validationErrors = serverData?.errors || serverData?.data;
            
            if (validationErrors && typeof validationErrors === 'object') {
                const firstError = Object.values(validationErrors).flat()[0];
                toast.error(String(firstError) || serverData?.message || "Failed to cancel order");
            } else {
                toast.error(serverData?.message || "Failed to cancel order");
            }
        },
    });
}


/////////////////////////////////////////////////////
// RETURNS
/////////////////////////////////////////////////////
export function useUserAllReturns() {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<Return[], Error>({
        queryKey: ["user-returns", lang],
        queryFn: getUserReturns,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 5,
        enabled: isAuthenticated,
    });
}

// /////////////////////////////////////////////////////
// // RETURN ORDER
// /////////////////////////////////////////////////////
export function useUserReturnOrder(id: string | number | undefined) {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<UserReturnOrder, Error>({
        queryKey: ["user-return-order", id, lang],
        queryFn: () => getUserReturnOrder(id as string | number),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: isAuthenticated && !!id,
    });
}

////////////////////////////////////////////////////////////////
// USER RETURN REASONS (RADIO BUTTON GROUP) 
////////////////////////////////////////////////////////////////
export function useUserReturnReasons() {
    const { isAuthenticated } = useUserStore();
    const params = useParams();
    const lang = params?.lang || 'en';
    return useQuery<UserReturnReason[], Error>({
        queryKey: ["user-return-reasons", lang],
        queryFn: getUserReturnReasons,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: isAuthenticated,
    });
}

export function useCreateReturn() {
    const queryClient = useQueryClient();

    return useMutation<CreateReturnResponse, Error, CreateReturnPayload>({
        mutationFn: (body: CreateReturnPayload) => createReturn(body),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user-returns"] });
            queryClient.invalidateQueries({ queryKey: ["user-orders"] });
            toast.success(data.message || "Return request submitted successfully!");
        },
        onError: (error: any) => {
            const serverData = error.response?.data;
            const serverMessage = serverData?.message;
            const validationErrors = serverData?.errors || serverData?.data;

            if (validationErrors && typeof validationErrors === 'object') {
                const firstError = Object.values(validationErrors).flat()[0];
                toast.error(String(firstError) || serverMessage || "Validation failed");
            } else {
                toast.error(serverMessage || "Failed to submit return request");
            }
        },
    });
}
