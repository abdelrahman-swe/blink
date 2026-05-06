"use client";

import AppLink from '@/components/common/AppLink';
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { QuantityInput } from "@/components/settings/QuantityInput";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { MergedCartItem } from "@/utils/mergeCartItems";
import { MergedCartPriceBreakdown } from "./MergedCartPriceBreakdown";

interface CartProductsProps {
    mergedItem: MergedCartItem;
    quantity: number;
    lang: string;
    isUpdatingQuantity: boolean;
    isRemoving: boolean;
    onQuantityChange: (newQuantity: number) => void;
    onRemove: () => void;
}

export function CartProducts({
    mergedItem,
    quantity,
    lang,
    isUpdatingQuantity,
    isRemoving,
    onQuantityChange,
    onRemove
}: CartProductsProps) {
    const { cart: cartDict } = useDictionary();
    const { cart } = cartDict;

    const effectiveMax = mergedItem.max_quantity_per_order
        ? Math.min(mergedItem.max_quantity_per_order, mergedItem.maxStock)
        : mergedItem.maxStock;
    const hasExplicitMax = mergedItem.max_quantity_per_order !== null;

    const isMerged = mergedItem.entries.length > 1;

    return (
        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-5 border-b border-gray-200 pb-5 last:pb-0 my-5 last:border-b-0">
            <AppLink href={`/${lang}/product/${mergedItem.slug}`}>
                <div className="flex justify-center items-center relative text-center">
                    <Image
                        src={mergedItem.image?.original || '/placeholder.png'}
                        alt={`${mergedItem.name} in cart`}
                        width={112}
                        height={112}
                        className="object-fill object-center h-[100px] w-[140px] rounded-sm"
                    />
                </div>
            </AppLink>

            <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg flex-1 whitespace-normal break-all">
                        {mergedItem.name}
                    </h3>
                    <div className="shrink-0">
                        <Button
                            size={isRemoving ? "default" : "icon-sm"}
                            type="button"
                            variant="ghost"
                            onClick={onRemove}
                            disabled={isRemoving}
                            className={isRemoving ? "h-auto p-0" : ""}
                        >
                            {isRemoving ? (
                                <div className="flex items-center gap-2">
                                    <Spinner color="red" />
                                    <p className="text-sm font-medium text-red-600">{cart.actions.removing}</p>
                                </div>
                            ) : (
                                <div>
                                    <HugeiconsIcon
                                        icon={Delete02Icon}
                                        size={22}
                                        color="black"
                                        strokeWidth={1.5}
                                        className="hover:text-red-600!"
                                    />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3">
                    <div className="flex flex-col items-start gap-3 flex-1">
                        {isMerged ? (
                            <MergedCartPriceBreakdown
                                entries={mergedItem.entries}
                                currency={cart.summary.currency}
                                dealLabel={cart?.card?.dealPrice}
                                regularLabel={cart?.card?.regularPrice}
                                offTemplate={cart?.card?.off}
                            />
                        ) : (
                            // Single item - original layout
                            <div className="flex flex-col text-lg font-semibold">
                                {mergedItem.entries[0].is_on_deal && mergedItem.entries[0].deal_price ? (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-primary font-bold text-lg">{mergedItem.entries[0].deal_price} {cart.summary.currency}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="line-through text-md text-[#999999] font-normal">{mergedItem.entries[0].price} {cart.summary.currency}</span>
                                            {mergedItem.entries[0].discount_percentage && mergedItem.entries[0].discount_percentage > 0 && (
                                                <aside className="text-md">
                                                    {cart?.card?.off?.replace("{percentage}", Math.round(mergedItem.entries[0].discount_percentage).toString()) || `${Math.round(mergedItem.entries[0].discount_percentage)}`}
                                                </aside>
                                            )}
                                        </div>
                                    </div>
                                ) : mergedItem.entries[0].sale_price ? (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold text-lg">{mergedItem.entries[0].sale_price} {cart.summary.currency}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="line-through text-md text-[#999999] font-normal">{mergedItem.entries[0].price} {cart.summary.currency}</span>
                                            {mergedItem.entries[0].discount_percentage && mergedItem.entries[0].discount_percentage > 0 && (
                                                <aside className="text-md">
                                                    {cart?.card?.off?.replace("{percentage}", Math.round(mergedItem.entries[0].discount_percentage).toString()) || `${Math.round(mergedItem.entries[0].discount_percentage)}`}
                                                </aside>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xl font-bold">{mergedItem.entries[0].price} {cart.summary.currency}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <QuantityInput
                            value={quantity}
                            onChange={onQuantityChange}
                            isLoading={isUpdatingQuantity}
                            max={effectiveMax}
                        />
                    </div>
                </div>

                {quantity >= effectiveMax && (
                    <p className="flex gap-2 items-center text-md text-destructive mt-3 sm:mt-0">
                        <HugeiconsIcon
                            icon={InformationCircleIcon}
                            size={24}
                            color="#E80000"
                            strokeWidth={1.5}
                        />
                        <span className="mt-1">
                            {hasExplicitMax && quantity >= (mergedItem.max_quantity_per_order ?? 0) && mergedItem.max_quantity_per_order <= mergedItem.maxStock
                                ? `Max ${mergedItem.max_quantity_per_order} per order`
                                : cart.stockWarning.replace('{count}', effectiveMax.toString())}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}
