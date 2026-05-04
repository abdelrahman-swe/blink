'use client';
import ProductCardCarousel from "../Carousel/ProductCardCarousel";
import TopHeader from "../layout/TopHeader";
import { getBestSellingProductsQuery } from "@/hooks/queries/useHomeQueries";

import { useParams } from "next/navigation";
import { useDictionary } from "../providers/DictionaryProvider";
import { Skeleton } from "../ui/skeleton";

export default function BestSelling() {
    const { home } = useDictionary();
    const t = home?.topHeaders;
    const params = useParams();
    const lang = params.lang as string;
    const { data: bestSellingData, isLoading, error } = getBestSellingProductsQuery({ limit: 12 });
    const products = bestSellingData?.items ?? [];

    if (isLoading) return <Skeleton className="h-[400px] w-full mt-10" />
    if (products.length === 0) return null


    return (
        <section id="best-sellers" className="bg-secondary py-10 scroll-mt-28">

            <div className="xl:container mx-auto px-5 ">
                <TopHeader title={t?.bestSellingProducts} link={`/${lang}/best-selling`} />
                <ProductCardCarousel products={products} isLoading={isLoading} error={error} />
            </div >
        </section>
    );
}