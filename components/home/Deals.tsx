"use client"; import { useAppRouter } from '@/hooks/useAppRouter';

import TopHeader from "../layout/TopHeader";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { CountDownTimer } from "../settings/CountDownTimer";
import { getDealsOfTheDayProductsQuery } from "@/hooks/queries/useHomeQueries";
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import { useState } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useAddToCartQuery, useCartPrefetch } from "@/hooks/queries/useCartQueries";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "../ui/dialog";
import { useToggleUserFavorites } from "@/hooks/queries/useUserQueries";
import { Product } from "@/utils/types/home";
import { Heart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { LoginRequiredDialog } from "../common/LoginRequiredDialog";
import {
    CheckmarkCircle02Icon,
    FavouriteIcon,
    StarIcon,
} from "@hugeicons/core-free-icons";

import { useDictionary } from "../providers/DictionaryProvider";
import { useProductPrefetch } from "@/hooks/queries/useProductQueries";
import { Skeleton } from '../ui/skeleton';

export default function DealsCard() {
    const { startLoading, stopLoading } = useLoadingStore();
    const { home, product: productDict } = useDictionary();
    const t = home?.topHeaders;
    const tProd = productDict;
    const { data: dealsData, isLoading, error } = getDealsOfTheDayProductsQuery({ limit: 4 });
    const products = dealsData?.items ?? [];
    const params = useParams();
    const router = useAppRouter();
    const lang = params.lang as string;

    const { mutate: toggleFavorite } = useToggleUserFavorites();
    const { mutate: addToCart } = useAddToCartQuery();
    const prefetchProduct = useProductPrefetch();
    const prefetchCart = useCartPrefetch();

    const [pendingProductId, setPendingProductId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);

    const { isAuthenticated } = useUserStore();
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleToggleFavorite = (
        e: React.MouseEvent,
        product: Product
    ) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }
        toggleFavorite(product.id);
    };

    if (isLoading) return <Skeleton className="h-[400px] w-full" />
    if (products.length === 0) return null

    return (
        <section id="daily-deals" className="xl:container mx-auto px-5 py-7 scroll-mt-28 mt-10">
            <TopHeader title={t?.dealsOfTheDay} link={`/${lang}/deals-of-deals`} />
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className="bg-red-300 flex gap-3 flex-col h-full ease-in duration-300 transition-all group border border-[#e6e6e6]"
                        onMouseEnter={() => {
                            const timer = setTimeout(() => {
                                prefetchProduct(product.slug);
                            }, 50);
                            (window as any)[`prefetch_deal_${product.id}`] = timer;
                        }}
                        onMouseLeave={() => {
                            if ((window as any)[`prefetch_deal_${product.id}`]) {
                                clearTimeout((window as any)[`prefetch_deal_${product.id}`]);
                            }
                        }}
                    >
                        {/* IMAGE + BADGES */}
                        <div className="relative">
                            {product.discount_percentage && product.discount_percentage > 0 && (
                                <span className="absolute top-2 left-2 z-10 bg-primary text-background px-4 py-1 rounded-2xl text-sm font-medium">
                                    {tProd?.card?.off?.replace("{percentage}", Math.round(product.discount_percentage).toString())}
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                className={`absolute top-2 right-5 z-10 px-4 border-none transition-all duration-300 ${!!product.is_favorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    }`}
                                onClick={(e) => handleToggleFavorite(e, product)}
                            >
                                <HugeiconsIcon
                                    icon={FavouriteIcon}
                                    size={24}
                                    color={!!product.is_favorite ? "#dc2626" : "#000000"}
                                    fill={!!product.is_favorite ? "#dc2626" : "transparent"}
                                    strokeWidth={1.5}
                                />
                            </Button>
                            <AppLink
                                href={`/${lang}/product/${product.slug}`}
                                className="block"
                            >
                                <Image
                                    src={
                                        product.images?.original ||
                                        "/placeholder.png"
                                    }
                                    alt={product.name}
                                    width={300}
                                    height={220}
                                    className="w-full h-[200px] object-cover rounded-t-xl"
                                />
                            </AppLink>
                        </div>

                        {/* CONTENT */}
                        <CardContent className="px-2 flex flex-col gap-2 flex-1">
                            <CardTitle className="text-lg font-semibold line-clamp-1">
                                {product.name}
                            </CardTitle>

                            {/* Price */}
                            <CardDescription className="flex items-center gap-3">
                                {product.deal_price ? (
                                    <>
                                        <span className="text-lg font-semibold text-primary">
                                            {product.deal_price} {tProd?.currency}
                                        </span>
                                        <span className="line-through text-sm text-muted-foreground">
                                            {product.price ||
                                                product.price}{" "}
                                            {tProd?.currency}
                                        </span>
                                    </>
                                ) : product.sale_price ? (
                                    <>
                                        <span className="text-lg font-semibold">
                                            {product.sale_price} {tProd?.currency}
                                        </span>
                                        <span className="line-through text-sm text-muted-foreground">
                                            {product.price} {tProd?.currency}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-semibold">
                                        {product.price} {tProd?.currency}
                                    </span>
                                )}

                            </CardDescription>
                            <p className='text-neutral-500 text-md mb-1'>    {tProd?.stock?.onlyLeft.replace("{count}", (product?.stock ?? 0).toString())}</p>


                            {/* Rating */}
                            <div className="min-h-[28px]">
                                {Number(product.reviews_count) > 0 && (
                                    <div className="flex items-center gap-1">
                                        <HugeiconsIcon
                                            icon={StarIcon}
                                            size={24}
                                            color="#FFB833"
                                            fill="#FFB833"
                                            strokeWidth={1.5}
                                        />
                                        <span className="font-semibold">
                                            {Number(product.avg_rating).toFixed(1)}
                                        </span>
                                        <span className="text-[#999999] text-sm">
                                            {tProd?.card?.reviews?.replace("{count}", product.reviews_count?.toString() || "0")}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Countdown */}
                            <div className="bg-muted p-2 rounded-xl">
                                <CountDownTimer
                                    timer={product.deal_info}
                                />
                            </div>
                        </CardContent>

                        {/* ADD TO CART */}
                        <CardFooter className="px-2 ">
                            <Button
                                className="w-full rounded-3xl"
                                disabled={!product.in_stock}
                                loading={pendingProductId === product.id}
                                onClick={() => {
                                    startLoading();
                                    setPendingProductId(product.id);
                                    addToCart(
                                        {
                                            product_id: product.id,
                                            quantity: 1,
                                        },
                                        {
                                            onSuccess: () => {
                                                stopLoading();
                                                toast.success(
                                                    `${product.name} ${tProd?.card?.addedToCart}`
                                                );
                                                setSelectedProduct(product);
                                                setShowAddToCartDialog(true);
                                                setPendingProductId(null);
                                            },
                                            onError: () => {
                                                stopLoading();
                                                toast.error(
                                                    `${product.name} ${tProd?.stock?.outOfStock}`
                                                );
                                                setPendingProductId(null);
                                            },
                                        }
                                    );
                                }}
                            >
                                {tProd?.card?.addToCart}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>

            {/* ADD TO CART DIALOG */}
            <Dialog
                open={showAddToCartDialog}
                onOpenChange={setShowAddToCartDialog}
            >
                <DialogContent className="sm:max-w-xl">
                    <div className="flex flex-col sm:flex-row justify-start items-start gap-4 mt-5 md:mt-0!">
                        <div className="relative">
                            <Image
                                src={
                                    selectedProduct?.images?.original || "/placeholder.png"
                                }
                                alt={selectedProduct?.name || "Product"}
                                width={100}
                                height={100}
                                className="object-full p-1 object-center h-[100px] w-[130px] rounded-2xl border border-gray-200"
                            />
                            <div className="absolute -top-2 -right-2">
                                <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    size={24}
                                    color="#3A923B"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="text-md md:text-lg">
                                {tProd?.card?.addedToCart}
                            </DialogTitle>
                            <DialogDescription className="text-md">
                                <span className="text-[#0D0D0D] whitespace-normal">
                                    {selectedProduct?.name}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3 mt-1">
                        <Button
                            className="text-md rounded-3xl w-full sm:w-[50%]"
                            onClick={() =>
                                setShowAddToCartDialog(false)
                            }
                        >
                            {tProd?.card?.continueShopping}
                        </Button>
                        <Button
                            variant="outline"
                            className="text-md rounded-3xl w-full sm:w-[50%]"
                            onClick={() => {
                                setShowAddToCartDialog(false);
                                startLoading();
                                router.push(`/${lang}/cart`);
                            }}
                            onMouseEnter={prefetchCart}
                        >
                            {tProd?.card?.viewCart}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <LoginRequiredDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                message={tProd?.card?.loginToFav}
            />
        </section>
    );
}
