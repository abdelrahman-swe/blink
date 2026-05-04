'use client';
import { Button } from "@/components/ui/button";
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LoginRequiredDialog } from '@/components/common/LoginRequiredDialog';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductReviewsResponse } from "@/utils/types/product";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useUserStore } from "@/store/useUserStore";

interface WriteReviewPromptProps {
    onWriteReview: () => void;
    userHasReviewed?: boolean;
    variant?: 'default' | 'centered';
    title?: string;
    description?: string;
    image?: string;
    canReview?: boolean;
}

export const WriteReviewPrompt = ({
    onWriteReview,
    userHasReviewed = false,
    variant = 'default',
    canReview = true,
    title,
    description,
    image,
}: WriteReviewPromptProps) => {
    const { startLoading } = useLoadingStore();
    const { product: productDict } = useDictionary();
    const t = productDict;
    const {
        showLoginDialog,
        setShowLoginDialog,
        handleActionWithAuth
    } = useRequireAuth();

    const handleWriteReview = () => {
        handleActionWithAuth(() => {
            startLoading();
            onWriteReview();
        });
    };

    const isCentered = variant === 'centered';
    const { isAuthenticated } = useUserStore();

    // if (!canReview) {
    //     return null;
    // }

    return (
        <>
            <div className={cn(
                "pt-2 flex flex-col",
                isCentered ? "items-center justify-center gap-7 h-75 md:h-100 md:py-12" : "items-start"
            )}>
                {isCentered && image && (
                    <Image src={image} alt="No Comment" width={100} height={100} />
                )}

                <div className={cn(
                    "flex flex-col",
                    isCentered ? "items-center text-center" : "items-start"
                )}>
                    {!isCentered && (
                        <h4 className="text-xl font-medium mb-2 text-neutral-900">
                            {title || t?.reviews?.prompt?.title}
                        </h4>
                    )}
                    <p className={cn(
                        "text-base mb-6 leading-relaxed",
                        isCentered ? "font-medium text-lg text-neutral-900" : "text-neutral-500"
                    )}>
                        {description || t?.reviews?.prompt?.description}
                    </p>


                    {isAuthenticated && (userHasReviewed || canReview) && (
                        <Button
                            variant="outline"
                            className="rounded-3xl px-8 hover:bg-neutral-50 transition-colors"
                            onClick={handleWriteReview}
                            disabled={userHasReviewed}
                        >
                            {userHasReviewed ? (t?.reviews?.prompt?.alreadyReviewed) : (t?.reviews?.prompt?.writeReview)}
                        </Button>
                    )}
                    
                </div>
            </div>

            <LoginRequiredDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                message={t?.reviews?.prompt?.loginToReview}
            />
        </>
    );
};
