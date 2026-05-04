"use client";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProductDetails, RatingSummary } from "@/utils/types/product";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { RatingBreakdown } from "./RatingBreakdown";
import { WriteReviewPrompt } from "../Reviews/WriteReviewPrompt";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useUserStore } from "@/store/useUserStore";

interface RatingSectionProps {
    product?: ProductDetails | null;
    ratingSummary?: RatingSummary | null;
    isLoading: boolean;
    error: Error | null;
    userHasReviewed: boolean;
    canReview?: boolean;
    onWriteReview: () => void;
}

export const RatingSection = ({ product, ratingSummary, isLoading, error, userHasReviewed, canReview, onWriteReview }: RatingSectionProps) => {
    const { product: productDict } = useDictionary();
    const t = productDict;
    const average = ratingSummary?.avg_rating ?? Number(product?.avg_rating || 0);
    const totalReviews = ratingSummary?.total_reviews ?? Number(product?.reviews_count || 0);
    const { isAuthenticated } = useUserStore();

    const sortedBreakdown = useMemo(() => {
        const rawBreakdown = ratingSummary?.breakdown || [];
        const breakdownMap = new Map(rawBreakdown.map((b: { rating: number; count: number; percentage: number }) => [Number(b.rating), b]));

        return [5, 4, 3, 2, 1].map(rating => {
            const item = breakdownMap.get(rating) as { rating: number; count: number; percentage: number } | undefined;
            const count = Number(item?.count || 0);
            const percentage = item?.percentage !== undefined
                ? Number(item.percentage)
                : (totalReviews > 0 ? (count / totalReviews) * 100 : 0);

            return { rating, count, percentage };
        });
    }, [ratingSummary, totalReviews]);

    return (
        <>
            <h3 className="text-xl md:text-2xl font-semibold mb-8 text-neutral-900">{t?.rating?.title || "Rating & Reviews"}</h3>

            {error && (
                <div className="mb-4 text-xs text-red-500 bg-red-50 p-2 rounded">
                    {t?.rating?.syncError || "Notice: Could not sync latest review stats."}
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-8">

                <div className="flex flex-col items-center sm:items-start justify-center gap-4 ">
                    <div className="flex items-baseline">
                        <h1 className="text-5xl md:text-7xl font-semibold text-neutral-900">
                            {average.toFixed(1)}
                        </h1>
                        <sub className="text-xl text-neutral-400 font-bold ml-2">{t?.rating?.outOfFive || "/5"}</sub>
                    </div>

                    <div className="flex flex-col items-center gap-2 ">
                        <div className="flex gap-1" aria-label={`Rating ${average} out of 5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <HugeiconsIcon
                                    key={i}
                                    icon={StarIcon}
                                    size={18}
                                    fill={i < Math.floor(Number(average)) ? "#FFB833" : "transparent"}
                                    color="#FFB833"
                                    strokeWidth={2}
                                />
                            ))}
                        </div>
                        <span className="text-neutral-500 text-base mt-1 whitespace-nowrap">
                            {totalReviews > 0 ? (t?.card?.reviews?.replace("{count}", totalReviews.toString()) || `(${totalReviews} Reviews)`) : (t?.rating?.noReviews || "( No Reviews )")}
                        </span>
                    </div>
                </div>

                <div className="hidden sm:block w-px bg-gray-300 self-stretch my-2 shrink-0" />

                <RatingBreakdown
                    breakdown={sortedBreakdown}
                    isLoading={isLoading}
                />
            </div>

            {isAuthenticated && (userHasReviewed || canReview) && (
                <>
                    <Separator className="my-7 md:my-5" />
                    <WriteReviewPrompt
                        onWriteReview={onWriteReview}
                        userHasReviewed={userHasReviewed}
                        canReview={canReview} />
                </>
            )}

        </>
    );
};
