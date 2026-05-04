'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import CategoryFilters from "./CategoryFilters";
import { Product, Brand } from "@/utils/types/categories";
import { X } from "lucide-react";
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from "@hugeicons/core-free-icons";
import { useDictionary } from "@/components/providers/DictionaryProvider";
interface Category {
    name: string;
    slug?: string;
}

interface CategoryFiltersWrapperProps {
    range: number[];
    onRangeChange: (range: number[]) => void;
    onAvailabilityChange?: (availability: boolean | undefined) => void;
    products: Product[];
    topBrands: Brand[];
    categories?: Category[];
    fetchFilteredProducts: (filters: any) => void;
    isBrandsLoading: boolean;
    isCategoriesLoading: boolean;
    selectedBrands?: string[];
    selectedCategories?: string[];
    availability?: boolean;
}

export default function CategoryFiltersWrapper(props: CategoryFiltersWrapperProps) {
    const { home } = useDictionary();
    const { filteration } = home;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            {/* Mobile/Tablet: Filter Button */}
            <div className="lg:hidden">
                <Button
                    onClick={(e) => {
                        e.currentTarget.blur();
                        setIsDrawerOpen(true);
                    }}
                    variant="outline"
                    className="w-40 rounded-full text-md font-semibold flex items-center justify-center gap-2"
                    size="icon-sm"
                >
                    <HugeiconsIcon
                        icon={FilterIcon}
                        size={23}
                        color="currentColor"
                        strokeWidth={1.5}
                    />
                    {filteration.filter}
                </Button>
            </div>

            {/* Mobile/Tablet: Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
                <DrawerContent className="overflow-y-auto no-scrollbar" aria-describedby={undefined}>
                    <DrawerHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DrawerTitle className="text-xl font-bold">{filteration.filter}</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto no-scrollbar">
                        <CategoryFilters {...props} onClose={() => setIsDrawerOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Desktop: Inline Filters */}
            <div className="hidden lg:block lg:sticky lg:top-40 h-fit">
                <CategoryFilters {...props} />
            </div>
        </>
    );
}
