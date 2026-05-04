"use client";
import { useAppRouter } from '@/hooks/useAppRouter';
import AppLink from '@/components/common/AppLink';
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UseGetCartProductQuery } from "@/hooks/queries/useCartQueries";
import { usePlaceOrderQuery, useValidateCouponMutation } from "@/hooks/queries/useCheckoutQueries";
import { useOrderSummary } from "@/hooks/useOrderSummary";
import { PaymentSummary } from "@/components/common/PaymentSummary";
import { toast } from "sonner";
import { CouponValidateResponse, PaymentMethod, CheckoutFormData } from "@/utils/types/checkout";
import { createCheckoutSchema } from "@/utils/schema/checkoutSchema";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    CheckoutFormSkeleton,
    CheckoutSummarySkeleton,
} from "../../../../components/skeleton/CheckoutSkeleton";
import { CheckoutForm } from "./components/CheckoutForm";
import { CheckoutPaymentOption } from "./components/CheckoutPaymentOption";
import { useUserStore } from '@/store/useUserStore';
import { useGetAddresses, useProfileAccount } from '@/hooks/queries/useUserQueries';

export default function CheckOut() {
    const params = useParams();
    const router = useAppRouter();
    const lang = params.lang as string;
    const { checkout } = useDictionary();
    const t = checkout?.checkout;
    const { isAuthenticated } = useUserStore();
    const { data: items = [], isLoading } = UseGetCartProductQuery();
    const { mutate: placeOrder, isPending } = usePlaceOrderQuery();
    const { mutate: validateCoupon, mutateAsync: validateCouponAsync, isPending: isCouponLoading } = useValidateCouponMutation();

    const [couponData, setCouponData] = useState<CouponValidateResponse["data"] | null>(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const isSubmittedRef = useRef(false);
    const hasRestoredRef = useRef(false);
    const restoredFromStorageRef = useRef(false);
    const isRestoringRef = useRef(false);
    const wasAuthenticatedRef = useRef(isAuthenticated);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data: addressesResponse, isLoading: addressesLoading } = useGetAddresses();
    const { data: profileData } = useProfileAccount();
    const addresses = addressesResponse?.data?.addresses || [];

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(createCheckoutSchema(t)) as any,
        defaultValues: {
            full_name: "",
            email: "",
            phone_number: "",
            save_address: true,
            shipping_address: {
                address: "",
                city_id: 0,
                governorate_id: 0,
            },
            notes: "",
            terms: false,
            paymentMethod: undefined as unknown as PaymentMethod,
            coupon_code: "",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        if (!hasRestoredRef.current) {
            hasRestoredRef.current = true;

            // If we just came back from a SUCCESSFUL Paymob payment,
            // wipe everything and block the watch from re-saving stale data.
            const wasPaid = sessionStorage.getItem("checkout_paid");
            if (wasPaid) {
                sessionStorage.removeItem("checkout_paid");
                localStorage.removeItem("checkout_form_data");
                localStorage.removeItem("payment_attempts");
                isSubmittedRef.current = true; // blocks form.watch from saving
                form.reset({
                    full_name: "",
                    email: "",
                    phone_number: "",
                    save_address: true,
                    shipping_address: { address: "", city_id: 0, governorate_id: 0 },
                    notes: "",
                    terms: false,
                    paymentMethod: undefined as unknown as PaymentMethod,
                    coupon_code: "",
                });
                setCouponData(null);
                return; // skip restore logic entirely
            }

            const raw = localStorage.getItem("checkout_form_data");

            if (raw && raw !== "undefined" && raw !== "null") {
                try {
                    const wrapper = JSON.parse(raw);
                    const TTL = 1 * 60 * 60 * 1000; // 1 hours


                    const isExpired = !wrapper?.savedAt || (Date.now() - wrapper.savedAt > TTL);


                    const isStalGuestData = isAuthenticated && wrapper.isGuest === true;

                    if (isExpired || isStalGuestData) {
                        localStorage.removeItem("checkout_form_data");
                    } else {

                        const parsedData = wrapper.data;
                        if (parsedData && typeof parsedData === "object" && Object.keys(parsedData).length > 0) {
                            form.reset(parsedData);
                            if (wrapper.couponData) {
                                isRestoringRef.current = true;
                                setCouponData(wrapper.couponData);
                                setTimeout(() => { isRestoringRef.current = false; }, 0);
                            }

                            restoredFromStorageRef.current = true;
                        }
                    }
                } catch (error) {
                    localStorage.removeItem("checkout_form_data");
                }
            } else {

                form.setValue("notes", "");
                form.setValue("terms", false);
                form.setValue("coupon_code", "");
                setCouponData(null);
            }
        }

        const profile = profileData?.data;
        if (isAuthenticated && profile) {

            if (!wasAuthenticatedRef.current) {
                localStorage.removeItem("checkout_form_data");
                localStorage.removeItem("payment_attempts");
                restoredFromStorageRef.current = false;
                form.setValue("notes", "", { shouldValidate: false });
                form.setValue("coupon_code", "", { shouldValidate: false });
                setCouponData(null);
            }

            if (!restoredFromStorageRef.current) {
                if (profile.full_name) form.setValue("full_name", profile.full_name, { shouldValidate: false });
                if (profile.email) form.setValue("email", profile.email, { shouldValidate: false });
                if (profile.phone) form.setValue("phone_number", String(profile.phone), { shouldValidate: false });
            }

            wasAuthenticatedRef.current = true;
        }

    }, [form, profileData, isAuthenticated]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (!isSubmittedRef.current && hasRestoredRef.current) {
                if (value && typeof value === "object") {
                    const isEmpty = !value.full_name && !value.email && !value.phone_number;
                    if (!isEmpty) {

                        const payload: any = {
                            data: value,
                            savedAt: Date.now(),
                        };
                        if (couponData) {
                            payload.couponData = couponData;
                        }
                        localStorage.setItem("checkout_form_data", JSON.stringify(payload));
                    }
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, couponData]);

    const couponCode = form.watch("coupon_code");

    // Clear coupon data when the code is empty or has changed from the validated one
    useEffect(() => {
        if (isRestoringRef.current) return;
        if (!couponCode || couponCode.trim() === "") {
            setCouponData(null);
            form.clearErrors("coupon_code");
        } else if (couponData && couponCode.trim() !== couponData.coupon_code) {
            setCouponData(null);
        }
    }, [couponCode, form, couponData]);

    const watchedPaymentMethod = form.watch("paymentMethod");

    useEffect(() => {
        if (!items.length) return;

        const initialQuantities: Record<number, number> = {};
        items.forEach((item: any) => {
            const id = item.product_id || item.id;
            initialQuantities[id] = item.quantity || 1;
        });

        setQuantities(initialQuantities);
    }, [items]);

    const orderSummary = useOrderSummary({
        items,
        quantities,
        shippingFee: 0,
        paymentMethod: watchedPaymentMethod,
    });

    // Merge coupon discount into the summary shown to the user
    const displaySummary: typeof orderSummary = couponData
        ? {
            ...orderSummary,
            discountAmount: couponData.discount_amount ?? 0,
            total: couponData.final_total ?? orderSummary.total,
        }
        : orderSummary;

    const onSubmit = (data: CheckoutFormData) => {
        if (!items || items.length === 0) {
            toast.error("Your cart is empty. Please add items before checkout.");
            router.push(`/${lang}/cart`);
            return;
        }

        if (data.paymentMethod !== PaymentMethod.PAYMOB && data.paymentMethod !== PaymentMethod.CASH_ON_DELIVERY) {
            toast.info("Selected payment method not supported yet.");
            return;
        }

        const payload = {
            ...data,
            payment_method: data.paymentMethod,
            coupon_code: couponData && data.coupon_code === couponData.coupon_code ? data.coupon_code : ""
        };
        delete (payload as any).selected_address_id;
        delete (payload as any).paymentMethod;

        placeOrder(payload as any, {
            onSuccess: (response) => {
                isSubmittedRef.current = true;
                setIsSubmitted(true);

                // For redirect payments (Paymob), we skip clearing storage here.
                // It will be cleared in payment/page.tsx ONLY if the payment is successful.
                if (data.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
                    // SUCCESS — clear storage.
                    localStorage.removeItem("checkout_form_data");
                    form.reset();
                    setCouponData(null);
                    setOpenSuccessDialog(true);

                    // setTimeout(() => {
                    //     setOpenSuccessDialog(false);
                    //     router.push(`/${lang}/home`);
                    // }, 2000);
                    return;
                }

                const redirectUrl = response?.data?.redirect_url;
                const orderId = response?.data?.order?.id;

                if (!redirectUrl || !orderId) {
                    toast.error("Invalid payment response. Please try again.");
                    return;
                }
                const url = new URL(redirectUrl);
                url.searchParams.set("order_id", String(orderId));

                const currentValues = form.getValues();
                const storagePayload: any = {
                    data: currentValues,
                    savedAt: Date.now(),
                    isGuest: !isAuthenticated,
                };
                if (couponData) {
                    storagePayload.couponData = couponData;
                }
                localStorage.setItem("checkout_form_data", JSON.stringify(storagePayload));

                window.location.href = url.toString();
            },
            onError: (err: any) => {
                const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
                toast.error(`Order Failed: ${apiError}`);
            },
        });
    };

    const handleApplyCoupon = async () => {
        const code = form.getValues("coupon_code");
        if (!code || code.trim() === "") {
            form.setError("coupon_code", {
                type: "manual",
                message: t.form.promoCodeRequired
            });
            return false;
        }

        form.clearErrors("coupon_code");
        try {
            const response = await validateCouponAsync({
                code: code.trim(),
                order_total: orderSummary.total,
            });
            setCouponData(response.data);
            if (response.data.description) {
                toast.success(response.data.description);
            }
            return true;
        } catch (err: any) {
            setCouponData(null);
            const apiMessage =
                err?.response?.data?.data?.error ??
                err?.response?.data?.message ??
                t.form.promoCodeInvalid;
            form.setError("coupon_code", {
                type: "manual",
                message: apiMessage,
            });
            return false;
        }
    };

    const onError = (errors: any) => {
        toast.error("Please fill in all required fields");
        const firstErrorField = Object.keys(errors)[0];
        document
            .getElementById(firstErrorField)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <main className="xl:container mx-auto px-5 py-7">
            <Breadcrumb aria-label="Breadcrumb">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <AppLink href={`/${lang}`}>{t.breadcrumb.home}</AppLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <AppLink href={`/${lang}/cart`}>{t.breadcrumb.cart}</AppLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t.breadcrumb.checkout}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-12 gap-6 my-5">
                <section className="col-span-12 md:col-span-6 xl:col-span-9">
                    {isLoading ? (
                        <CheckoutFormSkeleton />
                    ) : (
                        <CheckoutForm form={form} translations={t} />
                    )}
                </section>

                {/* Summary & Payment */}
                <aside className="col-span-12 md:col-span-6 xl:col-span-3 space-y-5">
                    <div className="border rounded-xl p-6 shadow-xs">
                        {isLoading ? (
                            <CheckoutSummarySkeleton />
                        ) : (
                            <PaymentSummary
                                summary={displaySummary}
                                translations={{
                                    ...t.summary,
                                    promoCodePlaceholder: t.form.promoCodePlaceholder,
                                }}
                                showPromoCode={true}
                                control={form.control}
                                onApplyCoupon={handleApplyCoupon}
                                isCouponLoading={isCouponLoading}
                                couponData={couponData}
                            />
                        )}
                    </div>

                    <div className="border rounded-xl p-6 shadow-xs">
                        <h2 className="font-medium text-xl mb-5">
                            {t.form.paymentMethod}
                        </h2>

                        <Controller
                            control={form.control}
                            name="paymentMethod"
                            render={({ field, fieldState }) => (
                                <>
                                    <RadioGroup
                                        id="paymentMethod"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>
                                                    <CheckoutPaymentOption
                                                        value={PaymentMethod.CASH_ON_DELIVERY}
                                                        label={t.payment?.cashOnDelivery}
                                                        disabled={!isAuthenticated}
                                                    />
                                                </span>
                                            </TooltipTrigger>
                                            {!isAuthenticated && (
                                                <TooltipContent side="top">
                                                    {t?.payment?.loginToPlaceOrder || "Please login to place an order"}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                        <CheckoutPaymentOption
                                            value={PaymentMethod.PAYMOB}
                                            label={t.payment?.payMob}
                                        />
                                    </RadioGroup>
                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm mt-2">{fieldState.error.message}</p>
                                    )}
                                </>
                            )}
                        />

                        <Button
                            onClick={form.handleSubmit(onSubmit, onError)}
                            disabled={isPending || isCouponLoading}
                            className="w-full rounded-full font-semibold text-lg py-6 mt-5"
                        >
                            {isPending || isCouponLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">
                                        <Loader2Icon />
                                    </span>
                                    {t.loading}
                                </span>
                            ) : (
                                t.placeOrder
                            )}
                        </Button>
                    </div>
                </aside>
            </div>

            <Dialog open={openSuccessDialog} onOpenChange={(val) => {
                setOpenSuccessDialog(val);
                if (!val) router.push(`/${lang}/home`);
            }}>
                <DialogContent className="max-w-2xs">
                    <DialogHeader>
                        <DialogTitle className="mx-auto mt-5">
                            <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={70}
                                color="#34C759"
                                strokeWidth={1.5}
                            />
                        </DialogTitle>
                        <DialogDescription className="text-lg text-primary font-medium mx-auto text-center max-w-2xs pb-5">
                            {t.orderSuccess}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    );
}