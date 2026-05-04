'use client';

import { CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { categorySlideWidths } from "@/utils/categorySlideWidths";
import { cn } from "@/lib/utils";

export default function BrandCarouselLoading({ count = 5 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <CarouselItem key={`brand-skel-${i}`} className={cn("ps-5", categorySlideWidths)}>
                    <div className="flex w-full h-24 shadow-sm rounded-lg overflow-hidden">
                        {/* Brand Image Skeleton */}
                        <Skeleton className="w-24 h-24 flex-shrink-0 bg-gray-200" />

                        {/* Brand Info Skeleton */}
                        <div className="flex-1 bg-gray-100 flex flex-col justify-center items-start px-5 gap-3 rounded-e-lg">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3.5 w-24" />
                        </div>
                    </div>
                </CarouselItem>
            ))}
        </>
    );
}