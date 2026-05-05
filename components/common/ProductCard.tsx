'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { CheckmarkCircle02Icon, FavouriteIcon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAddToCartQuery, useCartPrefetch } from '@/hooks/queries/useCartQueries';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useState, useTransition } from 'react';
import { useLoadingStore } from '@/store/useLoadingStore';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Product } from "@/utils/types/categories";
import { Heart } from 'lucide-react';
import { useToggleUserFavorites } from '@/hooks/queries/useUserQueries';
import { useUserStore } from '@/store/useUserStore';
import { LoginRequiredDialog } from './LoginRequiredDialog';
import { useDictionary } from '../providers/DictionaryProvider';
import { useProductPrefetch } from '@/hooks/queries/useProductQueries';

type ProductCardProps = {
    products: Product[];
    columns?: 3 | 4;
};

export default function ProductCard({ products, columns = 3 }: ProductCardProps) {
    const { product: productDict } = useDictionary();
    const t = productDict;
    const { isAuthenticated } = useUserStore();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [pendingProductId, setPendingProductId] = useState<number | null>(null);
    const { mutate: toggleFavorite } = useToggleUserFavorites();
    const prefetchProduct = useProductPrefetch();

    const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            setShowLoginDialog(true)
            return
        }
        toggleFavorite(product.id);
    };

    const params = useParams();
    const router = useAppRouter();
    const lang = params.lang as string;
    const { startLoading, stopLoading } = useLoadingStore();
    const { mutate: addToCart } = useAddToCartQuery();
    const prefetchCart = useCartPrefetch();

    const gridColsClass = columns === 4
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-6";

    return (
        <>
            <div className={gridColsClass}>
                {products.map((product: Product) => (
                    <Card
                        key={product.id}
                        className="flex flex-col gap-3 cursor-pointer shadow-2xs ease-in duration-300 transition-all group border border-[#e6e6e6]"
                        onMouseEnter={() => {
                            const timer = setTimeout(() => {
                                prefetchProduct(product.slug);
                            }, 50);
                            (window as any)[`prefetch_${product.id}`] = timer;
                        }}
                        onMouseLeave={() => {
                            if ((window as any)[`prefetch_${product.id}`]) {
                                clearTimeout((window as any)[`prefetch_${product.id}`]);
                            }
                        }}
                    >
                        <div className="relative w-full ">
                            <AppLink href={`/${lang}/product/${product.slug}`}
                                className="block no-underline "
                            >
                                <Image
                                    src={
                                        product?.image?.original || product?.images?.original ||
                                        "/placeholder.png"
                                    }
                                    alt={product.name}
                                    width={300}
                                    height={220}
                                    className="w-full h-[190px] object-cover rounded-t-xl"
                                />
                            </AppLink>

                            {product.discount_percentage && product.discount_percentage > 0 && (
                                <span className="absolute top-2 left-2 bg-primary text-background py-1 px-4 rounded-2xl text-sm font-medium">
                                    {t?.card?.off?.replace("{percentage}", Math.round(product.discount_percentage).toString()) || `${Math.round(product.discount_percentage)} % Off`}
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
                        </div>

                        <div className="bg-background px-2 dark:bg-transparent! flex flex-col flex-1 space-y-2">
                            <CardHeader className='gap-2 px-0'>
                                <h3 className="text-md font-semibold line-clamp-1">
                                    {product.name}
                                </h3>

                                <CardDescription className="flex gap-4 items-center text-md font-semibold">
                                    {product.deal_price ? (
                                        <>
                                            <span className="text-md font-semibold text-primary">{product.deal_price} {t?.currency}</span>
                                            <span className="line-through text-sm font-medium text-muted-foreground">{product.price} {t?.currency}</span>
                                        </>
                                    ) : product.sale_price ? (
                                        <>
                                            <span className="text-md font-semibold text-primary">{product.sale_price} {t?.currency}</span>
                                            <span className="line-through text-sm font-medium text-muted-foreground">{product.price} {t?.currency}</span>
                                        </>
                                    ) : (
                                        <span className="text-md font-semibold text-primary">{product.price} {t?.currency}</span>
                                    )}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex items-center justify-between px-0">
                                <div className="">
                                    {Number(product.reviews_count) > 0 && (
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon
                                                icon={StarIcon}
                                                size={20}
                                                color="#FFB833"
                                                fill="#FFB833"
                                                strokeWidth={1.2}
                                            />
                                            <span className="font-semibold text-sm">
                                                {Number(product.avg_rating).toFixed(1)}
                                            </span>
                                            <span className="text-neutral-500 text-sm">
                                                {t?.card?.reviews?.replace("{count}", (product.reviews_count ?? 0).toString()) || `(${product.reviews_count ?? 0} Reviews)`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {!product.in_stock && (
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {t?.stock?.outOfStock}
                                    </span>
                                )}
                            </CardContent>

                            <CardFooter className="mt-auto px-1">
                                <Button
                                    className="flex-1 rounded-3xl"
                                    disabled={!product || !product.in_stock}
                                    loading={pendingProductId === product.id}
                                    onClick={() => {
                                        if (!product) return;

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
                                                    setSelectedProduct(product);
                                                    setShowAddToCartDialog(true);
                                                    setPendingProductId(null);
                                                },
                                                onError: (error) => {
                                                    stopLoading();
                                                    toast.error(getApiErrorMessage(error, `(${product.name}) ${t?.stock?.outOfStock || "is out of stock"}`));
                                                    setPendingProductId(null);
                                                },
                                            }
                                        );
                                    }}
                                >
                                    {t?.card?.addToCart}
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={showAddToCartDialog} onOpenChange={setShowAddToCartDialog}>
                <DialogContent className="sm:max-w-xl space-y-2">
                    <div className="flex justify-start items-start gap-4 mt-5 md:mt-0!">

                        <div className="relative">
                            <Image
                                src={selectedProduct?.image?.original || selectedProduct?.images?.original || '/placeholder.png'}
                                alt="gallery image"
                                width={100}
                                height={100}
                                className="object-full p-1 object-center h-[100px] w-[130px] rounded-2xl border border-gray-200"
                            />

                            <div className="absolute top-[-6px] right-[-12px]">
                                <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    size={24}
                                    color="#3A923B"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <DialogTitle className="font-medium text-md md:text-lg">{t?.card?.addedToCart}</DialogTitle>
                            <DialogDescription className="text-md ">
                                <span className="text-[#0D0D0D] max-w-lg whitespace-normal">
                                    {selectedProduct?.name}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                    <DialogFooter className="mx-auto text-center space-x-1 px-3">
                        <Button
                            onClick={() => setShowAddToCartDialog(false)}
                            className="text-md rounded-3xl w-full sm:w-[50%]"
                        >
                            {t?.card?.continueShopping}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddToCartDialog(false);
                                router.push(`/${lang}/cart`);
                            }}
                            onMouseEnter={prefetchCart}
                            className="text-md rounded-3xl w-full sm:w-[50%]"
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
        </>
    );
}
