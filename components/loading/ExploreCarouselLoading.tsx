'use client';

import { CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { categorySlideWidths } from "@/utils/categorySlideWidths";
import { cn } from "@/lib/utils";

export default function ExploreCarouselLoading({ count = 10 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <CarouselItem key={`explore-skel-${i}`} className={cn(categorySlideWidths, "ps-5")}>
                    <div className="w-full flex flex-col items-center">
                        <Skeleton className="h-32 w-32 md:h-[200px] md:w-[200px] rounded-full" />
                        <Skeleton className="h-4 w-24 md:w-[200px] mt-5" />
                    </div>
                </CarouselItem>
            ))}
        </>
    );
}
