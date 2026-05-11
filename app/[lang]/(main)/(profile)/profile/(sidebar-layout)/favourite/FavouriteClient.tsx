"use client";
import CategoryPagination from "@/components/common/CategoryPagination";
import ProductCard from "@/components/common/ProductCard";
import ProductsError from "@/components/common/ProductsError";
import ProductsLoading from "@/components/loading/ProductsLoading";
import { Button } from "@/components/ui/button";
import { useUserAllFavorites } from "@/hooks/queries/useUserQueries";
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { useProductFilters } from "@/hooks/useProductFilters";
import { useDictionary } from "@/components/providers/DictionaryProvider";

const FavouriteClient = () => {
    const { user: userDict } = useDictionary();
    const t = userDict?.profile?.wishlist;

    const { currentPage, handlePageChange } = useProductFilters();
    const limit = 9;

    const { data: favoriteData, isPending, error } = useUserAllFavorites({
        page: currentPage,
        limit,
        pagination_type: "offset"
    });

    const products = favoriteData?.products ?? [];
    const pagination = favoriteData?.pagination;
    const productsCount = pagination?.product_count ?? 0;
    const hasMore = pagination?.has_more ?? false;

    return (
        <>
            <section className="bg-background xl:container mx-auto p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-5">
                    {t?.title}
                    <span className="text-[#4D4D4D] font-normal text-sm ms-2">
                        {productsCount === 1 ? t?.productCount?.replace("{count}", "1") : t?.productsCount?.replace("{count}", productsCount.toString())}
                    </span>
                </h3>

                {isPending ? (
                    <ProductsLoading lgCols={3} />
                ) : error ? (
                    <ProductsError error={error} />
                ) : products.length > 0 ? (
                    <>
                        <ProductCard columns={3} products={products} />
                        <CategoryPagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            totalPages={pagination?.total_pages}
                            productCount={productsCount}
                            limit={limit}
                            hasMore={hasMore}
                            className="mt-10"
                        />
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center gap-4 py-5">
                        <Image src="/favourite.svg" alt="empty-wishlist" width={100} height={100} />
                        <div className="flex flex-col justify-center items-center gap-2">
                            <h3 className="font-semibold text-lg">
                                {t?.emptyTitle}
                            </h3>
                            <p className="text-[#333333] max-w-md text-center text-sm">
                                {t?.emptyDesc}
                            </p>
                            <Button className="w-fit rounded-3xl px-6 py-2 mt-2" asChild>
                                <AppLink href="/home">
                                    {t?.continueShopping}
                                </AppLink>
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default FavouriteClient;
