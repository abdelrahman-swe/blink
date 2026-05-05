'use client'; import { useAppRouter } from '@/hooks/useAppRouter';

import { useState, useRef } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, FavouriteIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Heart } from "lucide-react";
import { useAddToCartQuery, useCartPrefetch } from "@/hooks/queries/useCartQueries";
import { useProductPrefetch } from "@/hooks/queries/useProductQueries";
import ProductsError from "../common/ProductsError";
import ProductsSwiperLoading from "../loading/ProductsCarouselLoading";
import { CarouselDots } from "./CarouselDots";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { Product } from "@/utils/types/home";
import { useToggleUserFavorites } from "@/hooks/queries/useUserQueries";
import { useUserStore } from "@/store/useUserStore";
import { LoginRequiredDialog } from "../common/LoginRequiredDialog";
import { useDictionary } from "../providers/DictionaryProvider";
import { slideWidths } from '@/utils/carousel';

type Props = {
  products?: Product[];
  isLoading?: boolean;
  error?: Error | null;
};

export default function ProductCardCarousel({
  products = [],
  isLoading = false,
  error = null
}: Props) {
  const { startLoading, stopLoading } = useLoadingStore();
  const { product: productDict } = useDictionary();
  const tProd = productDict;
  const params = useParams();
  const router = useAppRouter();
  const lang = params.lang as string;

  const id = Number(params.id);

  const { mutate: addToCart } = useAddToCartQuery();
  const { mutate: toggleFavorite } = useToggleUserFavorites();
  const prefetchProduct = useProductPrefetch();
  const prefetchCart = useCartPrefetch();

  const { isAuthenticated } = useUserStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    toggleFavorite(product.id);
  };


  const [api, setApi] = useState<CarouselApi | null>(null);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);

  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (error) return <ProductsError error={error} />;

  return (
    <>
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{ align: "start", loop: products.length > 4 }}
        className="w-full"
        onMouseEnter={() => {
          if (api) autoplay.current?.stop?.();
        }}
        onMouseLeave={() => {
          if (api) {
            try {
              autoplay.current?.reset?.();
              autoplay.current?.play?.();
            } catch (e) {
              // ignore if plugin internals crash when empty
            }
          }
        }}
      >
        <CarouselContent className="items-stretch">
          {isLoading ? (
            <ProductsSwiperLoading />
          ) : (
            products.map((product) => {
              return (
                <CarouselItem key={product.id} className={`${slideWidths } flex`}>
                  <Card
                    className="w-full sm:w-[300px] flex flex-col gap-3 cursor-pointer shadow-2xs ease-in duration-300 transition-all group border border-[#e6e6e6]"
                    onMouseEnter={() => {
                      const timer = setTimeout(() => {
                        prefetchProduct(product.slug);
                      }, 50);
                      (window as any)[`prefetch_carousel_${product.id}`] = timer;
                    }}
                    onMouseLeave={() => {
                      if ((window as any)[`prefetch_carousel_${product.id}`]) {
                        clearTimeout((window as any)[`prefetch_carousel_${product.id}`]);
                      }
                    }}
                  >

                    {/* Product Image */}
                    <div className="relative ">


                      <AppLink href={`/${lang}/product/${product.slug}`}
                        className="block no-underline "
                      >
                        <Image
                          src={
                            product?.image?.original || product?.images?.original ||
                            "/placeholder.png"
                          }
                          alt={product.name}
                          width={300}
                          height={220}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="w-full h-[200px] object-cover rounded-t-2xl "
                        />
                      </AppLink>

                      {/* Discount Badge */}
                      {product.discount_percentage && product.discount_percentage > 0 && (
                        <span className="absolute top-2 left-2 bg-primary text-background py-1 px-4 rounded-2xl text-sm font-medium">
                          {tProd?.card?.off?.replace("{percentage}", Math.round(product.discount_percentage).toString()) || `${Math.round(product.discount_percentage)} % Off`}
                        </span>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className={`absolute top-2 right-5 z-10 px-4 border-none transition-all duration-300 ${!!product.is_favorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        onClick={(e) => handleToggleFavorite(e, product)}
                      >
                        <HugeiconsIcon
                          icon={FavouriteIcon}
                          size={24}
                          color={!!product.is_favorite ? "#dc2626" : "#000000"}
                          fill={!!product.is_favorite ? "#dc2626" : "transparent"}
                          strokeWidth={1.5}
                        />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="bg-background dark:bg-transparent! flex flex-col flex-1 space-y-2">
                      <CardHeader className="gap-2 px-2">
                        <h3 className="text-md font-semibold line-clamp-1">{product.name}</h3>

                        {/* Prices */}

                        <CardDescription className="flex gap-4 items-center text-md font-semibold">
                          {product.deal_price ? (
                            <>
                              <span className="text-md font-semibold text-primary">{product.deal_price} {tProd?.currency}</span>
                              <span className="line-through text-sm font-medium text-muted-foreground">{product.price} {tProd?.currency}</span>
                            </>
                          ) : product.sale_price ? (
                            <>
                              <span className="text-md font-semibold text-primary">{product.sale_price} {tProd?.currency}</span>
                              <span className="line-through text-sm font-medium text-muted-foreground">{product.price} {tProd?.currency}</span>
                            </>
                          ) : (
                            <span className="text-md font-semibold text-primary">{product.price} {tProd?.currency}</span>
                          )}
                        </CardDescription>

                      </CardHeader>

                      <CardContent className="flex items-center justify-between px-2">
                        <div className="">
                          {Number(product.reviews_count) > 0 && (
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon
                                icon={StarIcon}
                                size={24}
                                color="#FFB833"
                                fill="#FFB833"
                                strokeWidth={1.5}
                              />
                              <span className="font-semibold text-sm">
                                {Number(product.avg_rating).toFixed(1)}
                              </span>
                              <span className="text-neutral-500 text-sm">
                                {tProd?.card?.reviews?.replace("{count}", product.reviews_count?.toString() || "0")}
                              </span>
                            </div>
                          )}
                        </div>
                        {!product.in_stock && <span className="text-muted-foreground font-semibold ms-auto text-sm">{tProd?.stock?.outOfStock}</span>}
                      </CardContent>

                      {/* Add to Cart */}
                      <CardFooter className="mt-auto px-3">
                        <Button
                          className="flex-1 rounded-3xl"
                          disabled={!product.in_stock}
                          loading={pendingProductId === product.id}
                          onClick={() => {
                            startLoading();
                            setPendingProductId(product.id);
                            addToCart(
                              { product_id: product.id, quantity: 1 },
                              {
                                onSuccess: () => {
                                  stopLoading();
                                  setSelectedProduct(product);
                                  setShowAddToCartDialog(true);
                                  setPendingProductId(null);
                                },
                                onError: (error) => {
                                  stopLoading();
                                  toast.error(getApiErrorMessage(error, `(${product.name}) ${tProd?.stock?.outOfStock}`));
                                  setPendingProductId(null);
                                },
                              }
                            );
                          }}
                        >
                          {tProd?.card?.addToCart}
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })
          )}
        </CarouselContent>
      </Carousel>

      <CarouselDots api={api} autoplay={autoplay} maxDots={6} inactiveBgClass="bg-white" />

      {/* Add to Cart Dialog */}
      <Dialog open={showAddToCartDialog} onOpenChange={setShowAddToCartDialog}>
        <DialogContent className="sm:max-w-lg space-y-2">
          <div className="flex flex-col sm:flex-row justify-start items-start gap-4 mt-5 md:mt-0!">

            <div className="relative">
              <Image
                src={selectedProduct?.image?.original || selectedProduct?.images?.original || "/placeholder.png"}
                alt={selectedProduct?.name || "Product"}
                width={100}
                height={100}
                loading="lazy"
                className="object-full p-1 object-center h-[100px] w-[130px] rounded-2xl border border-gray-200"
              />
              <div className="absolute -top-1.5 -right-3">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={24}
                  color="#3A923B"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-medium text-md md:text-lg">{tProd?.card?.addedToCart}</DialogTitle>
              <DialogDescription className="text-md">
                <span className="text-[#0D0D0D] whitespace-normal">
                  {selectedProduct?.name}
                </span>
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="mx-auto text-center space-x-2">
            <Button
              onClick={() => setShowAddToCartDialog(false)}
              className="text-md rounded-3xl w-full sm:w-[50%]"
            >
              {tProd?.card?.continueShopping}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddToCartDialog(false);
                startLoading();
                router.push(`/${lang}/cart`);
              }}
              onMouseEnter={prefetchCart}
              className="text-md rounded-3xl w-full sm:w-[50%]"
            >
              {tProd?.card?.viewCart}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        message={tProd?.card?.loginToFav}
      />
    </>
  );
}
