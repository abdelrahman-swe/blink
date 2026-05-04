import AppLink from '@/components/common/AppLink';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export function EmptyProduct() {
    const { home } = useDictionary();
    const { emptyProducts } = home;

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 h-[400px] max-h-[500px]">
            <Image
                src="/no-product.png"
                alt="not-found"
                width={150}
                height={150}
                className="object-contain"
                loading="eager"
            />
            <p className="text-lg font-semibold my-4">
                {emptyProducts.noProductsFound}
            </p>
            <AppLink href="/">
                <Button className="rounded-4xl w-full px-10">
                    {emptyProducts.backToHome}
                </Button>
            </AppLink>
        </div>
    );
}
