import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const ProductsSkeleton = () => {
    return (
        <div className="rounded-lg p-5 space-y-8 border border-gray-200 mt-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-xl font-semibold mb-2"><Skeleton className="h-7 w-30" /></h3>
                <Skeleton className="h-8 w-40 rounded-md" />
            </div>
            <Separator className="mt-5 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="w-full flex flex-col h-full">
                        {/* image */}
                        <Skeleton className="w-full h-[250px] rounded-t-xl" />

                        <div className="bg-background flex flex-col flex-1 space-y-2">
                            <CardHeader className="py-3 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-1/3" />
                            </CardHeader>

                            <CardContent className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </CardContent>

                            <CardFooter className="mt-auto">
                                <Skeleton className="h-10 w-full rounded-3xl" />
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
