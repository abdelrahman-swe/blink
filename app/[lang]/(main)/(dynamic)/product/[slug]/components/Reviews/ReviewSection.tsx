"use client";
import { useEffect } from "react";
import {
    ArrowDownDoubleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewCard } from "./ReviewCard";
import { Loader2Icon } from "lucide-react";
import { Review } from "@/utils/types/product";
import Image from "next/image";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";

interface ReviewSectionProps {
    reviews: Review[];
    isLoading: boolean;
    error: Error | null;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onWriteReview: () => void;
}

export const ReviewSection = ({
    reviews,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onWriteReview
}: ReviewSectionProps) => {
    const { startLoading, stopLoading } = useLoadingStore();
    const { product: productDict } = useDictionary();
    const t = productDict;

    useEffect(() => {
        if (isFetchingNextPage) {
            startLoading();
        } else {
            stopLoading();
        }
    }, [isFetchingNextPage]);


    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-[#CCCCCC] rounded-2xl p-4 space-y-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{t?.reviews?.errorLoading}</div>;
    }

    const visibleReviews = reviews.filter(review => review.body);

    if (visibleReviews.length === 0) {
        return <div className='flex flex-col items-center justify-center gap-7 max-h-100'>
            <Image src="/no-comment.png" alt="No Comment" width={100} height={100} />
            <p className='font-medium text-gray-500 text-lg'>{t?.reviews?.empty}</p>
        </div>
    }

    return (
        <div className="space-y-4">
            <div className="max-h-[550px] overflow-y-auto scrollbar-primary md:pr-3 space-y-4">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {(hasNextPage || isFetchingNextPage) && (
                <div className="flex justify-center mt-8">
                    <Button
                        size="icon-lg"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                            fetchNextPage();
                        }}
                        disabled={isFetchingNextPage}
                        className="flex items-center gap-2 text-sm text-[#0D0D0D] font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                {t?.reviews?.loading}
                            </>
                        ) : (
                            <>
                                {t?.reviews?.loadMore}
                                <HugeiconsIcon
                                    icon={ArrowDownDoubleIcon}
                                    size={18}
                                    color="#000000"
                                    strokeWidth={1}
                                />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};
