"use client";

import { addProductReview, deleteProductReview, EditProductReview, getProductDetails, getProductReviews, toggleProductReviewHelpful } from "@/utils/services/product";
import { AddReviewResponse, DeleteReviewResponse, EditReviewResponse, ProductDetails, ProductReviewsResponse, ToggleHelpfulReviewResponse } from "@/utils/types/product";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const useProductDetailsQuery = (
  slug: string,
  options: { enabled?: boolean } = {}
) => {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return useQuery<ProductDetails | null, Error>({
    queryKey: ["product", slug, lang],
    queryFn: () => getProductDetails(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 2,
    retry: false,
    enabled: options.enabled !== false,
  });
};

export const useProductPrefetch = () => {
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";

    return (slug: string) => {
        queryClient.prefetchQuery({
            queryKey: ["product", slug, lang],
            queryFn: () => getProductDetails(slug),
            staleTime: 10 * 60 * 1000,
            gcTime: 15 * 60 * 1000,
        });
    };
};

////////////////////////////////////////////////////////////////////////

export const useProductDetailsReviewsQuery = (
  slug: string,
  limit: number = 5,
  options: { enabled?: boolean } = {}
) => {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return useInfiniteQuery<ProductReviewsResponse["data"] | null, Error>({
    queryKey: ["product-reviews", slug, { lang, limit }],
    queryFn: ({ pageParam }) => getProductReviews(slug, pageParam as string | null, limit),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.pagination.next_cursor || undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 5,
    retry: 1,
    enabled: options.enabled !== false,
  });
};

////////////////////////////////////////////////////////////////////////



export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AddReviewResponse, Error, { product_slug: string, rating: number, body: string }>({
    mutationFn: (data) => addProductReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", variables.product_slug] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.product_slug] });
    },
  });
};


////////////////////////////////////////////////////////////////////////


export const useEditReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EditReviewResponse, Error, { id: string, product_slug: string, rating: number, body: string }>({
    mutationFn: ({ id, rating, body }) => EditProductReview(id, { rating, body }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", variables.product_slug] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.product_slug] });
    },
  });
};

////////////////////////////////////////////////////////////////////////


export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReviewResponse, Error, { id: string, product_slug: string }>({
    mutationFn: ({ id }) => deleteProductReview(id),
    onSuccess: (_, { product_slug }) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", product_slug] });
      queryClient.invalidateQueries({ queryKey: ["product", product_slug] });
    },
  });
};


////////////////////////////////////////////////////////////////////////


export const toggleHelpfulReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleHelpfulReviewResponse, Error, { id: string, product_slug: string, guest_id?: string }>({
    mutationFn: ({ id, guest_id }) => toggleProductReviewHelpful(id, guest_id),
    onSuccess: (response, { product_slug, id }) => {
      queryClient.setQueriesData<InfiniteData<ProductReviewsResponse["data"] | null>>(
        { queryKey: ["product-reviews", product_slug] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (!page) return page;
              return {
                ...page,
                items: page.items.map((review) =>
                  review.id.toString() === id
                    ? { ...review, helpful_count: response.data.helpful_count, is_helpful: response.data.is_helpful }
                    : review
                ),
              };
            }),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["product-reviews", product_slug] });
      queryClient.invalidateQueries({ queryKey: ["product", product_slug] });
    },
  });
};


