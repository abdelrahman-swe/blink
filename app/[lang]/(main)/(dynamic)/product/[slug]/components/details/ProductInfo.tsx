"use client";import { useAppRouter } from '@/hooks/useAppRouter';


import { useState } from "react";
import AppLink from '@/components/common/AppLink';

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AnimatedButton from "@/components/ui/AnimatedButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { QuantityInput } from "@/components/settings/QuantityInput";
import { useAddToCartQuery, useCartPrefetch } from "@/hooks/queries/useCartQueries";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { StarIcon, CheckmarkCircle02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProductDetails } from "@/utils/types/product";
import { useToggleUserFavorites } from "@/hooks/queries/useUserQueries";

import { useUserStore } from "@/store/useUserStore";
import { Heart } from "lucide-react";
import { LoginRequiredDialog } from "@/components/common/LoginRequiredDialog";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";

interface ProductInfoProps {
  product?: ProductDetails | null;
  isLoading: boolean;
  lang: string;
  onReviewClick?: () => void;
}

export const ProductInfo = ({ product, isLoading, lang, onReviewClick }: ProductInfoProps) => {
  const { product: productDict } = useDictionary();
  const { startLoading, stopLoading } = useLoadingStore();
  const t = productDict;
  const router = useAppRouter();
  const [quantity, setQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

  const { mutate: addToCart, isPending } = useAddToCartQuery();
  const { mutate: toggleFavorite } = useToggleUserFavorites();
  const prefetchCart = useCartPrefetch();

  const { isAuthenticated } = useUserStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    const id = product.id ?? product.product_id;
    if (id) {
      toggleFavorite(id);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    startLoading();
    addToCart(
      {
        product_id: product.id ?? product.product_id!,
        quantity,
      },
      {
        onSuccess: () => {
          stopLoading();
          setShowDialog(true);
        },
        onError: (error) => {
          stopLoading();
          toast.error(getApiErrorMessage(error, `${product.name} ${t?.stock?.outOfStock || "is out of stock"}`));
        },
      }
    );
  };

  const rating = Number(product?.avg_rating || 0);
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <div className="contents md:block col-span-12 md:col-span-6 md:px-4">
      {/* Brand */}
      <div className="order-1 md:order-0 flex justify-between items-center w-full mb-4 md:mb-0">
        {isLoading ? (
          <Skeleton className="w-32 h-4" />
        ) : (
          <AppLink
            href={`/${lang}/brand/${product?.brand?.slug ?? ""}`}
            className="text-sm font-semibold uppercase tracking-wide text-primary hover:underline"
          >
            {product?.brand?.name} {t?.details?.store}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="inline mx-2 rtl:rotate-180"
            />
          </AppLink>
        )}
        <div className="flex gap-8">
          {/* <Button size="icon-sm"
            variant="ghost"
            type="button" aria-label="Share" className=" rounded-full hover:bg-gray-100">
            <HugeiconsIcon icon={Share08Icon} size={25} color="#666" />
          </Button> */}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleToggleFavorite}
          >
            <Heart
              size={28}
              color={product?.is_favorite ? "#dc2626" : "#000000"}
              fill={product?.is_favorite ? "#dc2626" : "transparent"}
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>

      <div className="order-3 md:order-0 w-full">
      {/* Title */}
      <h1 className="text-xl font-medium mt-4 mb-3 wrap-break-word">
        {isLoading ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          product?.name
        )}
      </h1>

      {/* Rating */}
      {!isLoading && Number(product?.reviews_count) > 0 && (
        <div 
          className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onReviewClick}
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={StarIcon}
              size={24}
              color="#FFB833"
              fill="#FFB833"
              strokeWidth={1.5}
            />
            <span className="font-semibold">
              {rating.toFixed(1)}
            </span>
            <span className="text-[#999999] text-sm hover:underline hover:text-primary">
              {t?.card?.reviews?.replace("{count}", (product?.reviews_count ?? 0).toString()) || `(${product?.reviews_count ?? 0} Reviews)`}
            </span>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
      )}
      {/* Price */}
      <div className="flex gap-4 items-center text-xl font-semibold my-4">
        {isLoading ? (
          <Skeleton className="w-28 h-5" />
        ) : product?.deal_price ? (
          <>
            <span className="text-xl font-bold text-primary">{product.deal_price} {t?.currency}</span>
            <span className="line-through text-lg font-normal text-[#999999]">
              {product.price} {t?.currency}
            </span>
          </>
        ) : product?.sale_price ? (
          <>
            <span className="text-xl font-bold text-primary">{product.sale_price} {t?.currency}</span>
            <span className="line-through text-lg font-normal text-[#999999]">
              {product.price} {t?.currency}
            </span>
          </>
        ) : (
          <span className="text-xl font-bold text-[#0D0D0D]">{product?.price} {t?.currency}</span>
        )}
      </div>

      {/* Quantity */}
      <div className="flex justify-between items-center mt-6">
        <QuantityInput
          min={1}
          max={product?.stock ?? 1}
          value={quantity}
          onChange={setQuantity}
        />

        {isLoading ? (
          <Skeleton className="w-28 h-4" />
        ) : inStock ? (
          <span className="text-gray-500">
            {t?.stock?.onlyLeft?.replace("{count}", (product?.stock ?? 0).toString()) || `Only ${product?.stock} left`}
          </span>
        ) : (
          <span className="text-gray-500">{t?.stock?.outOfStock}</span>
        )}
      </div>

      {/* Actions */}
      <div className="w-50 flex flex-col sm:flex-row gap-4 mt-6">
        <AnimatedButton
          onClick={handleAddToCart}
          disabled={!inStock || isPending}
          className="flex-1 rounded-full h-11"
        >
          {isPending ? (t?.card?.adding) : (t?.card?.addToCart)}
        </AnimatedButton>

        {/* <Button disabled className="flex-1 rounded-full h-11">
          {t?.details?.buyItNow}
        </Button> */}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col sm:flex-row justify-start items-start gap-4 mt-5 md:mt-0!">
              <div className="relative">
                <Image
                    src={product?.images?.[0]?.original || '/placeholder.png'}
                    alt={product?.name || "Product"}
                    width={100}
                    height={100}
                    className="object-full p-1 object-center h-[100px] w-[130px] rounded-2xl border border-gray-200"
                />
                <div className="absolute top-[-6px] right-[-12px] rtl:right-auto rtl:left-[-12px]">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={24}
                    color="#3A923B"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

            <div className="space-y-2">
              <DialogTitle className="font-medium text-xl">{t?.card?.addedToCart}</DialogTitle>
              <DialogDescription className="text-md">
                <span className="text-[#0D0D0D] max-w-lg whitespace-normal">
                  {product?.name}
                </span>
              </DialogDescription>
            </div>
          </div>


          <DialogFooter className="mx-auto text-center space-x-1 mt-1 px-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="text-md rounded-3xl w-full sm:w-[50%]"
              aria-label="continue shopping dialog cart"

            >
              {t?.card?.continueShopping}
            </Button>
            <Button
              onClick={() => {
                setShowDialog(false);
                startLoading();
                router.push(`/${lang}/cart`);
              }}
              onMouseEnter={prefetchCart}
              className="text-md rounded-3xl w-full sm:w-[50%]"
              aria-label="view cart dialog cart"
            >
              {t?.card?.viewCart}
            </Button>


          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        message={t?.card?.loginToFav}
      />
      </div>
    </div>
  );
};
