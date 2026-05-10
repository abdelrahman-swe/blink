"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { getContactUsQuery } from "@/hooks/queries/useLegalQueries";


export default function ContactUs() {
    const { data, isLoading, error } = getContactUsQuery();

    if (isLoading) {
        return (
            <section>
                <div className="bg-secondary p-10 text-center">
                    <Skeleton className="h-8 w-64 mx-auto" />
                </div>
                <div className="container mx-auto py-10 space-y-4">
                    <Skeleton className="h-6 w-full " />
                    <Skeleton className="h-6 w-full " />
                    <Skeleton className="h-6 w-3/4 " />
                    <Skeleton className="h-6 w-full " />
                    <Skeleton className="h-6 w-5/6 " />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="bg-secondary p-10 text-center">
                    <h1 className="text-2xl font-bold mb-2 text-red-600">Error</h1>
                </div>
                <div className="container mx-auto py-10">
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-500 text-lg">Failed to load return policy. Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="bg-secondary p-10 text-center">
                <h1 className="text-2xl font-bold mb-2">{data?.data.title}</h1>
            </div>
            <div className="container mx-auto py-10 px-6">
                <div
                    className="text-lg prose prose-lg max-w-none leading-10"
                    dangerouslySetInnerHTML={{ __html: data?.data.content || '' }}
                />
            </div>
        </section>
    );
}
