'use client';

import React, { useRef, useState } from "react";
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { usePathname } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getAllCategoriesQuery } from "@/hooks/queries/useHomeQueries";
import type { Category } from "@/utils/types/categories";
import ExploreCarouselLoading from "../loading/ExploreCarouselLoading";
import { CarouselDots } from "../Carousel/CarouselDots";
import ProductsError from "../common/ProductsError";

import { useDictionary } from "../providers/DictionaryProvider";

export default function Explore() {
  const { home } = useDictionary();
  const t = home?.topHeaders;
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  const { data = [], isLoading, error } = getAllCategoriesQuery();
  const mainCategory = data[0];
  const subcats: Category[] = mainCategory?.children ?? [];

  const [api, setApi] = useState<CarouselApi | null>(null);

  const autoplay = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );


  if (error) return <ProductsError error={error} />;

  return (
    <section id="categories" className="xl:container mx-auto my-10 px-5 scroll-mt-28">
      <h1 className="text-2xl font-semibold mb-10 text-primary text-center">
        {t?.exploreMoreCategories}
      </h1>

      {error || subcats?.length === 0 ? (
         <h1 className='px-5 text-center text-gray-500 h-[300px] flex items-center justify-center md:text-lg'>{t?.noCategories}</h1>
      ) : (
        <>
          <div
            onMouseEnter={() => {
              if (api) autoplay.current?.stop?.();
            }}
            onMouseLeave={() => {
              if (api) {
                try {
                  autoplay.current?.reset?.();
                  autoplay.current?.play?.();
                } catch (e) {
                  // ignore if plugin internals crash when empty
                }
              }
            }}
          >
            <Carousel
              setApi={setApi}
              plugins={[autoplay.current]}
              opts={{ align: "start", loop: subcats.length > 5 }}
              className="w-full"
            >
              <CarouselContent className="-ms-5 items-stretch">
                {isLoading ? (
                  <ExploreCarouselLoading count={6} />
                ) : (
                  subcats?.map((sub, index) => (
                    <CarouselItem
                      key={sub.slug ?? `subcat-${index}`}
                      className="ps-5 basis-full min-[576px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <AppLink
                        href={`/${lang}/category/${sub.slug}`}
                        className="flex flex-col items-center w-full"
                      >
                        {/* Subcategory Image */}

                        <div className="relative w-full max-w-[220px] sm:max-w-[220px] md:max-w-[220px] aspect-square rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
                            <Image
                              src={sub.images?.original || '/placeholder.png'}
                              alt={sub.name ? `${sub.name} category image` : "Subcategory"}
                              fill
                              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover rounded-xl object-center"
                              loading="lazy"
                            />
                        </div>

                        {/* Subcategory Name */}
                        <h3 className="font-medium text-lg mt-5 text-center line-clamp-2">
                          {sub.name}
                        </h3>
                      </AppLink>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Carousel Dots */}
          <CarouselDots api={api} autoplay={autoplay} maxDots={6} inactiveBgClass="bg-gray-100" />
        </>
      )}
    </section>
  );
}
