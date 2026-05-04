'use client';

import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { Button } from "../ui/button";

type Props = {
    api: CarouselApi | null;
    autoplay?: React.MutableRefObject<any>;
    maxDots?: number;
    inactiveBgClass?: string;
};

export function CarouselDots({
    api,
    autoplay,
    maxDots = 6,
    inactiveBgClass = "bg-gray-300"
}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
        if (!api) return;

        const update = () => {
            setScrollSnaps(api.scrollSnapList());
            setSelectedIndex(api.selectedScrollSnap());
        };

        update();
        api.on("select", update);
        api.on("reInit", update);

        return () => {
            api.off("select", update);
            api.off("reInit", update);
        };
    }, [api]);

    if (scrollSnaps.length <= 1) return null;

    const total = scrollSnaps.length;
    const limit = Math.max(1, Math.min(maxDots, total));

    let start = Math.max(0, selectedIndex - Math.floor(limit / 2));
    let end = start + limit;

    if (end > total) {
        end = total;
        start = Math.max(0, end - limit);
    }

    const visibleDots = scrollSnaps.slice(start, end);

    return (
        <div className="mt-10 flex justify-center items-center gap-5 rtl:gap-7">
            {visibleDots.map((_, i) => {
                const realIndex = start + i;
                const isActive = realIndex === selectedIndex;

                return (
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        type="button"
                        key={realIndex}
                        onClick={() => {
                            api?.scrollTo(realIndex);
                            autoplay?.current?.reset?.();
                            autoplay?.current?.play?.();
                        }}
                        aria-label={`Go to slide ${realIndex + 1}`}
                        className={`shrink-0 rounded-full transition-all duration-300
                        ${isActive
                                ? "h-4 w-10 bg-black"
                                : `h-4 w-4 ${inactiveBgClass} opacity-100`}`}
                    />

                );
            })}
        </div>
    );
}
