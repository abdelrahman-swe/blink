"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface ProductSortingProps {
    sort: string;
    onSortChange: (value: string) => void;
}

const ProductSorting = ({ sort, onSortChange }: ProductSortingProps) => {
    const { home } = useDictionary();
    const sorting = home?.sorting || {};
    const sortByLabel = sorting?.sortBy || "Sort By";

    return (
        <Select value={sort || "new-arrivals"} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] px-3">
                <SelectValue placeholder={sortByLabel} />
            </SelectTrigger>
            <SelectContent className="ms-0">
                <SelectGroup>
                    <SelectItem value="new-arrivals">{sorting.newArrivals}</SelectItem>
                    <SelectItem value="best_selling">{sorting.bestSelling}</SelectItem>
                    <SelectItem value="top_rated">{sorting.topRated}</SelectItem>
                    <SelectItem value="price_high">{sorting.priceHigh}</SelectItem>
                    <SelectItem value="price_low">{sorting.priceLow}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default ProductSorting;