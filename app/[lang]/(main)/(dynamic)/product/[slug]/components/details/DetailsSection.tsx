import { useDictionary } from "@/components/providers/DictionaryProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetails } from "@/utils/types/product";

interface DetailsSectionProps {
    product?: ProductDetails | null;
    isLoading: boolean;
}

export const DetailsSection = ({ product, isLoading }: DetailsSectionProps) => {
    const { product: productDict } = useDictionary();
    const t = productDict;
    return (
        <div className="my-8">
            <h3 className="text-xl font-semibold mb-4">{t.details.overview}</h3>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                    </div>
                ) : (
                    <ul className="leading-7 text-neutral-700 max-w-3xl list-disc ps-5 space-y-2">
                        {product?.description
                            ?.replace(/\\n/g, "\n") 
                            ?.split("\n")
                            .filter(line => line.trim() !== "")
                            .map((line, index) => (
                                <li key={index}>
                                    {line.replace(/^•\s*/, "")}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
