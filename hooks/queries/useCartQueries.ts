import {
  getCartProduct,
  addToCart,
  removeFromCart,
  AddToCartBody,
  RemoveFromCartBody,
  CartResponse,
  changeCartQuantity,
} from "@/utils/services/cart";
import { ProductDetails } from "@/utils/types/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function UseGetCartProductQuery(options: { enabled?: boolean } = {}) {
  return useQuery<ProductDetails[], Error>({
    queryKey: ["cart"],
    queryFn: () => getCartProduct(),
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false,
    enabled: options.enabled !== false,
    staleTime: 30_000, // Data fresh for 30 seconds
    refetchOnMount: "always", // Always fetch on mount (or use true)
    refetchOnWindowFocus: false,
  });
}

export function useCartPrefetch() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: () => getCartProduct(),
      staleTime: 30_000,
    });
  };
}

export function useAddToCartQuery() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, AddToCartBody>({
    mutationFn: (body: AddToCartBody) => addToCart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useChangeCartQuantityQuery() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, AddToCartBody>({
    mutationFn: (body: AddToCartBody) => changeCartQuantity(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCartQuery() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, RemoveFromCartBody>({
    mutationFn: (body: RemoveFromCartBody) => removeFromCart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
