"use client";
import { useState } from 'react';
import { getBestSellingProductsQuery } from '@/hooks/queries/useHomeQueries';
import ProductCard from '@/components/common/ProductCard';
import { ProductsSkeleton } from '@/components/skeleton/ProductsSkeleton';
import ProductsError from '@/components/common/ProductsError';
import CategoryPagination from '@/components/common/CategoryPagination';
import type { Product } from '@/utils/types/categories';
import { useDictionary } from '@/components/providers/DictionaryProvider';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import AppLink from '@/components/common/AppLink';
import { EmptyProduct } from '../../(dynamic)/category/components/EmptyProduct';

const BestSellingPage = () => {
    const { home } = useDictionary();
    const t = home;
    const [currentPage, setCurrentPage] = useState(1);

    const { data: bestSellingData, isLoading, error } = getBestSellingProductsQuery({
        limit: 12,
        page: currentPage,
        pagination_type: "offset"
    });

    const products = (bestSellingData?.items ?? []) as unknown as Product[];
    const productsCount = bestSellingData?.pagination?.product_count ?? 0;
    const hasMore = bestSellingData?.pagination?.has_more ?? false;
    const totalPages = bestSellingData?.pagination?.total_pages ?? 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of section when page changes
        document.getElementById('best-selling')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="best-selling" className="xl:container mx-auto px-5 py-6 scroll-mt-28">
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
                        <BreadcrumbPage>{t?.breadcrumb?.bestSellingProducts}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h2 className="text-lg md:text-2xl font-semibold my-6">
                {t?.topHeaders?.bestSellingProducts}
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
                <ProductCard columns={4} products={products} />
            ) : (
                <EmptyProduct />
            )}

            {/* -------- Pagination -------- */}
            {!isLoading && products.length > 0 && (
                <CategoryPagination
                    currentPage={currentPage}
                    hasMore={hasMore}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                    productCount={productsCount}
                    limit={10}
                />
            )}
        </section>
    )
}

export default BestSellingPage;