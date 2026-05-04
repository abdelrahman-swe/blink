import AppLink from '@/components/common/AppLink';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export function EmptyBrand() {
    const { home } = useDictionary();
    const t = home?.emptyProducts;

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 h-full">
            <Image
                src="/no-product.png"
                alt="not-found"
                width={150}
                height={150}
                className="object-contain"
                loading="eager"
            />
            <p className="text-lg font-semibold my-4">
                {t.noBrandsFound}
            </p>
            <AppLink href="/">
                <Button className="rounded-4xl w-full px-10">
                    {t.backToHome}
                </Button>
            </AppLink>
        </div>
    );
}
