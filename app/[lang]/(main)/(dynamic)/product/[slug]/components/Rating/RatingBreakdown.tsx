import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface BreakdownItem {
    rating: number;
    count: number;
    percentage: number;
}

interface RatingBreakdownProps {
    breakdown: BreakdownItem[];
    isLoading?: boolean;
}

export const RatingBreakdown = ({ breakdown, isLoading }: RatingBreakdownProps) => {
    if (isLoading) {
        return (
            <div className="flex-1 w-full space-y-4 flex flex-col justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-2.5 flex-1 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 w-full space-y-3 md:space-y-4 flex flex-col justify-center">
            {breakdown.map((item) => (
                <div key={item.rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[40px]">
                        <span className="text-sm font-medium">{item.rating}</span>
                        <HugeiconsIcon
                            icon={StarIcon}
                            size={16}
                            fill="#FFB833"
                            color="#FFB833"
                            strokeWidth={1.5}
                        />
                    </div>
                    <Progress value={item.percentage} className="flex-1" />
                    <span className="text-xs text-neutral-400 min-w-[30px] text-right">
                        {Math.round(item.percentage)}%
                    </span>
                </div>
            ))}
        </div>
    );
};
