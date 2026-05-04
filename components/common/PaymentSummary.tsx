import { Separator } from "@/components/ui/separator";
import { CouponValidateResponse, OrderSummary } from "@/utils/types/checkout";
import { memo } from "react";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Controller } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { LoginRequiredDialog } from "./LoginRequiredDialog";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface PaymentSummaryProps {
    summary: OrderSummary;
    translations: {
        title: string;
        subtotal: string;
        shippingFee: string;
        free: string;
        cashOnDeliveryFee: string;
        discount: string;
        apply: string;
        currency: string;
        total: string;
        promoCodePlaceholder?: string;
    };
    showPromoCode?: boolean;
    control?: any;
    onApplyCoupon?: () => void;
    isCouponLoading?: boolean;
    couponData?: CouponValidateResponse["data"] | null;
}

export const PaymentSummary = memo(function PaymentSummary({
    summary,
    translations: t,
    showPromoCode = false,
    control,
    onApplyCoupon,
    isCouponLoading = false,
    couponData = null,
}: PaymentSummaryProps) {
    const { showLoginDialog, setShowLoginDialog, handleActionWithAuth } = useRequireAuth();
    const { checkout } = useDictionary();
    const tCheckout = checkout?.checkout;

    const handleApplyClick = () => {
        handleActionWithAuth(() => {
            if (onApplyCoupon) onApplyCoupon();
        });
    };

    return (
        <>
            <h2 className="text-xl font-medium mb-6">{t.title}</h2>
            <div className="flex flex-col gap-3">
                <SummaryRow
                    label={t.subtotal}
                    value={`${summary.subtotal.toFixed(2)} ${t.currency}`}
                />
                <SummaryRow
                    label={t.shippingFee}
                    value={summary.shippingFee > 0 ? `${summary.shippingFee.toFixed(2)} ${t.currency}` : t.free}
                />
                {showPromoCode && (
                    <div className="space-y-3">
                        {summary.discountAmount && summary.discountAmount > 0 ? (
                            <SummaryRow
                                label={t.discount}
                                value={`-${summary.discountAmount.toFixed(2)} ${t.currency}`}
                                valueClassName="text-primary font-bold"
                            />
                        ) : null}

                        {couponData?.description && (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-primary text-xs font-medium">
                                    {couponData.description}
                                </p>
                            </div>
                        )}

                        <Controller
                            control={control}
                            name="coupon_code"
                            render={({ field, fieldState }) => (
                                <div className="w-full mt-3">
                                    <ButtonGroup className="w-full">
                                        <div className="relative flex-1">
                                            <Input
                                                {...field}
                                                placeholder={t.promoCodePlaceholder}
                                                className="rounded-l-3xl rounded-r-none rtl:rounded-r-xl! rtl:rounded-l-none placeholder:px-3 h-11"
                                                disabled={isCouponLoading}
                                            />
                                            {field.value && (
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("")}
                                                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    disabled={isCouponLoading}
                                                >
                                                    <Loader2Icon className={`w-4 h-4 ${isCouponLoading ? "animate-spin" : "hidden"}`} />
                                                    {!isCouponLoading && <span className="text-lg">&times;</span>}
                                                </button>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="default"
                                            aria-label="promo"
                                            className="rounded-r-3xl rtl:rounded-l-3xl! h-11 w-20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                            onClick={handleApplyClick}
                                            disabled={isCouponLoading || !field.value}
                                        >
                                            {isCouponLoading ? (
                                                <Loader2Icon className="animate-spin w-4 h-4" />
                                            ) : (
                                                t.apply
                                            )}
                                        </Button>
                                    </ButtonGroup>
                                    {fieldState?.error && (
                                        <p className="text-destructive text-sm mt-2 px-3">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                )}

            </div>

            <Separator className="my-5" />
            <div className="flex justify-between items-center gap-5">
                <p className="text-[#333333] text-xl font-medium">{t.total}</p>
                <span className="font-bold text-xl text-primary">
                    {summary.total.toFixed(2)} {t.currency}
                </span>
            </div>

            <LoginRequiredDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                message={tCheckout?.payment?.loginToApplyCoupon}
            />
        </>
    );
});

interface SummaryRowProps {
    label: string;
    value: string;
    valueClassName?: string;
}

function SummaryRow({ label, value, valueClassName = "" }: SummaryRowProps) {
    return (
        <div className="flex justify-between items-center gap-5">
            <p className="text-[#333333] text-lg">{label}</p>
            <span className={`font-semibold text-lg ${valueClassName}`}>
                {value}
            </span>
        </div>
    );
}
