
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
import {
  getSearchProductsQuery,
  getSearchQuery,
} from "@/hooks/queries/useSearchQueries";
import { useProductFilters } from "@/hooks/useProductFilters";
import { EmptyProduct } from "./components/EmptyProduct";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function SearchResult() {
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
  const query = searchParams.get("query") ?? "";
  const lang = params.lang as string;
  const { home } = useDictionary();
  const navigationKey = useRef(0);
  const lastQueryRef = useRef<string>(query);

  /* ------------------- META SEARCH DATA ------------------- */
  const { data: searchMeta, isLoading: isMetaLoading } = getSearchQuery(query, {
    enabled: !!query,
  });

  /* ------------------- PRODUCTS DATA ------------------- */
  const {
    data: searchData,
    isLoading,
    error,
  } = getSearchProductsQuery(query, {
    limit: 9,
    page: currentPage,
    pagination_type: "offset",
    availability,
    brands: selectedBrands.length ? selectedBrands : undefined,
    categories: selectedCategories.length ? selectedCategories : undefined,
    min_price: range[0],
    max_price: range[1],
    sort,
    enabled: !!query,
  });

  /* ------------------- RESET FILTERS ON QUERY CHANGE ------------------- */
  useEffect(() => {
    navigationKey.current += 1;
    if (!query) return;
    if (query !== lastQueryRef.current) {
      resetAllFilters();
      lastQueryRef.current = query;
    }
  }, [query, searchParams, resetAllFilters]);

  /* ------------------- DERIVED DATA ------------------- */
  const categories = searchMeta?.categories ?? [];
  const topBrands = searchMeta?.brands ?? [];
  const products = searchData?.products ?? [];

  const productsCount =
    searchData?.pagination?.product_count ??
    searchMeta?.product_count ??
    0;

  const hasMore = searchData?.pagination?.has_more ?? false;

  return (
    <main className="xl:container mx-auto px-5 py-4 my-5">
      <section className="grid grid-cols-12 gap-5">
        {/* ================= LEFT: FILTERS (DRAWER ON MOBILE/TABLET, INLINE ON LARGE) ================= */}
        <aside className="col-span-12 lg:col-span-4">
          {isMetaLoading ? (
            <FiltersSkeleton />
          ) : (
            <CategoryFiltersWrapper
              isBrandsLoading={isMetaLoading}
              isCategoriesLoading={isMetaLoading}
              categories={categories}
              products={products}
              topBrands={topBrands}
              range={range}
              onRangeChange={setRange}
              onAvailabilityChange={setAvailability}
              fetchFilteredProducts={handleApplyFilters}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              availability={availability}
            />
          )}
        </aside>

        {/* ================= RIGHT: RESULTS (9 COLS) ================= */}
        <section className="col-span-12 lg:col-span-8 border border-gray-200 bg-[#F5F5F5] rounded-lg p-5 lg:p-8">
          {/* -------- Header -------- */}
          {!isLoading && products.length > 0 && (
            <>
              <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <h2 className="text-lg md:text-xl font-medium line-clamp-2">
                    "{query}"
                  </h2>
                  <span className="text-[#4D4D4D] text-sm mt-2">
                    {Number(productsCount) === 1 ? home?.filteration?.productCount?.replace("{count}", "1") : home?.filteration?.productsCount?.replace("{count}", productsCount.toString())}
                  </span>
                </div>

                <ProductSorting sort={sort} onSortChange={handleSortChange} />
              </div>

              <Separator className="mt-5 mb-8" />
            </>
          )}

          {/* -------- Content -------- */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : error ? (
            (error as any)?.response?.status === 404 || error.message === "Network Error" ? (
              <EmptyProduct />
            ) : (
            <ProductsError error={error} />
            )
          ) : products.length > 0 ? (
            <ProductCard products={products} />
          ) : (
            <EmptyProduct />
          )}

          {/* -------- Pagination -------- */}
          {!isLoading && products.length > 0 && (
            <CategoryPagination
              currentPage={currentPage}
              hasMore={hasMore}
              onPageChange={handlePageChange}
              totalPages={searchData?.pagination?.total_pages}
              productCount={productsCount}
              limit={9}
            />
          )}
        </section>
      </section>
    </main>
  );
}
