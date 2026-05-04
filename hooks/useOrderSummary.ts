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
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.deal_price || item.sale_price || item.price || "0");
      const quantity = quantities[(item.product_id || item.id) as number] || item.quantity || 1;
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
