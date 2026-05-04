

"use client";
import React from "react";
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductSorting from "@/components/common/ProductSorting";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/utils/types/categories";
import CategoryPagination from "@/components/common/CategoryPagination";
import CategoryFiltersWrapper from "@/components/common/CategoryFiltersWrapper";
import ProductCard from "@/components/common/ProductCard";
import ProductsError from "@/components/common/ProductsError";
import { FiltersSkeleton } from "@/components/skeleton/FiltersSkeleton";
import { ProductsSkeleton } from "@/components/skeleton/ProductsSkeleton";
import {
  getCategoryQuery,
  getProductsQuery,
} from "@/hooks/queries/useCategoryQueries";
import { useProductFilters } from "@/hooks/useProductFilters";
import { notFound } from "next/navigation";
import { EmptyProduct } from "../components/EmptyProduct";
export default function CategoryPage() {
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
  } = useProductFilters();

  const params = useParams();
  const slug = params.slug as string;
  const lang = params.lang as string;
  const { home } = useDictionary();

  /* ------------------- CATEGORY DATA ------------------- */
  const { data: category, isLoading: isCategoryLoading } =
    getCategoryQuery(slug);

  /* ------------------- PRODUCTS DATA ------------------- */
  const {
    data: categoryData,
    isLoading,
    error,
  } = getProductsQuery(slug, {
    limit: 9,
    page: currentPage,
    pagination_type: "offset",
    availability,
    brands: selectedBrands.length ? selectedBrands : undefined,
    min_price: range[0],
    max_price: range[1],
    sort,
  });

  /* ------------------- DERIVED DATA ------------------- */
  const products = categoryData?.products ?? [];
  const productsCount = categoryData?.pagination?.product_count ?? 0;
  const hasMore = categoryData?.pagination?.has_more ?? false;

  const topBrands = category?.top_brands ?? [];
  const categoryName = category?.name || slug;
  const childCategories = category?.children ?? [];

  const fullPath = category?.full_path || "";
  const fullPathSlugs = category?.full_path_slugs || "";

  const pathNames = fullPath
    ? fullPath.split(" > ").map((p) => p.trim()).filter(Boolean)
    : [];

  const pathSlugs = fullPathSlugs
    ? fullPathSlugs.split(" > ").map((p) => p.trim()).filter(Boolean)
    : [];


  if (!isLoading && !categoryData) {
    if (error) {
      if ((error as any).response?.status === 404) {
        notFound();
      }
    } else {
      notFound();
    }
  }

  return (
    <section className="xl:container mx-auto px-5 py-4">
      {/* ================= Breadcrumb ================= */}
      {isLoading ? (
        <div className="mb-5 flex items-center gap-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-24 bg-[#F5F5F5] rounded" />
          ))}
        </div>
      ) : (
        <Breadcrumb className="mb-5 mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <AppLink href={`/${lang}/home`}>{home?.filteration?.home}</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathNames.map((item, index) => {
              if (index === 0) return null;

              const isLast = index === pathNames.length - 1;
              const segmentSlug = pathSlugs[index] || slug;

              return (
                <React.Fragment key={item}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <AppLink href={`/${lang}/category/${segmentSlug}`}>
                          {item}
                        </AppLink>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* ================= Child Categories ================= */}
      {!isLoading && products.length > 0 && childCategories.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {childCategories.map((subcat: Category) => (
            <AppLink
              key={subcat.slug}
              href={`/${lang}/category/${subcat.slug}`}
              className="px-5 py-2 bg-[#CCCCCC] text-primary rounded-lg hover:bg-[#CCCCCC]/80 transition-colors font-medium"
            >
              {subcat.name}
            </AppLink>
          ))}
        </div>
      )}

      {/* ================= MAIN GRID ================= */}
      <main className="grid grid-cols-12 gap-5 my-5 md:my-8">
        {/* ================= LEFT: FILTERS (DRAWER ON MOBILE/TABLET, INLINE ON LARGE) ================= */}
        <aside className="col-span-12 lg:col-span-4">
          {isCategoryLoading ? (
            <FiltersSkeleton />
          ) : (
            <CategoryFiltersWrapper
              isBrandsLoading={isCategoryLoading}
              isCategoriesLoading={isCategoryLoading}
              categories={categoryName ? [{ name: categoryName, slug: slug }] : []}
              products={products}
              topBrands={topBrands}
              range={range}
              onRangeChange={setRange}
              onAvailabilityChange={setAvailability}
              fetchFilteredProducts={handleApplyFilters}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories.length > 0 ? selectedCategories : slug ? [slug] : []}
              availability={availability}
            />
          )}
        </aside>

        {/* ================= RIGHT: PRODUCTS (9 COLS) ================= */}
        <section className="col-span-12 lg:col-span-8 bg-[#F5F5F5] rounded-lg p-5 lg:p-8">
          {/* -------- Header -------- */}
          {!isLoading && products.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <h2 className="text-lg md:text-xl font-medium line-clamp-2">
                    {categoryName}
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
            <ProductsError error={error} />
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
              totalPages={categoryData?.pagination?.total_pages}
              productCount={productsCount}
              limit={9}
            />
          )}
        </section>
      </main>
    </section>
  );
}
