import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const FiltersSkeleton = () => {
    return (
        <div className="rounded-lg p-8 space-y-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-3"></h2>

            {/* ---------- PRICE SECTION ---------- */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-32 mb-5" />

                {/* Min/max price boxes */}
                <div className="flex justify-center gap-5">
                    <Skeleton className="h-10 w-50 rounded-md" />
                    <Skeleton className="h-10 w-50 rounded-md" />
                </div>
            </div>

            <Separator />

            {/* ---------- CATEGORY SECTION ---------- */}
            <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                ))}
            </div>

            <Separator />

            {/* ---------- BRAND SECTION ---------- */}
            <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                ))}
            </div>

            <Separator />

            {/* ---------- AVAILABILITY SECTION ---------- */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>

            <Separator />

            {/* ---------- SORT SECTION ---------- */}
            <div className="flex justify-center gap-5">
                <Skeleton className="h-10 w-50  rounded-xl" />
                <Skeleton className="h-10 w-50  rounded-xl" />
            </div>

        </div>
    );
};
