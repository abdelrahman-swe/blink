"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAddReviewMutation, useEditReviewMutation } from "@/hooks/queries/useProductQueries";
import { getReviewSchema } from "@/utils/schema/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckmarkCircle02Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";

interface RatingAndReviewsFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: {
        id: number;
        rating: number;
        body?: string;
    };
}

export const RatingAndReviewsForm = ({ open, onOpenChange, initialData }: RatingAndReviewsFormProps) => {
    const { product: productDict } = useDictionary();
    const startLoading = useLoadingStore((state) => state.startLoading);
    const stopLoading = useLoadingStore((state) => state.stopLoading);
    const t = productDict;
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const params = useParams();
    const slug = params.slug as string;

    // Mutations
    const { mutate: addReview, isPending: isAdding } = useAddReviewMutation();
    const { mutate: editReview, isPending: isEditing } = useEditReviewMutation();
    const isPending = isAdding || isEditing;

    const schema = getReviewSchema(t);
    type ReviewValues = z.infer<typeof schema>;

    const form = useForm<ReviewValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            product_slug: slug || "",
            rating: initialData?.rating || 0,
            body: initialData?.body || "",
        },
    });

    useEffect(() => {
        if (open) {
            stopLoading(); // Stop the global overlay when the modal actually opens
            form.reset({
                product_slug: slug,
                rating: initialData?.rating || 0,
                body: initialData?.body || "",
            });
            setReviewError(null);
        }
    }, [open, slug, form, initialData, stopLoading]);

    const onSubmit = (values: ReviewValues) => {
        setReviewError(null);
        startLoading();

        if (initialData) {
            // editReview({
            //     id: initialData.id.toString(),
            //     product_slug: slug,
            //     rating: values.rating,
            //     body: values.body || ""
            // }, {
            //     onSuccess: () => {
            //         stopLoading();
            //         onOpenChange(false);
            //         setOpenSuccessDialog(true);
            //         // setTimeout(() => setOpenSuccessDialog(false), 1000);
            //     },
            //     onError: (error: any) => {
            //         stopLoading();
            //         const message = error?.response?.data?.message || t?.reviews?.form?.errorGeneric || "Something went wrong. Please try again.";
            //         setReviewError(message);
            //     }
            // });
        } else {
            addReview({
                ...values,
                body: values.body || ""
            }, {
                onSuccess: () => {
                    stopLoading();
                    onOpenChange(false);
                    setOpenSuccessDialog(true);
                    // setTimeout(() => setOpenSuccessDialog(false), 1000);
                    form.reset({
                        product_slug: slug,
                        rating: 0,
                        body: "",
                    });
                },
                onError: (error: any) => {
                    stopLoading();
                    const message = error?.response?.data?.message || t?.reviews?.form?.errorGeneric || "Something went wrong. Please try again.";
                    setReviewError(message);
                }
            });
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg px-10 overflow-hidden">
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="font-medium text-2xl text-center text-neutral-900">
                            {initialData ? (t?.reviews?.form?.titleEdit) : (t?.reviews?.form?.titleWrite)}
                        </DialogTitle>
                        <p className="text-center mt-2">
                            {initialData ? (t?.reviews?.form?.descEdit) : (t?.reviews?.form?.descWrite)}
                        </p>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3">
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center gap-3">
                                        <FormControl>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => field.onChange(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <HugeiconsIcon
                                                            icon={StarIcon}
                                                            size={40}
                                                            fill={(hoverRating || field.value) >= star ? "#FFB833" : "transparent"}
                                                            color="#FFB833"
                                                            strokeWidth={1}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </FormControl>
                                        {form.formState.errors.rating && (
                                            <p className="text-destructive text-sm">
                                                {form.formState.errors.rating.message}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <p className="my-4 mx-auto font-normal text-md">
                                            {t?.reviews?.form?.summaryLabel}
                                        </p>
                                        <FormControl>
                                            <div className="relative group">
                                                <Textarea
                                                    placeholder={t?.reviews?.form?.placeholder}
                                                    className="min-h-[140px] break-all p-3 bg-neutral-50 border-neutral-200 focus:bg-white focus:ring-primary/20 transition-all resize-none rounded-xl"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        {form.formState.errors.body && (
                                            <p className="text-destructive text-sm">
                                                {form.formState.errors.body.message}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {reviewError && (
                                <p className="text-destructive text-sm text-center font-medium">
                                    {reviewError}
                                </p>
                            )}

                            <DialogFooter className="flex justify-end! items-end!">

                                <Button
                                    type="submit"
                                    className="px-8 py-2 rounded-4xl text-md"
                                    disabled={isPending || !!reviewError}
                                >
                                    {isPending ? (initialData ? (t?.reviews?.form?.saving) : (t?.reviews?.form?.submitting)) : (initialData ? (t?.reviews?.form?.save) : (t?.reviews?.form?.submit))}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={openSuccessDialog} onOpenChange={setOpenSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mx-auto mt-5">
                            <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={70}
                                color="#34C759"
                                strokeWidth={1.5}
                            />
                        </DialogTitle>
                        <DialogDescription className="text-lg text-primary font-medium mx-auto text-center max-w-2xs">
                            {initialData
                                ? (t?.reviews?.form?.successEdit)
                                : (t?.reviews?.form?.successAdd)}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};
