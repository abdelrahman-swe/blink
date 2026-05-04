"use client";

import { useState, useRef, useEffect } from "react";
import AppLink from '@/components/common/AppLink';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { Category } from "@/utils/types/categories";
import MegaDropdownPortal from "./MegaDropdownPortal";
import { getAllCategoriesQuery } from "@/hooks/queries/useHomeQueries";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "../ui/skeleton";
import { useDictionary } from "../providers/DictionaryProvider";

type HeaderProps = {
  mainCategorySlug?: string;
  lang?: string;
};

export default function Header({
  mainCategorySlug = "electronics",
  lang = "en",
}: HeaderProps) {
  const { home } = useDictionary();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data = [], isLoading, error } = getAllCategoriesQuery();
  const mainCategory = data.find((c) => c.slug === mainCategorySlug) ?? data[0];
  const subcats: Category[] = mainCategory?.children ?? [];

  useEffect(() => {
    document.body.style.overflowX = hoveredSlug ? "hidden" : "auto";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, [hoveredSlug]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading || error) {
    return (
      <header className="bg-primary overflow-hidden sticky top-16 md:top-20 z-40">
        <div className="container mx-auto relative px-10 flex items-center h-16 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-30 bg-white/20 rounded-md" />
          ))}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary dark:bg-black! overflow-hidden sticky top-16 md:top-20 z-40">
      <div className="container mx-auto relative px-10">
        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView="auto"
          spaceBetween={10}
          navigation={{
            nextEl: ".header-swiper-button-next",
            prevEl: ".header-swiper-button-prev",
          }}
          onSwiper={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onReachBeginning={() => setIsBeginning(true)}
          onReachEnd={() => setIsEnd(true)}
          onFromEdge={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="w-full"
        >
          {subcats.map((subcat) => {
            const hasChildren = (subcat.children?.length ?? 0) > 0;

            return (
              <SwiperSlide key={subcat.slug} className="w-auto!">
                <div
                  ref={(el) => {
                    refs.current[subcat.slug] = el;
                  }}
                  onMouseEnter={() => {
                    if (hasChildren) {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      hoverTimeoutRef.current = setTimeout(() => {
                        setHoveredSlug(subcat.slug);
                      }, 300);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                    setHoveredSlug(null);
                  }}
                >
                  <AppLink
                    href={`/${lang}/category/${subcat.slug}`}
                    className="block px-3"
                  >
                    <div className="h-16 flex items-center justify-center rounded-md hover:bg-primary-foreground/10 transition whitespace-nowrap">
                      <h3 className="text-white text-lg font-medium">
                        {subcat.name}
                      </h3>
                    </div>
                  </AppLink>
                </div>

                {/* Mega Dropdown */}
                {hasChildren && (
                  <MegaDropdownPortal
                    subcategory={subcat}
                    topBrands={subcat.top_brands}
                    isOpen={hoveredSlug === subcat.slug}
                    anchorRef={{ current: refs.current[subcat.slug] }}
                    onMouseEnter={() => setHoveredSlug(subcat.slug)}
                    onClose={() => setHoveredSlug(null)}
                    lang={lang}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* LEFT ARROW */}
        <button
          disabled={isBeginning}
          className={`
            header-swiper-button-prev
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            z-10
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            transition
            group
            ${isBeginning
              ? "bg-black/20 cursor-not-allowed opacity-40"
              : "bg-black/40 hover:bg-white cursor-pointer"
            }
          `}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={18}
            strokeWidth={2}
            className={`rotate-180 transition ${isBeginning ? "text-white/50" : "text-white group-hover:text-primary"
              }`}
          />
        </button>

        {/* RIGHT ARROW */}
        <button
          disabled={isEnd}
          className={`
            header-swiper-button-next
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            z-10
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            transition
            group
            ${isEnd
              ? "bg-black/20 cursor-not-allowed opacity-40"
              : "bg-black/40 hover:bg-white cursor-pointer"
            }
          `}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={18}
            strokeWidth={2}
            className={`transition ${isEnd ? "text-white/50" : "text-white group-hover:text-primary"
              }`}
          />
        </button>
      </div>
    </header>
  );
}
