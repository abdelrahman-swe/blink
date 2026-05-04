"use client"
import { useParams, useRouter } from "next/navigation";
import { useProductDetailsReviewsQuery } from "@/hooks/queries/useProductQueries";
import { ProductDetails } from "@/utils/types/product";
import { RatingSection } from "../Rating/RatingSection";
import { ReviewSection } from "../Reviews/ReviewSection";
import { useMemo, useState } from "react";
import EmptyRatingAndReviews from "./EmptyRatingAndReviews";
import { RatingAndReviewsForm } from "./RatingAndReviewsForm";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface ProductRatingAndReviewsProps {
    product?: ProductDetails | null;
}

export const ProductRatingAndReviews = ({ product }: ProductRatingAndReviewsProps) => {
    const { product: productDict } = useDictionary();
    const t = productDict;
    const params = useParams();
    const slug = params.slug as string;

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useProductDetailsReviewsQuery(slug, 4);

    const reviews = useMemo(() => data?.pages.flatMap((page) => page?.items || []) || [], [data]);
    const ratingSummary = data?.pages[0]?.rating_summary;
    const canReview = data?.pages[0]?.can_review;
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    if (!isLoading && !error && reviews.length === 0) {
        return (
            <>
                <EmptyRatingAndReviews
                    onWriteReview={() => setIsReviewFormOpen(true)}
                    canReview={canReview}
                />
                <RatingAndReviewsForm open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen} />
            </>
        );
    }

    return (
        <>
            <section className="my-12">
                <RatingAndReviewsForm open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen} />
                <div className="grid grid-cols-12 lg:gap-16">
                    <div className="col-span-12 lg:col-span-5 lg:sticky top-24 self-start">
                        <RatingSection
                            product={product}
                            ratingSummary={ratingSummary}
                            isLoading={isLoading}
                            error={error}
                            userHasReviewed={reviews.some((review) => review.is_me)}
                            canReview={canReview}
                            onWriteReview={() => setIsReviewFormOpen(true)}
                        />
                    </div>

                    <div className="col-span-12 lg:col-span-7 mt-8 lg:mt-0">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-semibold text-neutral-900">{t?.details?.customerReviews}</h3>
                        </div>
                        <ReviewSection
                            reviews={reviews}
                            isLoading={isLoading}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onWriteReview={() => setIsReviewFormOpen(true)}
                        />
                    </div>
                </div>
            </section>
        </>

    );
};
