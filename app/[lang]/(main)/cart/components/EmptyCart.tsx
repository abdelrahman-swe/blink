import AppLink from '@/components/common/AppLink';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export function EmptyCart() {
    const { cart } = useDictionary();
    return (
        <div className="flex flex-col gap-5 justify-center items-center py-10">
            <Image
                src="/no-cart.png"
                alt={cart?.cart?.emptyCart?.altText}
                width={200}
                height={200}
                className="rounded-xl"
                loading='eager'
                style={{ width: "auto", height: "auto" }}
            />
            <Button
                asChild
                className="rounded-3xl w-50 text-md font-semibold"
                aria-label={cart?.cart?.emptyCart?.continueShopping}
            >
                <AppLink href="/">
                    {cart?.cart?.emptyCart?.continueShopping}
                </AppLink>
            </Button>
        </div>
    );
}
