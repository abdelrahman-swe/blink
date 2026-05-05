"use client";

import React from "react";
import { MergedCartItem } from "@/utils/mergeCartItems";

interface MergedCartPriceBreakdownProps {
    entries: MergedCartItem["entries"];
    currency: string;
    dealLabel?: string;
    regularLabel?: string;
    offTemplate?: string;
}

export function MergedCartPriceBreakdown({
    entries,
    currency,
    dealLabel,
    regularLabel,
    offTemplate,
}: MergedCartPriceBreakdownProps) {
    return (
        <div className="w-full grid grid-cols-[auto_auto_1fr] items-center gap-x-3 gap-y-3">
            {entries.map((entry, idx) => {
                const isDeal = entry.is_on_deal && entry.deal_price;
                const unitPrice = isDeal
                    ? entry.deal_price
                    : entry.sale_price || entry.price;

                return (
                    <React.Fragment key={entry.deal_id ?? `reg-${idx}`}>
                        {/* Quantity (e.g. x24) */}
                        <span className="text-[13px] font-bold text-black min-w-[28px]">
                            x{entry.quantity}
                        </span>

                        {/* Variant type badge */}
                        <div className="flex">
                            <span
                                className={`text-[13px] font-medium px-3 py-1 rounded-full whitespace-nowrap ${isDeal
                                        ? "bg-[#EBF4F6] text-[#3A8093]" // Light blue pill
                                        : "bg-[#E6E6E6] text-[#525252]" // Grey pill
                                    }`}
                            >
                                {isDeal ? dealLabel : regularLabel}
                            </span>
                        </div>

                        {/* Price Group */}
                        <div className="flex items-center gap-2.5 ml-2 flex-wrap">
                            {/* Current Price */}
                            <span className="font-bold text-[17px] text-black">
                                {unitPrice} {currency}
                            </span>

                            {/* Original price (strikethrough) */}
                            {(isDeal || entry.sale_price) && (
                                <span className="line-through text-[15px] text-[#999999] font-normal">
                                    {entry.price} {currency}
                                </span>
                            )}

                            {/* Discount */}
                            {entry.discount_percentage && entry.discount_percentage > 0 && (
                                <span className="text-[14px] font-semibold text-black">
                                    {offTemplate?.replace(
                                        "{percentage}",
                                        Math.round(entry.discount_percentage).toString()
                                    ) || `${Math.round(entry.discount_percentage)}% off`}
                                </span>
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
