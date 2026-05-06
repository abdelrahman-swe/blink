"use client"; import { useAppRouter } from '@/hooks/useAppRouter';

import { useState } from 'react';
import { getDealsOfTheDayProductsQuery } from '@/hooks/queries/useHomeQueries';
import { ProductsSkeleton } from '@/components/skeleton/ProductsSkeleton';
import ProductsError from '@/components/common/ProductsError';
import CategoryPagination from '@/components/common/CategoryPagination';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckmarkCircle02Icon, FavouriteIcon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { CountDownTimer } from '@/components/settings/CountDownTimer';
import AppLink from '@/components/common/AppLink';
import { useParams } from 'next/navigation';
import { useAddToCartQuery } from '@/hooks/queries/useCartQueries';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { useToggleUserFavorites } from '@/hooks/queries/useUserQueries';
import { Heart } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import type { DealProduct } from '@/utils/types/home';
import { useDictionary } from '@/components/providers/DictionaryProvider';
import { LoginRequiredDialog } from '@/components/common/LoginRequiredDialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { EmptyProduct } from '../../(dynamic)/category/components/EmptyProduct';

const DealsOfDealsPage = () => {
    const { home, product: productDict } = useDictionary();
    const t = home;
    const tProd = productDict;
    const [currentPage, setCurrentPage] = useState(1);
    const params = useParams();
    const router = useAppRouter();
    const lang = params.lang as string;
    const { isAuthenticated } = useUserStore();

    const { data: dealsData, isLoading, error } = getDealsOfTheDayProductsQuery({
        limit: 12,
        page: currentPage,
        pagination_type: "offset"
    });

    const { mutate: toggleFavorite } = useToggleUserFavorites();
    const { mutate: addToCart } = useAddToCartQuery();

    const [pendingProductId, setPendingProductId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<DealProduct | null>(null);
    const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const products = dealsData?.items ?? [];
    const productsCount = dealsData?.pagination?.product_count ?? 0;
    const hasMore = dealsData?.pagination?.has_more ?? false;
    const totalPages = dealsData?.pagination?.total_pages ?? 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById('deals-of-day')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleToggleFavorite = (e: React.MouseEvent, product: DealProduct) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }
        toggleFavorite(product.id);
    };

    return (
        <section id="deals-of-day" className="xl:container mx-auto px-5 py-6 scroll-mt-28">

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <AppLink href="/">{t?.breadcrumb?.home}</AppLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        /
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t?.breadcrumb?.dealsOfTheDay}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h2 className="text-lg md:text-2xl font-semibold my-6">
                {t?.topHeaders?.dealsOfTheDay}
                <span className="text-[#4D4D4D] text-sm mt-2 mx-2">
                    ({productsCount} {t?.topHeaders?.productsFound})
                </span>
            </h2>

            {/* -------- Content -------- */}
            {isLoading ? (
                <ProductsSkeleton />
            ) : error ? (
                <ProductsError error={error} />
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="flex gap-1 flex-col h-full ease-in duration-300 transition-all group border border-[#e6e6e6]"
                        >
                            {/* IMAGE + BADGES */}
                            <div className="relative mb-2">
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
                                        src={product.images?.original || "/placeholder.png"}
                                        alt={product.name}
                                        width={300}
                                        height={220}
                                        className="w-full h-[200px] object-cover rounded-t-2xl"
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
                                                {product.sale_price || product.price} {tProd?.currency}
                                            </span>
                                        </>
                                    ) : product.sale_price ? (
                                        <>
                                            <span className="line-through text-sm text-muted-foreground">
                                                {product.price} {tProd?.currency}
                                            </span>
                                            <span className="text-lg font-semibold">
                                                {product.sale_price} {tProd?.currency}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-semibold text-[#0D0D0D]">
                                            {product.price} {tProd?.currency}
                                        </span>
                                    )}
                                </CardDescription>

                                <p className='text-neutral-500 text-md mb-1'>Only {product.stock} left in stock</p>

                                {/* Rating */}
                                <div className="h-7">
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
                                {product.deal_info && (
                                    <div className="bg-muted p-2 rounded-xl">
                                        <CountDownTimer timer={product.deal_info} />
                                    </div>
                                )}
                            </CardContent>

                            {/* ADD TO CART */}
                            <CardFooter className="px-2 mt-2">
                                <Button
                                    className="w-full rounded-3xl"
                                    disabled={pendingProductId === product.id || !product.in_stock}
                                    onClick={() => {
                                        setPendingProductId(product.id);
                                        addToCart(
                                            {
                                                product_id: product.id,
                                                quantity: 1,
                                            },
                                            {
                                                onSuccess: () => {
                                                    setSelectedProduct(product);
                                                    setShowAddToCartDialog(true);
                                                    setPendingProductId(null);
                                                },
                                                onError: (error) => {
                                                    toast.error(getApiErrorMessage(error, `${product.name} ${tProd?.stock?.outOfStock}`));
                                                    setPendingProductId(null);
                                                },
                                            }
                                        );
                                    }}
                                >
                                    {pendingProductId === product.id ? tProd?.card?.adding : tProd?.card?.addToCart}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div >
            ) : (
                <EmptyProduct />
            )}

            {/* -------- Pagination -------- */}
            {
                !isLoading && products.length > 0 && (
                    <CategoryPagination
                        currentPage={currentPage}
                        hasMore={hasMore}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                        productCount={productsCount}
                        limit={9}
                    />
                )
            }

            {/* ADD TO CART DIALOG */}
            <Dialog open={showAddToCartDialog} onOpenChange={setShowAddToCartDialog}>
                <DialogContent className="sm:max-w-xl">
                    <div className="flex gap-5">
                        {selectedProduct?.images?.original && (
                            <div className="relative">
                                <Image
                                    src={selectedProduct.images.original}
                                    alt={selectedProduct.name}
                                    width={100}
                                    height={100}
                                    className="object-contain object-center w-[100px] h-[100px] rounded-2xl border border-gray-200"
                                />
                                <div className="absolute -top-2 -right-2">
                                    <HugeiconsIcon
                                        icon={CheckmarkCircle02Icon}
                                        size={24}
                                        color="#3A923B"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <DialogTitle className="text-xl">{tProd?.card?.addedToCart}</DialogTitle>
                            <DialogDescription className="mt-1 line-clamp-2">
                                {selectedProduct?.name}
                            </DialogDescription>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3 mt-4">
                        <Button
                            className="text-md rounded-3xl w-full sm:w-[50%]"
                            onClick={() => setShowAddToCartDialog(false)}
                        >
                            {tProd?.card?.continueShopping}
                        </Button>
                        <Button
                            variant="outline"
                            className="text-md rounded-3xl w-full sm:w-[50%]"
                            onClick={() => {
                                setShowAddToCartDialog(false);
                                router.push(`/${lang}/cart`);
                            }}
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
        </section >
    );
};

export default DealsOfDealsPage;