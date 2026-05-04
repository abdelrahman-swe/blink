import { slideWidths } from "@/utils/carousel";
import { Card } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

export default function ProductsCarouselLoading() {
  return Array.from({ length: 6 }).map((_, i) => (
    <CarouselItem key={`skeleton-${i}`} className={slideWidths}>
      <Card className="flex h-full flex-col">
        <Skeleton className="h-[260px] w-full rounded-t-xl" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full rounded-3xl" />
        </div>
      </Card>
    </CarouselItem>
  ));
}
