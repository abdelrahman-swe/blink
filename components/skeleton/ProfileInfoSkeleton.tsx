import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const ProfileInfoSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-7 w-48 mb-6" /> {/* Title */}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-full w-16 h-16" /> {/* Avatar */}
          <Skeleton className="h-4 w-32" /> {/* Edit photo text */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label */}
          <Skeleton className="h-11 w-full rounded-md" /> {/* Input */}
        </div>
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-11 w-full rounded-md" /> {/* Input */}
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" /> {/* Label */}
        <Skeleton className="h-11 w-full rounded-md" /> {/* Input */}
      </div>

      <Separator className="bg-gray-200" />
    </div>
  );
};

export const ProfileAddressSkeleton = () => {
  return (
    <div className="mt-8 space-y-6 animate-pulse">
      <Skeleton className="h-7 w-32" /> {/* Title */}

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-neutral-200 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" /> {/* Label tag */}
                  <Skeleton className="h-5 w-3/4" /> {/* Address line 1 */}
                  <Skeleton className="h-4 w-32" /> {/* Phone */}
                </div>
                <Skeleton className="h-8 w-12" /> {/* Edit button */}
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-neutral-100 pt-3">
              <Skeleton className="h-4 w-40" /> {/* Default address text */}
              <Skeleton className="h-6 w-6" /> {/* Delete icon */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};