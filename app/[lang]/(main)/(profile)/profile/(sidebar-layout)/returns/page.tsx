"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { useUserAllReturns } from "@/hooks/queries/useUserQueries";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { Return } from "@/utils/types/user";
import ProfileOrderSkeleton from "@/components/skeleton/ProfileOrderSkeleton";
import { RETURN_STATUS_CONFIG } from "@/helper";
import { useDictionary } from "@/components/providers/DictionaryProvider";


const Returns = () => {
  const params = useParams();
  const lang = params.lang as string;
  const { user: userDict } = useDictionary();
  const t = userDict?.profile?.returns;
  const { data: returns = [], isPending, error } = useUserAllReturns();

  return (
    <section className="xl:container mx-auto space-y-6 ">
      <h3 className="text-lg font-semibold">{t?.title}</h3>

      {isPending && <ProfileOrderSkeleton isLoading={isPending} />}
      {error && <p className="text-red-500">{t?.failedLoad}</p>}


      {!isPending && returns.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xs space-y-6 flex flex-col justify-center items-center p-8">
          <Image
            src="/returns.svg"
            alt="empty-returns"
            width={100}
            height={100}
          />
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="font-semibold text-lg">
              {t?.emptyTitle}
            </h3>

            <Button asChild className="w-fit rounded-3xl px-6 py-2 mt-2">
              <AppLink href="/home">{t?.continueShopping}</AppLink>
            </Button>
          </div>
        </div>
      )}

      {!isPending &&
        !error &&
        returns.map((order: Return) => {
          const statusConfig =
            RETURN_STATUS_CONFIG[order.status] || RETURN_STATUS_CONFIG.pending;

          const statusLabel = t?.status?.[order.status as keyof typeof t.status] || statusConfig.label;

          return (
            <div
              key={order.id}
              className={`bg-background border-t-4 md:border-t-0 md:border-l-4 rtl:md:border-r-4 ${statusConfig.border} rounded-2xl p-6 shadow-2xs`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-5">
                <p className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                  <HugeiconsIcon
                    icon={ShoppingBag01Icon}
                    size={24}
                    strokeWidth={1.5}
                  />
                  {t?.returnId}: {order.order_number}
                </p>

                <span
                  className={`min-w-[120px] md:w-fit text-center text-sm px-4 py-1.5 rounded-full font-medium ${statusConfig.badge}`}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Address */}
              <div className="flex justify-between items-center mb-5">
                <p className="flex items-center gap-2 text-sm font-medium bg-neutral-200 py-1.5 px-4 rounded-lg">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={20}
                    strokeWidth={1.5}
                  />
                  {order.shipping_address?.address}
                </p>

              </div>

              {/* Items */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {order.items.map((item) => {
                  const itemContent = (
                    <>
                      {(item.is_deleted || !item.is_active) && (
                        <div className="hidden md:block absolute top-2 right-2 rtl:right-auto rtl:left-2 text-red-600 text-xs px-3 py-1 rounded-full font-medium z-10">
                          {t?.productUnavailable}
                        </div>
                      )}
                      <Image
                        src={item.image?.small || '/placeholder.png'}
                        alt={item.name || "Product Image"}
                        width={110}
                        height={100}
                        className="object-full object-center h-[90px] w-[110px] rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg"
                      />

                    <div className="flex-1 m-auto ms-3 space-y-3 ">
                        <h3 className="text-sm font-medium text-neutral-800">{item.name}</h3>
                        <p className="text-sm font-medium text-neutral-950">
                          {item.unit_price} {order.currency}
                          <span className="text-sm text-neutral-500 mx-3">
                            x{item.quantity}
                          </span>
                        </p>
                      </div>
                    </>
                  );

                  return item.is_deleted || !item.is_active ? (
                    <div
                      key={item.product_id}
                      className="flex gap-2 border border-gray-200 rounded-xl relative cursor-not-allowed opacity-40"
                    >
                      {itemContent}
                    </div>
                  ) : (
                    <AppLink
                      key={item.product_id}
                      href={`/${lang}/product/${item.slug}`}
                      className="flex gap-2 border border-gray-200 rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                      {itemContent}
                    </AppLink>
                  );
                })}
              </div>

              <Separator className="my-5" />

              {/* FOOTER */}

              <div className="flex flex-col gap-2">
                {Number(order.discount_amount) > 0 && (
                  <p className="font-semibold text-md">
                    <span className="font-normal">{t?.discount} : </span>
                    {order.discount_amount} {order.currency}
                  </p>
                )}
                <p className="font-semibold text-md">
                  <span className="font-normal">{t?.refundAmount} : </span>
                  {order.total_price} {order.currency}
                </p>

              </div>
            </div>

          );
        })}
    </section>
  );
};

export default Returns;
