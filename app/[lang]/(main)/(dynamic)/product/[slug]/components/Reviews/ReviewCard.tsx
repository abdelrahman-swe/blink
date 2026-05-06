import { Delete02Icon, StarIcon, ThumbsUpIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Review } from "@/utils/types/product";
import { useParams } from "next/navigation";
import { useDeleteReviewMutation, toggleHelpfulReviewMutation } from "@/hooks/queries/useProductQueries";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RatingAndReviewsForm } from "../common/RatingAndReviewsForm";
import Image from "next/image";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMemo } from "react";
import { getOrCreateGuestId } from "@/utils/api";

interface ReviewCardProps {
    review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [optimisticIsHelpful, setOptimisticIsHelpful] = useState(review.is_helpful);
    const [optimisticHelpfulCount, setOptimisticHelpfulCount] = useState(review.helpful_count);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useParams();
    const slug = params.slug as string;
    const lang = params.lang as string;
    const { product: productDict } = useDictionary();
    const t = productDict;
    const startLoading = useLoadingStore((state) => state.startLoading);
    const stopLoading = useLoadingStore((state) => state.stopLoading);
    const { mutate: deleteReview } = useDeleteReviewMutation();
    const { mutate: toggleHelpful } = toggleHelpfulReviewMutation();

    const handleDelete = () => {
        setIsDeleting(true);
        deleteReview(
            { id: review.id.toString(), product_slug: slug },
            {
                onSuccess: () => {
                    toast.success(t?.reviews?.deletedSuccess);
                    setDeleteDialog(false);
                },
                onError: (err) => {
                    setIsDeleting(false);
                    toast.error(err.message || t?.reviews?.deleteFailed);
                },
            }
        );
    };

    const handleHelpful = () => {
        // Optimistic update - update UI immediately
        const newIsHelpful = !optimisticIsHelpful;
        const newCount = newIsHelpful ? optimisticHelpfulCount + 1 : optimisticHelpfulCount - 1;
        
        setOptimisticIsHelpful(newIsHelpful);
        setOptimisticHelpfulCount(newCount);
        
        const guest_id = getOrCreateGuestId();
        toggleHelpful(
            { id: review.id.toString(), product_slug: slug, guest_id },
            {
                onError: (err) => {
                    // Revert optimistic changes on error
                    setOptimisticIsHelpful(review.is_helpful);
                    setOptimisticHelpfulCount(review.helpful_count);
                    toast.error(err.message || t?.reviews?.voteFailed);
                },
            }
        );
    };



    return (
        <article className="border border-neutral-300 rounded-2xl bg-white p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6] overflow-hidden shrink-0">
                        {review.avatar?.original ? (
                            <Image
                                src={review.avatar.original}
                                alt={review.user_name}
                                className="h-full w-full object-fit border border-neutral-300 rounded-full"
                                width={48}
                                height={48}
                                priority
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={UserIcon}
                                size={20}
                                color="#000000"
                                strokeWidth={1.5}
                            />
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="font-bold text-neutral-900 text-sm md:text-base">
                            {review.user_name}
                        </p>
                        <p className="text-xs md:text-sm text-[#4D4D4D]">
                            {new Date(review.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>

                        <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <HugeiconsIcon
                                    key={i}
                                    icon={StarIcon}
                                    size={16}
                                    fill={i < review.rating ? "#FFB833" : "transparent"}
                                    color="#FFB833"
                                    strokeWidth={1}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    {review.is_me ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0} className="inline-block cursor-not-allowed">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        type="button"
                                        onClick={handleHelpful}
                                        disabled
                                        className="text-[#666666] hover:text-neutral-900 hover:bg-transparent p-0! gap-2 transition-colors"
                                    >
                                        <HugeiconsIcon
                                            icon={ThumbsUpIcon}
                                            size={24}
                                            color="currentColor"
                                            strokeWidth={1.5}
                                            fill={optimisticIsHelpful ? "#000000" : "transparent"}
                                        />
                                        <span className="font-normal text-sm md:text-base">
                                            {t?.reviews?.helpful?.replace("{count}", optimisticHelpfulCount.toString()) || `Helpful (${optimisticHelpfulCount})`}
                                        </span>
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t?.reviews?.ownReviewVote}</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button
                            variant="ghost"
                            size="lg"
                            type="button"
                            onClick={handleHelpful}
                            className="rtl:flex rtl:flex-row-reverse text-[#666666] hover:text-neutral-900 hover:bg-transparent p-0! gap-2 transition-colors [&_svg]:size-auto"
                        >
                            <HugeiconsIcon
                                icon={ThumbsUpIcon}
                                size={24}
                                color="currentColor"
                                strokeWidth={1.5}
                                fill={optimisticIsHelpful ? "#000000" : "transparent"}
                            />
                            <span className="font-normal text-sm md:text-base">
                                {t?.reviews?.helpful?.replace("{count}", optimisticHelpfulCount.toString()) || `Helpful (${optimisticHelpfulCount})`}
                            </span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 w-full overflow-hidden">
                {review.body && (
                    <div className="mt-4 text-sm md:text-base text-neutral-800 w-full overflow-hidden">
                        <p
                            className={cn(
                                "leading-relaxed whitespace-pre-wrap wrap-break-word",
                                !isExpanded && "line-clamp-2 cursor-pointer"
                            )}
                            onClick={() => !isExpanded && setIsExpanded(true)}
                        >
                            {review.body}
                        </p>
                        {review.body.length > 100 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-gray-400 hover:underline text-xs md:text-sm"
                            >
                                {isExpanded ? (t?.reviews?.showLess) : (t?.reviews?.readMore)}
                            </button>
                        )}
                    </div>
                )}

                {review.is_me && (
                    <div className="flex items-center justify-end gap-4 me-3 mt-2 md:mt-0 w-full md:w-auto">
                        {/* <Button
                            variant="link"
                            type="button"
                            onClick={() => setEditDialog(true)}
                            className="text-neutral-900 text-md font-medium underline h-auto p-0 hover:text-neutral-700"
                        >
                            {t?.reviews?.edit}
                        </Button> */}

                        <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() => setDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            <HugeiconsIcon
                                icon={Delete02Icon}
                                size={22}
                                color="currentColor"
                                strokeWidth={1.5}
                            className="me-2 md:me-0!"
                            />
                        </Button>
                    </div>
                )}
            </div>


            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent className="sm:max-w-lg space-y-3 p-8">
                    <DialogTitle className="font-medium text-xl text-center mt-5">
                        {t?.reviews?.deleteConfirmTitle}
                    </DialogTitle>
                    <DialogFooter className="mx-auto text-center space-x-2">
                        <Button
                            variant="outline"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => setDeleteDialog(false)}
                        >
                            {t?.reviews?.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => handleDelete()}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (t?.reviews?.deleting) : (t?.reviews?.delete)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RatingAndReviewsForm
                open={editDialog}
                onOpenChange={setEditDialog}
                initialData={useMemo(() => ({
                    id: review.id,
                    rating: review.rating,
                    body: review.body
                }), [review.id, review.rating, review.body])}
            />
            {/* <LoginRequiredDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                message={t?.reviews?.loginToVote}
            /> */}
        </article>
    );
};

