"use client";
import React, { useMemo, useState } from "react";
import AppLink from '@/components/common/AppLink';
import { notFound, useParams } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductsError from "@/components/common/ProductsError";
import TopHeader from "@/components/layout/TopHeader";
import ProductCard from "@/components/common/ProductCard";
import { useProductDetailsQuery } from "@/hooks/queries/useProductQueries";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductRatingAndReviews } from "./components/common/ProductRatingAndReviews";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";
import { ProductGallery } from "./components/details/ProductGallery";
import { ProductInfo } from "./components/details/ProductInfo";
import { DetailsSection } from "./components/details/DetailsSection";
import { SpecificationSection } from "./components/details/SpecificationSection";

type TabKey = "details" | "specifications" | "reviews";

export default function ProductDetailsClient() {
    const { product: productDict } = useDictionary();
    const { startLoading, stopLoading } = useLoadingStore();
    const t = productDict;
    const params = useParams();
    const slug = params.slug as string;
    const lang = params.lang as string;
    const [activeTab, setActiveTab] = useState<TabKey>("details");

    const {
        data: product,
        isLoading,
        error,
    } = useProductDetailsQuery(slug);

    if (!isLoading && !product) {
        if (error) {
            if ((error as any).response?.status === 404) {
                notFound();
            }
        } else {
            notFound();
        }
    }

    const category = product?.category;
    const similarProducts = product?.similar_products ?? [];

    const pathNames = useMemo(() => {
        if (!category?.full_path) return [];
        return category.full_path
            .split(" > ")
            .map((p: string) => p.trim())
            .filter(Boolean);
    }, [category?.full_path]);

    const pathSlugs = useMemo(() => {
        if (!category?.full_path_slugs) return [];
        return category.full_path_slugs
            .split(" > ")
            .map((p: string) => p.trim())
            .filter(Boolean);
    }, [category?.full_path_slugs]);

    return (
        <section className="xl:container mx-auto px-5 py-7">
            {isLoading ? (
                <div className="mb-5 flex items-center gap-2 animate-pulse">
                    <div className="h-5 w-20 bg-[#F5F5F5] rounded-xl" />
                    <div className="h-5 w-28 bg-[#F5F5F5] rounded-xl" />
                    <div className="h-5 w-32 bg-[#F5F5F5] rounded-xl" />
                </div>
            ) : (
                <Breadcrumb className="mb-5" aria-label="Breadcrumb">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <AppLink href={`/${lang}/home`} className="hover:text-primary">
                                    {t?.details?.home}
                                </AppLink>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {pathNames.map((name: string, index: number) => {
                            if (index === 0) return null;

                            const isLast = index === pathNames.length - 1;
                            const slugSegment = pathSlugs[index] ?? slug;

                            return (
                                <React.Fragment key={`${name}-${index}`}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <AppLink href={`/${lang}/category/${slugSegment}`}>
                                                    {name}
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

            {/* Gallery & Info */}
            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 md:my-10">
                <ProductGallery
                    images={product?.images}
                    isLoading={isLoading}
                    product={product}
                />

                <ProductInfo
                    product={product}
                    isLoading={isLoading}
                    lang={lang}
                    onReviewClick={() => {
                        startLoading();
                        setActiveTab("reviews");
                        setTimeout(stopLoading, 300);
                        const tabsEl = document.getElementById("product-tabs");
                        if (tabsEl) {
                            const y = tabsEl.getBoundingClientRect().top + window.scrollY - 100; // offset for fixed headers
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }}
                />
            </div>

            {/* Tabs */}
            <div id="product-tabs" className="w-full mt-8 ">
                <ul
                    role="tablist"
                    className="flex flex-col md:flex-row gap-2 md:gap-5 p-2 rounded-2xl bg-gray-100/80 backdrop-blur"
                >
                    {[
                        { key: "details", label: t?.details?.tabs?.details },
                        { key: "specifications", label: t?.details?.tabs?.specifications },
                        { key: "reviews", label: t?.details?.tabs?.reviews },
                    ].map(tab => (
                        <li key={tab.key} className="w-full">
                            <Button
                                size="icon-lg"
                                variant="ghost"
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                onClick={() => {
                                    startLoading();
                                    setActiveTab(tab.key as TabKey);
                                    setTimeout(stopLoading, 300); 
                                }}
                                className={`w-full py-3 text-lg font-medium rounded-xl transition-all
                                ${activeTab === tab.key
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-gray-500 hover:bg-white/50"
                                    }`}
                            >
                                {tab.label}
                            </Button>
                        </li>
                    ))}
                </ul>

                {/* Tab Content */}
                <div className="mt-8 ">
                    {activeTab === "details" && (
                        <DetailsSection product={product} isLoading={isLoading} />
                    )}
                    {activeTab === "specifications" && (
                        <SpecificationSection product={product} />
                    )}
                    {activeTab === "reviews" && (
                        <ProductRatingAndReviews product={product} />
                    )}
                </div>
            </div>

            {/* Similar Products */}
            <Separator className="my-0" />
            {
                error ? (
                    <ProductsError error={error} />
                ) : similarProducts.length > 0 ? (
                    <section className="my-10 min-h-[420px]">
                        <TopHeader title={t?.details?.youMightLike} />
                        <ProductCard products={similarProducts} columns={4} />
                    </section>
                ) : null
            }
        </section>
    );
}
