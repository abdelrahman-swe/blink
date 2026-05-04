import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CloudUploadIcon
} from "@hugeicons/core-free-icons";


export const ReturnOrderSkeleton = () => {
  return (
    <main className="bg-white min-h-screen animate-pulse">
      <div className="xl:container mx-auto px-5 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Product Selection Card Skeleton */}
        <div className="bg-background rounded-md border border-gray-100 shadow-xs mt-5 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40 rounded-full" />
            </div>

          </div>

          {/* All Products row placeholder */}
          <div className="flex items-center bg-gray-50 gap-2 mt-4 py-3 px-5 -mx-5 mb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Product List */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Skeleton className="h-5 w-5 rounded shrink-0" />
                  <Skeleton className="w-[80px] h-[70px] rounded-md shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[250px]" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Skeleton className="h-10 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Reasons Skeleton */}
        <div className="mt-8 space-y-6">
          <Skeleton className="h-5 w-40 rounded-full" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-64" />
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload Skeleton */}
        <div className="mt-10 space-y-6">
          <Skeleton className="h-5 w-40 rounded-full" />
          <div className="border border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center gap-4">
            <HugeiconsIcon
              icon={CloudUploadIcon}
              size={30}
              color="currentColor"
              strokeWidth={1.5}
            />
            <Skeleton className="h-4 w-full max-w-[320px]" />
            <div className="bg-primary p-2 rounded-md text-white">
              <HugeiconsIcon
                icon={Add01Icon}
                size={22}
                color="currentColor"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Submit Button Skeleton */}
        <div className="mt-12 flex justify-end">
          <Skeleton className="h-12 w-full md:w-50 rounded-4xl" />
        </div>
      </div>
    </main>
  );
};

export default ReturnOrderSkeleton;