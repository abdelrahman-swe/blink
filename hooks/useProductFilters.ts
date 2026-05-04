import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface FilterState {
    range: number[];
    availability: boolean | undefined;
    selectedBrands: string[];
    selectedCategories: string[];
    sort: string;
}

export interface PaginationState {
    currentPage: number;
}

export function useProductFilters(initialFilters?: Partial<FilterState>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper to get initial value from searchParams
    const getInitialRange = useCallback(() => {
        const min = searchParams.get('min_price');
        const max = searchParams.get('max_price');
        if (min !== null && max !== null) return [Number(min), Number(max)];
        return initialFilters?.range || [0, 10000000];
    }, [searchParams, initialFilters?.range]);

    const getInitialAvailability = useCallback(() => {
        const val = searchParams.get('availability');
        if (val === 'true') return true;
        if (val === 'false') return false;
        return initialFilters?.availability;
    }, [searchParams, initialFilters?.availability]);

    const getInitialBrands = useCallback(() => {
        const brands = searchParams.getAll('brands');
        return brands.length > 0 ? brands : (initialFilters?.selectedBrands || []);
    }, [searchParams, initialFilters?.selectedBrands]);

    const getInitialCategories = useCallback(() => {
        const categories = searchParams.getAll('categories');
        return categories.length > 0 ? categories : (initialFilters?.selectedCategories || []);
    }, [searchParams, initialFilters?.selectedCategories]);

    const getInitialSort = useCallback(() => {
        return searchParams.get('sort') || initialFilters?.sort || "";
    }, [searchParams, initialFilters?.sort]);

    const getInitialPage = useCallback(() => {
        return Number(searchParams.get('page')) || 1;
    }, [searchParams]);

    // Filter State
    const [range, setRange] = useState<number[]>(getInitialRange);
    const [availability, setAvailability] = useState<boolean | undefined>(getInitialAvailability);
    const [selectedBrands, setSelectedBrands] = useState<string[]>(getInitialBrands);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(getInitialCategories);
    const [sort, setSort] = useState<string>(getInitialSort);
    const [currentPage, setCurrentPage] = useState(getInitialPage);

    // Synchronize local state with searchParams (for back/forward navigation)
    useEffect(() => {
        setRange(getInitialRange());
        setAvailability(getInitialAvailability());
        setSelectedBrands(getInitialBrands());
        setSelectedCategories(getInitialCategories());
        setSort(getInitialSort());
        setCurrentPage(getInitialPage());
    }, [searchParams, getInitialRange, getInitialAvailability, getInitialBrands, getInitialCategories, getInitialSort, getInitialPage]);

    // Helper function to update URL
    const updateURL = useCallback((updates: Partial<FilterState & { page: number }>) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (updates.range !== undefined) {
            if (updates.range[0] === 0 && updates.range[1] === 10000000) {
                params.delete('min_price');
                params.delete('max_price');
            } else {
                params.set('min_price', updates.range[0].toString());
                params.set('max_price', updates.range[1].toString());
            }
        }
        
        if (updates.availability !== undefined) {
            params.set('availability', String(updates.availability));
        } else if ('availability' in updates) {
            params.delete('availability');
        }

        if (updates.selectedBrands !== undefined) {
            params.delete('brands');
            updates.selectedBrands.forEach(b => params.append('brands', b));
        }

        if (updates.selectedCategories !== undefined) {
            params.delete('categories');
            updates.selectedCategories.forEach(c => params.append('categories', c));
        }

        if (updates.sort !== undefined) {
            if (updates.sort) params.set('sort', updates.sort);
            else params.delete('sort');
        }

        if (updates.page !== undefined) {
            if (updates.page > 1) params.set('page', updates.page.toString());
            else params.delete('page');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        updateURL({ page });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [updateURL]);

    const handleSortChange = useCallback((value: string) => {
        setSort(value);
        setCurrentPage(1);
        updateURL({ sort: value, page: 1 });
    }, [updateURL]);

    const handleApplyFilters = useCallback((filters: {
        priceRange?: number[];
        availability?: boolean;
        brands?: string[];
        categories?: string[];
    }) => {
        const newRange = filters.priceRange || range;
        const newAvailability = filters.availability;
        const newBrands = filters.brands !== undefined ? filters.brands : selectedBrands;
        const newCategories = filters.categories !== undefined ? filters.categories : selectedCategories;

        setRange(newRange);
        setAvailability(newAvailability);
        setSelectedBrands(newBrands);
        setSelectedCategories(newCategories);
        setCurrentPage(1);

        updateURL({
            range: newRange,
            availability: newAvailability,
            selectedBrands: newBrands,
            selectedCategories: newCategories,
            page: 1
        });
    }, [range, selectedBrands, selectedCategories, updateURL]);

    const resetAllFilters = useCallback(() => {
        setRange([0, 10000000]);
        setAvailability(undefined);
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSort("");
        setCurrentPage(1);
        
        // Remove all filter params but keep others (like 'query' on search page)
        const params = new URLSearchParams(searchParams.toString());
        params.delete('min_price');
        params.delete('max_price');
        params.delete('availability');
        params.delete('brands');
        params.delete('categories');
        params.delete('sort');
        params.delete('page');
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return {
        // State
        range,
        availability,
        selectedBrands,
        selectedCategories,
        sort,
        currentPage,

        setRange,
        setAvailability,
        setSelectedBrands,
        setSelectedCategories,

        handlePageChange,
        handleSortChange,
        handleApplyFilters,
        resetAllFilters,
    };
}
