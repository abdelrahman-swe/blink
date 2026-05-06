"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { usePathname } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { getBrandsQuery } from "@/hooks/queries/useHomeQueries";
import { CarouselDots } from "../Carousel/CarouselDots";
import BrandCarouselLoading from "../loading/BrandCarouselLoading";
import ProductsError from "../common/ProductsError";

import { useDictionary } from "../providers/DictionaryProvider";

export default function Deals() {
    const { home } = useDictionary();
    const t = home?.topHeaders;
    const { data: brands, isLoading, error } = getBrandsQuery();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";
    const [api, setApi] = useState<CarouselApi | null>(null);

    const autoplay = useRef(
        Autoplay({ delay: 2500, stopOnInteraction: true })
    );

    if (error) return <ProductsError error={error} />;

    return (
        <section className="xl:container mx-auto my-10 px-5 relative">
            <h1 className="text-2xl font-semibold mb-10 text-primary text-center">
                {t?.shopByBrand}
            </h1>

            {error || brands?.length === 0 ? (
                <h1 className='px-5 text-center text-gray-500 h-[300px] flex items-center justify-center md:text-lg'>{t?.noBrands}</h1>
            ) : (
                <>
                    <div
                        onMouseEnter={() => autoplay.current.stop()}
                        onMouseLeave={() => { autoplay.current.reset(); autoplay.current.play(); }}
                    >
                        <Carousel
                            setApi={setApi}
                            opts={{ align: "start", loop: (brands?.length ?? 0) > 5 }}
                            className="w-full"
                            plugins={[autoplay.current]}
                        >
                            <CarouselContent className="-ms-5">
                                {isLoading ? (
                                    <BrandCarouselLoading count={5} />
                                ) : (
                                    brands?.map((item) => (
                                        <CarouselItem
                                            key={item.id}
                                            className="ps-5 basis-full min-[576px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                        >
                                            <article className="flex w-full h-24 transition-shadow duration-300">
                                                {/* Brand Image */}
                                                <div className="relative w-24 h-24 shrink-0">
                                                    <Image
                                                        src={item.images?.original || "/placeholder.png"}
                                                        alt={`${item.name}`}
                                                        width={96}
                                                        height={96}
                                                        className="object-cover h-full rounded-s-xl border-2 border-gray-200"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {/* Brand Info */}
                                                <div className="flex-1 bg-secondary flex flex-col justify-center items-start px-5 rounded-e-lg">
                                                    <h3 className="font-semibold text-lg text-neutral-700">
                                                        {item.name}
                                                    </h3>
                                                    <Button variant="ghost" className="p-0">
                                                        <AppLink
                                                            href={`/${lang}/brand/${item.slug}`}
                                                            className="flex items-center gap-1 text-primary "
                                                        >
                                                            <span className="text-md font-medium text-primary">{t?.visitStore}</span>
                                                            <HugeiconsIcon
                                                                icon={ArrowRight01Icon}
                                                                size={20}
                                                                color="#000000"
                                                                strokeWidth={1.5}
                                                                aria-hidden="true"
                                                                className="rtl:rotate-180 mt-1"
                                                            />
                                                        </AppLink>
                                                    </Button>
                                                </div>
                                            </article>
                                        </CarouselItem>
                                    ))
                                )}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    <CarouselDots api={api} autoplay={autoplay} maxDots={5} inactiveBgClass="bg-gray-100" />
                </>
            )}
        </section>
    );
}