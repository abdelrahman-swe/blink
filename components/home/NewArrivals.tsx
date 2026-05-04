'use client';
import ProductCardCarousel from "../Carousel/ProductCardCarousel";
import TopHeader from "../layout/TopHeader";
import { getNewArrivalProductsQuery } from "@/hooks/queries/useHomeQueries";

import { useParams } from "next/navigation";

import { useDictionary } from "../providers/DictionaryProvider";
import { Skeleton } from "../ui/skeleton";

export default function NewArrivals() {
    const { home } = useDictionary();
    const t = home?.topHeaders;
    const params = useParams();
    const lang = params.lang as string;
    const { data: newArrivalsData, isLoading, error } = getNewArrivalProductsQuery({ limit: 12 });
    const products = newArrivalsData?.items ?? [];

    if (isLoading) return <Skeleton className="h-[400px] w-full" />


    return (
        <section id="new-arrivals" className="bg-secondary py-10 scroll-mt-28 mt-10 ">

            <div className="xl:container mx-auto px-5 ">
                <TopHeader title={t?.newArrivals} link={`/${lang}/new-arrivals`} showLink={products.length > 0 && !error} />
                {error || products.length === 0 ?
                   <h1 className='px-5 text-center text-gray-500 h-[300px] flex items-center justify-center md:text-lg'>{t?.noNewArrivals}</h1>
                : (
                    <ProductCardCarousel products={products} isLoading={isLoading} error={error} />
                )}
            </div >
        </section>
    );
}   