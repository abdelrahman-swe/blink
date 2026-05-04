"use client";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft01Icon, ArrowRight01Icon, CancelCircleIcon, CircleArrowLeft01Icon, CircleArrowRight01Icon, SearchAddIcon, SearchMinusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import type { ProductDetails } from "@/utils/types/product";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductGalleryProps {
    images?: any;
    isLoading: boolean;
    product?: ProductDetails | null;
}

export const ProductGallery = ({
    images = [],
    isLoading,
    product,
}: ProductGalleryProps) => {
    const { product: productDict } = useDictionary();
    const isMobile = useIsMobile();
    const t = productDict;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    const safeImages = useMemo(
        () => {
            if (!images) return [];
            const imageArray = Array.isArray(images) ? images : [images];
            // Filter out invalid images
            return imageArray.filter(img => img?.original && typeof img.original === 'string');
        },
        [images]
    );

    const mainImage = useMemo(
        () => safeImages[selectedImageIndex]?.original ?? "/placeholder.png",
        [safeImages, selectedImageIndex]
    );

    // Validate images before passing to Lightbox
    const lightboxSlides = useMemo(() => {
        return safeImages.map(img => ({ 
            src: img.original,
            // Add fallback for failed images
            width: img.width || 1200,
            height: img.height || 800,
        }));
    }, [safeImages]);

    // Fix navigation to prevent out-of-bounds
    const goPrev = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const goNext = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) =>
            Math.min(prev + 1, safeImages.length - 1)
        );
    }, [safeImages.length]);

    // Handle image load errors
    const handleImageError = useCallback((index: number) => {
        setFailedImages(prev => new Set(prev).add(index));
        console.warn(`Failed to load image at index ${index}`);
    }, []);

    return (
        <div className="order-2 md:order-0 col-span-12 md:col-span-6 grid grid-cols-6 gap-4 h-fit">
            {/* Thumbnails */}
            <div
                className="col-span-6 lg:col-span-1 flex flex-row lg:flex-col items-center gap-2 rtl:gap-5 rtl:md:gap-2 order-2 lg:order-1
                   overflow-x-auto lg:overflow-y-auto no-scrollbar snap-x snap-mandatory w-full mb-8 md:mb-0 px-1"
                role="list"
                aria-label="Product image thumbnails"
            >
                {isLoading || safeImages.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="shrink-0 min-w-[90px] w-[90px] h-[90px] m-[2px]" />
                    ))
                ) : (
                    safeImages.map((image, index) => {
                        const hasError = failedImages.has(index);
                        return (
                            <Button
                                type="button"
                                size="icon-lg"
                                variant="ghost"
                                key={image.original ?? index}
                                onClick={() => setSelectedImageIndex(index)}
                                aria-label={`View image ${index + 1}`}
                                aria-current={index === selectedImageIndex}
                                className={`shrink-0 min-w-[90px] w-[90px] h-[90px] m-[2px] rounded-lg overflow-hidden border-2 transition-all snap-center
                                ${index === selectedImageIndex
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent hover:border-gray-200"
                                    }`}
                            >
                                {!hasError ? (
                                    <Image
                                        src={image.original}
                                        alt={`${product?.name ?? "Product"} thumbnail ${index + 1}`}
                                        width={90}
                                        height={90}
                                        className="object-fill w-full h-full md:h-fill object-center"
                                        loading="lazy"
                                        onError={() => handleImageError(index)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                        Failed to load
                                    </div>
                                )}
                            </Button>
                        );
                    })
                )}
            </div>

            {/* Main Image */}
            <div className="col-span-6 lg:col-span-5 order-1 lg:order-2">
                <div
                    className={`relative w-full aspect-10/7 lg:aspect-4/3 bg-white rounded-2xl
                     border border-gray-100 p-2 overflow-hidden group ${safeImages.length > 0 ? "cursor-pointer" : ""}`}
                    aria-live="polite"
                    onClick={() => {
                        if (safeImages.length > 0) setIsLightboxOpen(true);
                    }}
                >
                    {isLoading || safeImages.length === 0 ? (
                        <Skeleton className="w-full h-full rounded-xl" />
                    ) : (
                        <Image
                            src={mainImage}
                            alt={product?.name ?? "Product image"}
                            fill
                            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                            onError={() => handleImageError(selectedImageIndex)}
                        />
                    )}

                    {/* Discount Badge */}
                    {product?.discount_percentage && product.discount_percentage > 0 && (
                        <span className="absolute top-4 left-2 rtl:right-2 rtl:left-auto bg-primary text-white py-1.5 px-6 rounded-full
                             font-bold shadow-lg z-10 text-sm">
                            {t?.card?.off?.replace("{percentage}", Math.round(product.discount_percentage).toString()) || `${Math.round(product.discount_percentage)}% OFF`}
                        </span>
                    )}

                    {/* Navigation */}
                    {safeImages.length > 1 && (
                        <div className="absolute bottom-6 right-6 z-10 flex gap-7" onClick={(e) => e.stopPropagation()}>
                            <Button
                                type="button"
                                size="icon-lg"
                                variant="ghost"
                                onClick={goPrev}
                                disabled={selectedImageIndex === 0}
                                aria-label="Previous image"
                                className={`w-10 h-10 flex items-center justify-center rounded-lg
                                bg-white/90 backdrop-blur shadow-lg transition-all
                                 ${selectedImageIndex === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:scale-110 active:scale-95"
                                    }`}
                            >
                                <HugeiconsIcon
                                    icon={ArrowLeft01Icon}
                                    size={20}
                                    color="#000"
                                    strokeWidth={1.5}
                                    className="rtl:rotate-180"
                                />
                            </Button>

                            <Button
                                type="button"
                                size="icon-lg"
                                variant="ghost"
                                onClick={goNext}
                                disabled={selectedImageIndex === safeImages.length - 1}
                                aria-label="Next image"
                                className={`w-10 h-10 flex items-center justify-center rounded-lg
                               bg-white/90 backdrop-blur shadow-lg transition-all
                                ${selectedImageIndex === safeImages.length - 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:scale-110 active:scale-95"
                                    }`}
                            >
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    size={20}
                                    color="#000"
                                    strokeWidth={1.5}
                                    className="rtl:rotate-180"
                                />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Updated Lightbox with better Zoom configuration */}
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                index={selectedImageIndex}
                slides={lightboxSlides}
                plugins={[Zoom]}
                on={{
                    view: ({ index }) => setSelectedImageIndex(index),
                }}
                animation={{ zoom: 300 }}
                controller={{ closeOnBackdropClick: true }}
                // Add carousel to prevent issues
                carousel={{
                    finite: true,
                    preload: 2,
                }}
                // Configure zoom properly
                zoom={{
                    maxZoomPixelRatio: 2,
                    zoomInMultiplier: 2,
                }}
                styles={{
                    container: {
                        backgroundColor: "#ffffff",
                    },
                    button: {
                        color: "#0d0d0d",
                        fontSize: "16px",
                        filter: "none",
                    },
                    slide: {
                        borderRadius: "15px",
                    },
                }}
                render={{
                    iconZoomIn: () => <HugeiconsIcon
                        icon={SearchAddIcon}
                        size={25}
                        color="currentColor"
                        strokeWidth={1.5}
                    />,
                    iconZoomOut: () => <HugeiconsIcon
                        icon={SearchMinusIcon}
                        size={25}
                        color="currentColor"
                        strokeWidth={1.5}
                    />,
                    iconClose: () => <HugeiconsIcon
                        icon={CancelCircleIcon}
                        size={25}
                        color="currentColor"
                        strokeWidth={1.5}
                    />,
                    iconPrev: () => <HugeiconsIcon
                        icon={CircleArrowLeft01Icon}
                        size={25}
                        color="currentColor"
                        strokeWidth={1.5}
                    />,
                    iconNext: () => <HugeiconsIcon
                        icon={CircleArrowRight01Icon}
                        size={25}
                        color="currentColor"
                        strokeWidth={1.5}
                    />,
                }}
            />
        </div>
    );
};
