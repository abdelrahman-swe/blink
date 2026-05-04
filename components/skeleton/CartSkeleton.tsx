
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const CartProductSkeleton = () => {
    return (
        <>
            {[...Array(3)].map((_, index) => (
                <div key={`skeleton-${index}`} className="w-full flex flex-col md:flex-row items-start md:items-center gap-5 border-b border-gray-200 p-5 last:border-b-0">
                    <Skeleton className="w-[100px] h-[100px] rounded-lg shrink-0" />
                    <div className="w-full flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4 rounded" />
                                <Skeleton className="h-4 w-1/2 rounded" />
                            </div>
                            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-4 w-20 rounded" />
                            </div>
                            <Skeleton className="h-10 w-40 rounded-3xl" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export const CartSummarySkeleton = () => {
    return (
        <div className="col-span-12 lg:col-span-4 order-1 lg:order-2 border border-gray-100 rounded-xl p-7 shadow-xs h-fit">
            <Skeleton className="w-[150px] h-5 mb-5 rounded shrink-0" />
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
