"use client";
import { useAppRouter } from '@/hooks/useAppRouter';
import { useGetOrderStatusQuery } from "@/hooks/queries/useCheckoutQueries";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { PaymentStatusDialog } from "../../(main)/checkout/components/PaymentStatusDialog";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useUserStore } from "@/store/useUserStore";

export default function Payment() {
  const searchParams = useSearchParams();
  const router = useAppRouter();
  const params = useParams();
  const lang = params.lang as string;
  const orderIdFromUrl = searchParams.get("order_id");
  const orderId = orderIdFromUrl ? Number(orderIdFromUrl) : null;
  const { data: orderStatus } = useGetOrderStatusQuery(orderId);
  const { syncWithCookies } = useUserStore();

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentFailed, setShowPaymentFailed] = useState(false);
  const { checkout } = useDictionary();

  const isRedirectingRef = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    syncWithCookies();
  }, [syncWithCookies]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!orderStatus || !orderId || isRedirectingRef.current) return;

    const status = (orderStatus?.order_status || "").toLowerCase();

    if (status === "pending_payment") return;

    if (status === "paid" || status === "processing" || status === "success" || status === "successful" || status === "completed") {
      isRedirectingRef.current = true;
      setShowPaymentSuccess(true);

      Cookies.remove("checkout_form_data");
      localStorage.removeItem("checkout_form_data");
      localStorage.removeItem("payment_attempts");
      sessionStorage.setItem("checkout_paid", "true");

      redirectTimeoutRef.current = setTimeout(() => {
        router.replace(`/${lang}/home`);
      }, 5000);

    } else if (status === "failed") {
      isRedirectingRef.current = true;
      setShowPaymentFailed(true);
      toast.error(checkout?.checkout?.paymentFailed || "Payment failed. Please try again.");

      redirectTimeoutRef.current = setTimeout(() => {
        router.replace(`/${lang}/checkout`);
      }, 5000);
    }
  }, [orderStatus, orderId, router, lang, checkout?.checkout?.paymentFailed]);

  return (
    <div className="h-screen relative flex items-center justify-center bg-gray-50">
      <Image
        src="/logo-icon-only.svg"
        alt="Logo"
        width={200}
        height={100}
        className="absolute top-10 left-10"
        priority
      />

      <div className="text-center">
        <span className="loader" />
        <p className="text-3xl font-semibold text-foreground dark:text-background! mt-10">
          {checkout?.checkout?.confirmingPayment}
        </p>
      </div>

      <PaymentStatusDialog
        open={showPaymentSuccess}
        onOpenChange={setShowPaymentSuccess}
        status="paid"
      />
      <PaymentStatusDialog
        open={showPaymentFailed}
        onOpenChange={setShowPaymentFailed}
        status="failed"
      />



      <style jsx>{`
        .loader {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: block;
          margin: 15px auto;
          position: relative;
          color: #000000; /* Tailwind blue-500 - change to match your brand */
          box-sizing: border-box;
          animation: animloader 1s linear infinite alternate;
        }

        @keyframes animloader {
          0% {
            box-shadow: -38px -12px, -14px 0, 14px 0, 38px 0;
          }
          33% {
            box-shadow: -38px 0px, -14px -12px, 14px 0, 38px 0;
          }
          66% {
            box-shadow: -38px 0px, -14px 0, 14px -12px, 38px 0;
          }
          100% {
            box-shadow: -38px 0, -14px 0, 14px 0, 38px -12px;
          }
        }
      `}</style>
    </div>
  );
}
