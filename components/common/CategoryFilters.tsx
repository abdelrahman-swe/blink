

'use client';

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Product, Brand } from "@/utils/types/categories";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { Label } from "../ui/label";
import { useLoadingStore } from "@/store/useLoadingStore";

interface Category {
    name: string;
    slug?: string;
}

const filterSchema = z.object({
    priceRange: z
        .array(z.union([z.number().min(0, "Price cannot be negative"), z.literal("")]))
        .length(2)
        .superRefine(([min, max], ctx) => {
            const minVal = min === "" ? 0 : min;
            const maxVal = max === "" ? 10000000 : max;
            if (minVal > maxVal) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Min price cannot be greater than Max price",
                });
            }
        }),
    brands: z.array(z.string()),
    categories: z.array(z.string()),
    inStock: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface CategoryFiltersProps {
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
    onClose?: () => void;
}

export default function CategoryFilters({
    topBrands,
    categories,
    range,
    onRangeChange,
    onAvailabilityChange,
    fetchFilteredProducts,
    isBrandsLoading,
    isCategoriesLoading,
    selectedBrands = [],
    selectedCategories = [],
    availability,
    onClose,
}: CategoryFiltersProps) {
    const { startLoading, stopLoading } = useLoadingStore();
    const { home } = useDictionary();
    const { filteration } = home;
    const { control, reset, handleSubmit, setValue, formState: { errors, isValid } } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
        mode: "onChange",
        defaultValues: {
            priceRange: [range[0] === 0 ? "" : range[0], range[1] === 10000000 ? "" : range[1]],
            brands: selectedBrands,
            categories: selectedCategories,
            inStock: availability === true ? "in-stock" : availability === false ? "out-of-stock" : "",
        },
    });

    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        setValue('brands', selectedBrands);
        setValue('categories', selectedCategories);
        setValue('priceRange', [range[0] === 0 ? "" : range[0], range[1] === 10000000 ? "" : range[1]]);
        setValue('inStock', availability === true ? "in-stock" : availability === false ? "out-of-stock" : "");
    }, [selectedBrands, selectedCategories, range, availability, setValue]);

    const handleApplyFilters = handleSubmit((data: FilterFormData) => {
        startLoading();
        const min = data.priceRange[0] === "" ? 0 : data.priceRange[0];
        const max = data.priceRange[1] === "" ? 10000000 : data.priceRange[1];
        const newRange = [min, max];

        let availabilityValue: boolean | undefined;
        if (data.inStock === "in-stock") availabilityValue = true;
        else if (data.inStock === "out-of-stock") availabilityValue = false;
        else availabilityValue = undefined;

        onRangeChange(newRange);
        if (onAvailabilityChange) onAvailabilityChange(availabilityValue);
        fetchFilteredProducts({
            priceRange: newRange,
            availability: availabilityValue,
            brands: data.brands,
            categories: data.categories,
        });

        // Close drawer if callback is provided
        if (onClose) onClose();
        setTimeout(stopLoading, 500);
    });

    const handleResetFilters = () => {
        startLoading();
        setResetKey(prev => prev + 1);
        const defaultRange = [0, 10000000];
        onRangeChange(defaultRange);
        if (onAvailabilityChange) onAvailabilityChange(undefined);

        reset({
            priceRange: ["", ""],
            brands: [],
            categories: [],
            inStock: "",
        });

        fetchFilteredProducts({
            priceRange: defaultRange,
            availability: undefined,
            brands: [],
            categories: [],
        });

        // Close drawer if callback is provided
        if (onClose) onClose();
        setTimeout(stopLoading, 500);
    };

    const displayCategories = React.useMemo(() => {
        const cats = [...(categories || [])];
        selectedCategories.forEach(selectedCategory => {
            if (!cats.some(c => c.slug === selectedCategory || c.name === selectedCategory)) {
                cats.push({ name: selectedCategory, slug: selectedCategory });
            }
        });
        return cats;
    }, [categories, selectedCategories]);

    const displayBrands = React.useMemo(() => {
        const brands = [...(topBrands || [])];
        selectedBrands.forEach(selectedBrand => {
            if (!brands.some(b => b.slug === selectedBrand || b.name === selectedBrand)) {
                brands.push({ name: selectedBrand, slug: selectedBrand } as Brand);
            }
        });
        return brands;
    }, [topBrands, selectedBrands]);

    return (
        <div className="bg-[#F5F5F5] rounded-xl p-4 lg:p-6 no-scrollbar h-fit">
            <h2 className="text-xl font-semibold lg:block hidden mb-3" id="filter-heading">{filteration.filter}</h2>

            <form onSubmit={handleApplyFilters} aria-labelledby="filter-heading">
                {/* PRICE FILTER */}
                <div>
                    <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{filteration.price}</h3>
                    <div className="space-y-4" role="group" aria-labelledby="price-filter">
                        <div className="flex items-center gap-3">
                            <Controller
                                name="priceRange"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative flex-1">
                                        <Input
                                            id="min-price"
                                            type="number"
                                            min={0}
                                            value={field.value[0]}
                                            aria-invalid={!!errors.priceRange}
                                            aria-errormessage="price-error"
                                            onChange={(e) => {
                                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                                field.onChange([val, field.value[1]]);
                                            }}
                                            className={`${errors.priceRange ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            placeholder={filteration.min}
                                        />
                                    </div>
                                )}
                            />
                            <span>{filteration.to}</span>
                            <Controller
                                name="priceRange"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative flex-1">
                                        <Input
                                            id="max-price"
                                            type="number"
                                            min={0}
                                            value={field.value[1]}
                                            aria-invalid={!!errors.priceRange}
                                            aria-errormessage="price-error"
                                            onChange={(e) => {
                                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                                field.onChange([field.value[0], val]);
                                            }}
                                            className={`${errors.priceRange ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            placeholder={filteration.max}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {errors.priceRange && (
                            <p id="price-error" className="text-red-500 text-xs mt-1" role="alert">
                                {typeof errors.priceRange.message === 'string' ? errors.priceRange.message : "Invalid price range"}
                            </p>
                        )}
                    </div>
                </div>

                <Separator className="my-6" />

                {/* CATEGORY FILTER */}
                {displayCategories && (
                    <>
                        <div className="mb-6 ">
                            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{filteration.category}</h3>
                            <div className="max-h-[120px] pr-4 overflow-y-scroll no-scrollbar" role="group" aria-labelledby="category-filter">
                                {isCategoriesLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />)}
                                    </div>
                                ) : displayCategories.length > 0 ? (
                                    <div className="space-y-3">
                                        {displayCategories.map((category, index) => (
                                            <Controller
                                                key={category.slug || category.name}
                                                name="categories"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            checked={field.value.includes(category.slug || category.name)}
                                                            onCheckedChange={(checked) => {
                                                                const categoryId = category.slug || category.name;
                                                                if (checked) field.onChange([...field.value, categoryId]);
                                                                else field.onChange(field.value.filter((n: string) => n !== categoryId));
                                                            }}
                                                            className="bg-neutral-200!"
                                                        />
                                                        <label htmlFor={`category-${index}`} className="text-sm cursor-pointer select-none leading-none">
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                )}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-400 italic">{filteration.notAvailable}</p>
                                )}
                            </div>
                        </div>

                        <Separator className="my-6" />
                    </>
                )}

                {/* BRAND FILTER */}
                {displayBrands && (
                    <>
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{filteration.brand}</h3>
                            <div className="max-h-[120px] pr-4 overflow-y-scroll no-scrollbar" role="group" aria-labelledby="brand-filter">
                                {isBrandsLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />)}
                                    </div>
                                ) : displayBrands.length > 0 ? (
                                    <div className="space-y-3">
                                        {displayBrands.map((brand, index) => (
                                            <Controller
                                                key={brand.name}
                                                name="brands"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            checked={field.value.includes(brand.name)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) field.onChange([...field.value, brand.name]);
                                                                else field.onChange(field.value.filter((n: string) => n !== brand.name));
                                                            }}
                                                            className="bg-neutral-200!"
                                                        />
                                                        <label htmlFor={`brand-${index}`} className="text-sm cursor-pointer select-none leading-none">
                                                            {brand.name}
                                                        </label>
                                                    </div>
                                                )}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-400 italic">{filteration.noBrandsAvailable}</p>
                                )}
                            </div>
                        </div>

                        <Separator className="my-6" />
                    </>
                )}

                {/* AVAILABILITY FILTER */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{filteration.availability}</h3>
                    <Controller
                        name="inStock"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                role="radiogroup"
                                aria-label="Availability"
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:pr-4">
                                    <RadioGroupItem value="in-stock" />
                                    <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                                        {filteration.inStock}
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:pr-4">
                                    <RadioGroupItem value="out-of-stock" />
                                    <Label htmlFor="out-of-stock" className="text-sm font-normal cursor-pointer">
                                        {filteration.outOfStock}
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap flex-col md:flex-row justify-start items-stretch gap-3 w-full">
                    <Button
                        type="submit"
                        className="rounded-full font-semibold w-full md:w-full "
                        size="lg"
                        disabled={!isValid}
                        aria-label="Apply filters"
                    >
                        {filteration.apply}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full font-semibold w-full md:w-full bg-transparent! "
                        onClick={handleResetFilters}
                        aria-label="Reset filters"
                    >
                        {filteration.reset}
                    </Button>
                </div>

            </form>

        </div>
    );
}