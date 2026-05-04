'use client';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface ProductsLoadingProps {
    lgCols?: number;
}

export default function ProductsLoading({ lgCols = 4 }: ProductsLoadingProps) {
    return (
        <section className=" overflow-hidden">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${lgCols} gap-5`}>
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="w-full">
                        <Skeleton className="h-[250px] w-full rounded-t-xl" />
                        <CardHeader className="py-0">
                            <Skeleton className="h-5 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full rounded-3xl" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
