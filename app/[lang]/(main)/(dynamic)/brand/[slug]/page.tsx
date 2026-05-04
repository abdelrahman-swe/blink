"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

import CategoryPagination from "@/components/common/CategoryPagination";
import CategoryFiltersWrapper from "@/components/common/CategoryFiltersWrapper";
import ProductCard from "@/components/common/ProductCard";
import ProductsError from "@/components/common/ProductsError";
import { FiltersSkeleton } from "@/components/skeleton/FiltersSkeleton";
import { ProductsSkeleton } from "@/components/skeleton/ProductsSkeleton";
import { Separator } from "@/components/ui/separator";
import ProductSorting from "@/components/common/ProductSorting";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import {
  getBrandCategoriesQuery,
  getBrandProductsQuery,
} from "@/hooks/queries/useBrandQueries";
import { useProductFilters } from "@/hooks/useProductFilters";
import { EmptyBrand } from "../components/EmptyBrand";
import { notFound } from "next/navigation";


export default function BrandPage() {
  const {
    range,
    setRange,
    availability,
    setAvailability,
    selectedBrands,
    selectedCategories,
    sort,
    currentPage,
    handlePageChange,
    handleSortChange,
    handleApplyFilters,
    resetAllFilters,
  } = useProductFilters();

  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params.slug as string;
  const { home } = useDictionary();

  const navigationKey = useRef(0);
  const lastSlugRef = useRef<string>(slug);

  /* ------------------- BRAND CATEGORIES ------------------- */
  const { data: brandCategories, isLoading: isCategoriesLoading } =
    getBrandCategoriesQuery(slug, {
      enabled: !!slug,
    });

  /* ------------------- BRAND PRODUCTS ------------------- */
  const {
    data: brandData,
    isLoading,
    error,
  } = getBrandProductsQuery(slug, {
    limit: 9,
    page: currentPage,
    pagination_type: "offset",
    availability,
    categories: selectedCategories.length ? selectedCategories : undefined,
    min_price: range[0],
    max_price: range[1],
    sort,
    enabled: !!slug,
  });

  /* ------------------- RESET FILTERS ON BRAND CHANGE ------------------- */
  useEffect(() => {
    navigationKey.current += 1;

    if (!slug) return;

    if (slug !== lastSlugRef.current) {
      resetAllFilters();
      lastSlugRef.current = slug;
    }
  }, [slug, searchParams, resetAllFilters]);

  /* ------------------- DERIVED DATA ------------------- */
  const categories =
    brandCategories?.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    })) ?? [];

  const products = brandData?.products ?? [];
  const productsCount = brandData?.pagination?.product_count ?? 0;
  const hasMore = brandData?.pagination?.has_more ?? false;
  const brandName = brandData?.brand_name;

  if (!isLoading && !brandData) {
    if (error) {
      if ((error as any).response?.status === 404) {
        notFound();
      }
    } else {
      notFound();
    }
  }
  return (
    <main className="xl:container mx-auto px-5 py-4 my-5">
      <section className="grid grid-cols-12 gap-5">
        {/* ================= LEFT: FILTERS (DRAWER ON MOBILE/TABLET, INLINE ON LARGE) ================= */}
        <aside className="col-span-12 lg:col-span-4">
          {isCategoriesLoading ? (
            <FiltersSkeleton />
          ) : (
            <CategoryFiltersWrapper
              isBrandsLoading={false}
              isCategoriesLoading={isCategoriesLoading}
              categories={categories}
              products={products}
              topBrands={brandName ? [{ name: brandName, slug: slug } as any] : []}
              range={range}
              onRangeChange={setRange}
              onAvailabilityChange={setAvailability}
              fetchFilteredProducts={handleApplyFilters}
              selectedBrands={selectedBrands.length > 0 ? selectedBrands : brandName ? [brandName] : []}
              selectedCategories={selectedCategories}
              availability={availability}
            />
          )}
        </aside>

        {/* ================= RIGHT: PRODUCTS (9 COLS) ================= */}
        <section className="col-span-12 lg:col-span-8 border border-gray-200 bg-[#F5F5F5] rounded-lg p-5 lg:p-8">
          {/* -------- Header -------- */}
          {!isLoading && products.length > 0 && (
            <>
              <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <h2 className="text-lg md:text-xl font-medium line-clamp-2">
                    {brandName}
                  </h2>
                  <span className="text-[#4D4D4D] text-sm mt-1">
                    {Number(productsCount) === 1 ? home?.filteration?.productCount?.replace("{count}", "1") : home?.filteration?.productsCount?.replace("{count}", productsCount.toString())}
                  </span>
                </div>

                <ProductSorting sort={sort} onSortChange={handleSortChange} />
              </div>

              <Separator className="mt-5 mb-8" />
            </>
          )}

          {/* -------- Content States -------- */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : error ? (
            <ProductsError error={error} />
          ) : products.length > 0 ? (
            <ProductCard products={products} />
          ) : (
            <EmptyBrand />
          )}

          {/* -------- Pagination -------- */}
          {!isLoading && products.length > 0 && (
            <CategoryPagination
              currentPage={currentPage}
              hasMore={hasMore}
              onPageChange={handlePageChange}
              totalPages={brandData?.pagination?.total_pages}
              productCount={productsCount}
              limit={9}
            />
          )}
        </section>
      </section>
    </main>
  );
}
