import React, { useState, useEffect } from "react";
import AppLink from '@/components/common/AppLink';
import Image from "next/image";
import { createPortal } from "react-dom";

import type { Brand, Category } from "@/utils/types/categories";

import { useDictionary } from "../providers/DictionaryProvider";

interface MegaDropdownPortalProps {
    subcategory: Category;
    topBrands?: Brand[];
    isOpen: boolean;
    anchorRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onMouseEnter: () => void;
    lang?: string;
}

export default function MegaDropdownPortal({
    subcategory,
    topBrands,
    isOpen,
    anchorRef,
    onClose,
    onMouseEnter,
    lang = "en",
}: MegaDropdownPortalProps) {
    const { home: homeDict } = useDictionary();
    const [top, setTop] = useState(0);

    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setTop(rect.bottom + window.scrollY);
        }
    }, [isOpen, anchorRef]);

    if (!isOpen || typeof window === "undefined") return null;

    const subSubCats = subcategory.children ?? [];
    const brands = topBrands ?? subcategory.top_brands ?? [];

    return createPortal(
        <div
            className="absolute left-0 w-screen z-40"
            style={{ top }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onClose}
        >
            <div className="bg-background shadow-2xl">
                <div className="container mx-auto px-6 py-6">
                    <div className="grid grid-cols-12 gap-6">

                        {/* LEFT SIDE */}
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg font-medium mb-4">{subcategory.name}</h3>

                            <div className="space-y-3">
                                {subSubCats.map((child) => (
                                    <AppLink
                                        key={child.slug}
                                        href={`/${lang}/category/${child.slug}`}
                                        className="block text-md text-[#4D4D4D] hover:text-primary transition"
                                        onClick={onClose}
                                    >
                                        - {child.name}
                                    </AppLink>
                                ))}
                            </div>
                            <hr className="border border-gray-200 my-4" />

                            {brands.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-medium mb-3">{homeDict.header.topBrands}</h4>
                                    <div className="flex flex-wrap gap-5">
                                        {brands.map((brand) => (
                                            <AppLink
                                                key={brand.slug}
                                                href={`/${lang}/brand/${brand.slug}`}
                                                className="flex items-center transition-transform hover:scale-105"
                                                onClick={onClose}
                                            >
                                                <Image
                                                    src={brand.images?.original || "/placeholder.png"}
                                                    alt={brand.name}
                                                    width={70}
                                                    height={70}
                                                    className="w-[70px] h-[60px] rounded-xl object-contain"
                                                    loading="lazy"
                                                />
                                            </AppLink>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT SIDE IMAGE */}
                        <div className="col-span-12 md:col-span-6 flex justify-center items-center">
                            <div className="hidden md:block relative w-full h-[320px] overflow-hidden rounded-3xl bg-neutral-50 shadow-sm">
                                {subcategory.images?.original && (
                                    <Image
                                        src={subcategory.images.original}
                                        alt={subcategory.name || "Subcategory"}
                                        fill
                                        className="object-cover object-center translate-x-0"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
