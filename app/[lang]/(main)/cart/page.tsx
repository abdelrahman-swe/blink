"use client";
import { useAppRouter } from '@/hooks/useAppRouter';

import AppLink from '@/components/common/AppLink';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { UseGetCartProductQuery, useChangeCartQuantityQuery, useRemoveFromCartQuery } from "@/hooks/queries/useCartQueries"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/utils/getApiErrorMessage"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { CartProductSkeleton, CartSummarySkeleton } from "@/components/skeleton/CartSkeleton"
import { PaymentSummary } from "@/components/common/PaymentSummary"
import { CartProducts } from "@/app/[lang]/(main)/cart/components/CartProducts"
import { EmptyCart } from "@/app/[lang]/(main)/cart/components/EmptyCart"
import { useOrderSummary } from "@/hooks/useOrderSummary"
import { useDictionary } from "@/components/providers/DictionaryProvider"
import { CartRemoveAllDialog } from "@/app/[lang]/(main)/cart/components/CartRemoveAllDialog"
import { useLoadingStore } from "@/store/useLoadingStore"
import { mergeCartItems } from "@/utils/mergeCartItems"


export default function Cart() {

    // In page.tsx
    const {
        data: items = [],
        isLoading,
        isFetching,
        isPending,
        error
    } = UseGetCartProductQuery()

    // Add this check
    const isInitialLoading = isLoading || (isFetching && items.length === 0);
    const params = useParams();
    const router = useAppRouter();
    const lang = params.lang as string;
    const { mutate: removeFromCart } = useRemoveFromCartQuery();
    const { mutate: changeCartQuantity } = useChangeCartQuantityQuery();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [isRemoving, setIsRemoving] = useState(false);
    const [removingProductId, setRemovingProductId] = useState<number | null>(null);
    const [updatingQuantityIds, setUpdatingQuantityIds] = useState<Set<number>>(new Set());
    const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
    const { startLoading } = useLoadingStore();
    const { cart } = useDictionary();
    const t = cart?.cart;

    // Merge items with the same product_id (deal + regular entries)
    const mergedItems = useMemo(() => mergeCartItems(items), [items]);

    useEffect(() => {
        if (mergedItems.length > 0) {
            setQuantities(prevQuantities => {
                const initialQuantities: Record<number, number> = {};
                mergedItems.forEach((merged) => {
                    initialQuantities[merged.product_id] = merged.totalQuantity;
                });
                return initialQuantities;
            });
        }
    }, [mergedItems]);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));

        setUpdatingQuantityIds(prev => new Set(prev).add(productId));

        changeCartQuantity(
            {
                product_id: productId,
                quantity: newQuantity,
            },
            {
                onSuccess: () => {
                    setUpdatingQuantityIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(productId);
                        return updated;
                    });
                    toast.success(`Cart updated with quantity: ${newQuantity}`);
                },
                onError: (error) => {
                    setUpdatingQuantityIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(productId);
                        return updated;
                    });
                    toast.error(getApiErrorMessage(error, "Failed to update cart quantity"));
                }
            }
        );
    };

    const handleRemoveProduct = (productId: number | undefined) => {
        if (!productId) {
            return;
        }

        const productName = mergedItems.find(item => item.product_id === productId)?.name || "Product";

        setRemovingProductId(productId);
        removeFromCart(
            { items: [{ product_id: productId, scope: "all" }] },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setQuantities(prev => {
                            const updated = { ...prev };
                            delete updated[productId];
                            return updated;
                        });
                        setRemovingProductId(null);
                        toast.success(`"${productName}" removed from cart`);
                    }, 300);
                },
                onError: () => {
                    setRemovingProductId(null);
                    toast.error("Failed to remove product from cart");
                }
            }
        );
    };


    const handleCheckout = () => {
        startLoading();
        // Navigate to checkout page
        router.push(`/${lang}/checkout`);
    };

    const orderSummary = useOrderSummary({
        items,
        quantities,
        shippingFee: 0,
    });

    return (
        <section className="xl:container mx-auto px-5 py-7">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <AppLink href="/">{t.breadcrumb.home}</AppLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        /
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t.breadcrumb.cart}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>


            <div className="space-y-3 mt-4 ">
                <h1 className="font-semibold text-xl md:text-2xl">{t.header.title}</h1>
                <p><span className="font-medium text-sm md:text-lg block md:hidden ">({mergedItems.length}) {t.header.subtitle} </span></p>
            </div>

            <div className="grid grid-cols-12 gap-5 my-5 overflow-hidden ">

                <div className={`col-span-12 ${mergedItems.length > 0 || isFetching ? 'lg:col-span-8' : ''} border border-gray-200 rounded-xl px-5 shadow-2xs h-fit max-h-[650px] overflow-y-auto relative custom-scrollbar`}>

                    {/* EMPTY CART BUTTON */}
                    {mergedItems.length > 0 && (
                        <div className="text-right sticky top-[-5px] z-10 bg-background -mx-5 px-5 pt-5">
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-2">
                                    <span className='font-semibold text-lg'>{t.header.all}</span>
                                    <span className="text-lg hidden md:block ">({mergedItems.length} {t.header.subtitle}) </span>
                                </p>
                                <Button
                                    variant={isRemoving ? "ghost" : "outline"}
                                    className="text-md w-fit px-4 rounded-lg font-medium shadow-2xs"
                                    disabled={isRemoving}
                                    aria-label="Remove all items from cart"
                                    onClick={() => {
                                        if (mergedItems.length > 0) {
                                            setShowAddToCartDialog(true);
                                        }
                                    }}
                                >
                                    {isRemoving ? (
                                        <p className="flex items-center gap-2 border border-red-600 py-2 px-5 rounded-xl">
                                            <Spinner color="red" />
                                            <span className="text-md font-medium text-red-600">{t.actions.removing}</span>
                                        </p>
                                    ) : (
                                        <span className="flex items-center gap-2 font-semibold text-md">
                                            {t.actions.emptyAll}
                                        </span>
                                    )}
                                </Button>
                            </div>

                            <Separator className="my-5" />
                        </div>
                    )}


                    {/* START OF CART PRODUCTS */}
                    {isInitialLoading ? (
                        <CartProductSkeleton />
                    ) : mergedItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        mergedItems.map((merged) => {
                            const isProductRemoving = removingProductId === merged.product_id;
                            return (
                                <CartProducts
                                    lang={lang}
                                    key={merged.product_id}
                                    mergedItem={merged}
                                    isUpdatingQuantity={updatingQuantityIds.has(merged.product_id)}
                                    quantity={quantities[merged.product_id] || merged.totalQuantity}
                                    isRemoving={isProductRemoving}
                                    onQuantityChange={(qty) => handleQuantityChange(merged.product_id, qty)}
                                    onRemove={() => {
                                        handleRemoveProduct(merged.product_id);
                                    }}
                                />
                            );
                        })
                    )}

                </div>

                {/* START OF CART SUMMARY PAYMENT */}
                {isLoading ? (
                    <CartSummarySkeleton />
                ) : mergedItems.length > 0 ? (
                    <div className="col-span-12 h-fit lg:col-span-4 border border-gray-100 rounded-xl p-7 shadow-xs">
                        <PaymentSummary
                            summary={orderSummary}
                            translations={t.summary}
                        />

                        <Button
                            onClick={handleCheckout}
                            className="w-full rounded-3xl mt-5 font-semibold text-md"
                            aria-label="Proceed to checkout"
                        >
                            {t.proceedToCheckout}
                        </Button>

                    </div>
                ) : null}
            </div>

            {/* START OF CART DIALOG FOR EMPTY CART PRODUCTS */}
            <CartRemoveAllDialog
                open={showAddToCartDialog}
                onOpenChange={(open) => {
                    setShowAddToCartDialog(open);
                    if (!open) {
                        setIsRemoving(false);
                    }
                }}
                isRemoving={isRemoving}
                onConfirm={() => {
                    const allProductIds = mergedItems.map(item => item.product_id).filter(Boolean);
                    if (allProductIds.length > 0) {
                        setIsRemoving(true);
                        removeFromCart(
                            { items: allProductIds.map(id => ({ product_id: id, scope: "all" })) },
                            {
                                onSuccess: () => {
                                    toast.success("All products removed from cart!");
                                    setQuantities({});
                                    setIsRemoving(false);
                                    setShowAddToCartDialog(false);
                                },
                                onError: () => {
                                    setIsRemoving(false);
                                    setShowAddToCartDialog(false);
                                }
                            }
                        );
                    }
                }}
            />
        </section >


    )
}
