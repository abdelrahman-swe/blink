"use client";
import { useAppRouter } from '@/hooks/useAppRouter';
import Image from "next/image";
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import { useLoadingStore } from "@/store/useLoadingStore";
import { Button } from "@/components/ui/button";
import { useUserAllOrders, useUserCancelOrder } from "@/hooks/queries/useUserQueries";
import { Order } from "@/utils/types/user";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DateTimeIcon,
    Location01Icon,
    ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import ProfileOrderSkeleton from "@/components/skeleton/ProfileOrderSkeleton";
import { ORDER_STATUS_CONFIG } from "@/helper";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";


const OrdersClient = () => {
    const params = useParams();
    const router = useAppRouter();
    const { startLoading } = useLoadingStore();
    const lang = params.lang as string;
    const { user: userDict } = useDictionary();
    const t = userDict?.profile?.orders;

    const { data: orders = [], isPending, isError } = useUserAllOrders();
    const { mutate: cancelOrder, isPending: cancelOrderPending } = useUserCancelOrder();
    const [cancelOrderDialog, setCancelOrderDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    return (
        <section className="xl:container mx-auto space-y-6 ">
            <h2 className="text-xl font-semibold">{t?.title}</h2>

            {isPending && <ProfileOrderSkeleton isLoading={isPending} />}

            {isError && <p className="text-red-500">{t?.failedLoad}</p>}

            {!isPending && !isError && orders.length === 0 && (
                <div className="flex flex-col justify-center items-center gap-4 py-10 bg-background rounded-2xl border border-gray-200">
                    <Image src="/orders.svg" alt="empty-wishlist" width={100} height={100} />
                    <div className="flex flex-col justify-center items-center gap-2">
                        <h3 className="font-semibold text-lg">
                            {t?.emptyTitle}
                        </h3>
                        <p className="text-[#333333] max-w-md text-center text-sm">
                            {t?.emptyDesc}
                        </p>
                        <Button className="w-fit rounded-3xl px-6 py-2 mt-2" asChild>
                            <AppLink href="/home">{t?.continueShopping}</AppLink>
                        </Button>
                    </div>
                </div>
            )}

            {!isPending &&
                !isError &&
                orders.map((order: Order) => {
                    const statusConfig =
                        ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.processing;

                    const statusLabel = t?.status?.[order.status as keyof typeof t.status] || statusConfig.label;

                    return (
                        <div
                            key={order.id}
                            className={`bg-background border-t-4 md:border-t-0 md:border-l-4 rtl:md:border-r-4 ${statusConfig.border} rounded-2xl p-6 shadow-2xs `}
                        >
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-5">

                                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
                                    <p className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800 ">
                                        <HugeiconsIcon
                                            icon={ShoppingBag01Icon}
                                            size={22}
                                            strokeWidth={1.5}
                                            className='ms-2'
                                        />
                                        {t?.orderId}: {order.order_number}
                                    </p>

                                    <span className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                                        <HugeiconsIcon
                                            icon={DateTimeIcon}
                                            size={22}
                                            strokeWidth={1.5}
                                        />
                                        {t?.orderedOn}{" "}
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }) : "-"}
                                    </span>
                                </div>

                                <span
                                    className={`min-w-[120px] md:w-fit text-center text-sm px-5 py-1.5 rounded-full font-medium ${statusConfig.badge}`}
                                >
                                    {statusLabel}
                                </span>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                <p className="flex items-center gap-2 text-sm font-medium bg-neutral-200 py-2 px-4 rounded-lg">
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        size={20}
                                        strokeWidth={1.5}
                                    />
                                    {order.shipping_address?.address}
                                </p>

                                {(order.status === "completed") && (
                                    <>
                                        {/* Delivered */}
                                        <span className="text-sm text-neutral-800">
                                            <span>
                                                {t?.deliveredAt}
                                            </span>
                                            {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }) : "-"}

                                        </span>
                                    </>
                                )}

                                {/* Estimated */}
                                {(order.status === "out_for_delivery") && (
                                    <>
                                        <span className="text-sm text-neutral-800">
                                            <span>
                                                {t?.estimatedArrival}
                                            </span>
                                            {order.estimated_delivery_time ? new Date(order.estimated_delivery_time).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }) : "-"}
                                        </span>
                                    </>
                                )}


                            </div>

                            {/* Items */}
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {order.items.map((item, index) => {
                                    const itemContent = (
                                        <>
                                            {(item.is_deleted || !item.is_active) && (
                                                <div className="hidden md:block absolute top-2 right-2 rtl:right-auto rtl:left-2 text-red-600 text-xs px-3 py-1 rounded-full font-medium z-10">
                                                    {t?.productUnavailable}
                                                </div>
                                            )}
                                            <Image
                                                src={item.image?.small || '/placeholder.png'}
                                                alt={item.name}
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
                                            key={`${item.product_id}-${index}`}
                                            className="flex gap-2 border border-gray-200 rounded-xl relative cursor-not-allowed opacity-40"
                                        >
                                            {itemContent}
                                        </div>
                                    ) : (
                                        <AppLink
                                            key={`${item.product_id}-${index}`}
                                            href={`/${lang}/product/${item.slug}`}
                                            className="flex gap-2 border border-gray-200 rounded-xl hover:bg-neutral-50 transition-colors "
                                        >
                                            {itemContent}
                                        </AppLink>
                                    );
                                })}
                            </div>

                            <Separator className="my-3" />

                            {/* Footer */}
                            <div className="flex justify-between items-center">

                                <div className="flex flex-col gap-2">
                                    {Number(order.discount_amount) > 0 && (
                                        <p className="font-semibold text-md">
                                            <span className="font-normal">{t?.discount}: </span>
                                            {order.discount_amount} {order.currency}
                                        </p>
                                    )}
                                    <p className="font-semibold text-md">
                                        <span className="font-normal">{t?.total}: </span>
                                        {order.total_price} {order.currency}
                                    </p>

                                </div>

                                {order.status === "completed" && !order.is_returned && order.can_return && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-xl px-5"
                                        onClick={() => {
                                            startLoading();
                                            router.push(`/${lang}/profile/returns/${order.id}`);
                                        }}
                                    >
                                        {t?.returnOrder}
                                    </Button>
                                )}

                                {(order.status === "processing" || order.status === "pending_payment" || order.status === "pending") && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-xl px-5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => {
                                            setSelectedOrderId(order.id);
                                            setCancelOrderDialog(true);
                                        }}

                                    >
                                        {t?.cancelOrder}
                                    </Button>
                                )}


                            </div>
                        </div>
                    );
                })}


            <Dialog open={cancelOrderDialog} onOpenChange={setCancelOrderDialog}>
                <DialogContent className="sm:max-w-lg space-y-3 p-8">
                    <DialogTitle className="font-medium text-xl text-center mt-5">
                        {t?.confirmCancelOrder}
                    </DialogTitle>
                    <DialogFooter className="mx-auto text-center space-x-2">
                        <Button
                            variant="outline"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => setCancelOrderDialog(false)}
                        >
                            {t?.no}
                        </Button>
                        <Button
                            variant="destructive"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => {
                                if (selectedOrderId) {
                                    cancelOrder(selectedOrderId, {
                                        onSuccess: () => {
                                            setCancelOrderDialog(false);
                                            setSelectedOrderId(null);
                                        }
                                    });
                                }
                            }}

                            disabled={cancelOrderPending}
                        >
                            {cancelOrderPending ? t?.canceling : t?.yes}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </section>
    );
};

export default OrdersClient;
