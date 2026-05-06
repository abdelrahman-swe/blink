import { ProductDetails } from "@/utils/types/product";

/**
 * Represents a single price entry within a merged cart item.
 * A product on deal will have TWO entries: one deal-priced, one regular-priced.
 */
export interface CartPriceEntry {
  deal_id: number | null;
  is_on_deal: boolean;
  quantity: number;
  price: string;
  sale_price: string | null;
  deal_price: string | null;
  discount_percentage: number | null;
  stock: number;
  total: string;
}

/**
 * A merged cart item that combines all API entries sharing the same product_id.
 * Used for display: one row per product with a price breakdown.
 */
export interface MergedCartItem {
  product_id: number;
  name: string;
  slug: string;
  image: ProductDetails["image"];
  totalQuantity: number;
  max_quantity_per_order: number | null;
  /** The combined stock across all entries (use the max since backend manages distribution) */
  maxStock: number;
  /** Individual price entries — usually 1, but 2 if product is split between deal and regular */
  entries: CartPriceEntry[];
  /** The total price across all entries */
  totalPrice: number;
}

/**
 * Merges raw cart items (which may contain duplicate product_ids for deal/regular splits)
 * into a single entry per product for display in the cart UI.
 */
export function mergeCartItems(items: ProductDetails[]): MergedCartItem[] {
  const map = new Map<number, MergedCartItem>();

  const normalizeMaxQuantityPerOrder = (value: ProductDetails["max_quantity_per_order"]) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = typeof value === "string" ? Number(value) : value;

    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
  };

  for (const item of items) {
    const productId = (item.product_id || item.id) as number;

    if (!map.has(productId)) {
      map.set(productId, {
        product_id: productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        totalQuantity: 0,
        max_quantity_per_order: normalizeMaxQuantityPerOrder(item.max_quantity_per_order),
        maxStock: 0,
        entries: [],
        totalPrice: 0,
      });
    }

    const merged = map.get(productId)!;
    const qty = item.quantity || 1;

    merged.totalQuantity += qty;
    merged.maxStock = Math.max(merged.maxStock, item.stock ?? 99);
    merged.totalPrice += parseFloat(item.total?.toString() || "0") || (parseFloat(item.deal_price || item.sale_price || item.price || "0") * qty);

    merged.entries.push({
      deal_id: item.deal_id ?? null,
      is_on_deal: item.is_on_deal ?? false,
      quantity: qty,
      price: item.price,
      sale_price: item.sale_price,
      deal_price: item.deal_price,
      discount_percentage: item.discount_percentage,
      stock: item.stock ?? 0,
      total: item.total?.toString() || "0",
    });
  }

  return Array.from(map.values());
}
