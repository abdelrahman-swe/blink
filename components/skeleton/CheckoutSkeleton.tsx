import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";



export const CheckoutFormSkeleton = () => {
    return (
        <div className="space-y-6 lg:w-[500px]">
            {/* Account Details Header */}
            <Skeleton className="h-7 w-40 mb-8" />

            {/* Full Name */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Delivery Address Header */}
            <Skeleton className="h-7 w-48 mt-8" />

            {/* Governorate & City Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-[100px] w-full" />
            </div>
        </div>
    );
};

export const CheckoutSummarySkeleton = () => {
    return (
        <div className="col-span-12 lg:col-span-4 order-1 lg:order-2 h-fit">
            <Skeleton className="h-5 w-40 mb-5 rounded" />
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center gap-5">
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                </div>
                <div className="flex justify-between items-center gap-5">
                    <Skeleton className="h-5 w-28 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                </div>
                <div className="flex justify-between items-center gap-5">
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                </div>
            </div>
            <Separator className="my-7" />
            <div className="flex justify-between items-center gap-5">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
            </div>
            <Skeleton className="w-full h-10 rounded-3xl mt-5" />
        </div>
    );
};
