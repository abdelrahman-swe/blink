"use client";

import React from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { QuantityInput } from "@/components/settings/QuantityInput";

interface ReturnProductItemProps {
    product: any;
    isSelected: boolean;
    itemQuantity: number;
    currency: string;
    onSelect: (checked: boolean) => void;
    onQuantityChange: (val: number) => void;
    isLast: boolean;
}

export const ReturnProductItem: React.FC<ReturnProductItemProps> = ({
    product,
    isSelected,
    itemQuantity,
    currency,
    onSelect,
    onQuantityChange,
    isLast,
}) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-5">
                <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Field orientation="horizontal">
                            <Checkbox
                                id={`product-${product.product_id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => onSelect(checked as boolean)}
                                className="bg-neutral-200!"
                            />
                        </Field>
                        {product.image?.original && (
                        <Image
                            src={product.image?.original || "/product.png"}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-[80px] h-[70px] object-center object-contain border border-gray-200"
                        />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">
                                {product.unit_price} {currency}
                            </span>
                            <span className="font-semibold text-sm">x{product.quantity}</span>
                        </p>
                    </div>
                </div>

                {product.quantity > 1 && (
                    <div className="w-[fit] ">
                        <QuantityInput
                            min={1}
                            max={product.quantity}
                            value={itemQuantity}
                            onChange={onQuantityChange}
                            isLoading={false}
                            disabled={!isSelected}
                        />
                    </div>
                )}
            </div>

            {!isLast && <Separator />}
        </>
    );
};
