import { ProductDetails } from "@/utils/types/product";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface SpecificationSectionProps {
    product?: ProductDetails | null;
}

export const SpecificationSection = ({ product }: SpecificationSectionProps) => {
    const { product: productDict } = useDictionary();
    const t = productDict;

    return (
        <section className="my-10">
            <h3 className="text-xl font-semibold mb-4">{t?.details?.aboutItem}</h3>
            <div className="bg-white rounded-lg">
                <div className=" divide-y divide-gray-100">
                    {!product?.specifications.length && (
                        <h1 className="text-center text-md font-semibold text-gray-500 mb-4">
                            {t?.details?.noSpecification}
                        </h1>
                    )}
                    {product?.specifications.map((spec, index) => (
                        <div
                            key={`${spec.name}-${index}`}
                            className=" py-3"
                        >

                            <span className="font-medium text-gray-900">
                                • {spec.name}
                            </span>

                            <span className="text-gray-600 mt-1 sm:mt-0 leading-relaxed ms-2 max-w-md break-all">
                                : {spec.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
