import { useMemo } from 'react';
import { PaymentMethod, OrderSummary } from '@/utils/types/checkout';
import { ProductDetails } from '@/utils/types/product';

interface UseOrderSummaryProps {
  items: ProductDetails[];
  quantities: Record<number, number>;
  shippingFee?: number;
  paymentMethod?: PaymentMethod;
}

export const useOrderSummary = ({
  items,
  quantities,
  shippingFee = 0,
  paymentMethod
}: UseOrderSummaryProps): OrderSummary => {
  return useMemo(() => {
    // Use item.quantity directly from the API response for accurate totals.
    // The local `quantities` state tracks totals per product_id (for optimistic UI),
    // but individual items already have the correct per-entry quantities from the backend.
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.deal_price || item.sale_price || item.price || "0");
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);

    const codFee = 0;
    const total = subtotal + shippingFee + codFee;

    return {
      subtotal,
      shippingFee,
      total,
      cashOnDeliveryFee: codFee,
      discountAmount: 0,
    };
  }, [items, quantities, shippingFee, paymentMethod]);
};
