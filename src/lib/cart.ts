export type CartOption = {
  groupName: string;
  optionName: string;
  priceModifier: number;
};

export type CartItem = {
  itemId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  categoryName?: string | null;
  qty: number;
  note?: string;
  options: CartOption[];
};

export type AppliedCoupon = {
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_DELIVERY";
  discountValue: number;
  discountAmount: number;
  level: "replace" | "stack";
  note?: string;
};

export type CartState = {
  items: CartItem[];
  coupon?: AppliedCoupon | null;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

export function itemUnitPrice(item: CartItem): number {
  const modifiers = (item.options ?? []).reduce((sum, o) => sum + (o.priceModifier || 0), 0);
  return item.price + modifiers;
}

export function itemLineTotal(item: CartItem): number {
  return itemUnitPrice(item) * item.qty;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + itemLineTotal(item), 0);
}

/** How much a coupon removes from the subtotal given its type/value. */
export function couponDiscountAmount(
  coupon: AppliedCoupon,
  subtotal: number,
  deliveryFee: number,
): number {
  if (coupon.discountType === "PERCENTAGE") {
    return Math.min(subtotal, Math.round((subtotal * coupon.discountValue) / 100));
  }
  if (coupon.discountType === "FIXED") {
    return Math.min(subtotal, coupon.discountValue);
  }
  if (coupon.discountType === "FREE_DELIVERY") {
    return deliveryFee;
  }
  return 0;
}

export function computeTotals(items: CartItem[], deliveryFee: number, coupon?: AppliedCoupon | null): CartTotals {
  const subtotal = cartSubtotal(items);
  const discount = coupon && coupon.level !== "stack" ? couponDiscountAmount(coupon, subtotal, deliveryFee) : 0;
  const effectiveDelivery = Math.max(0, deliveryFee - (coupon?.discountType === "FREE_DELIVERY" ? deliveryFee : 0));
  const total = Math.max(0, subtotal - discount + effectiveDelivery);
  return { subtotal, discount, deliveryFee: effectiveDelivery, total };
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

export function parseSerializedCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export const CART_STORAGE_KEY = "chowheaven:cart:v1";

/** Stable key that identifies the same line item for merging quantities. */
export function cartItemKey(item: CartItem): string {
  const opts = (item.options ?? [])
    .map((o) => `${o.groupName}|${o.optionName}`)
    .sort()
    .join("~");
  return `${item.itemId}#${opts}#${item.note ?? ""}`;
}

export function mergeCartItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of items) {
    const key = cartItemKey(item);
    const existing = map.get(key);
    if (existing) {
      existing.qty += item.qty;
    } else {
      map.set(key, { ...item, qty: item.qty });
    }
  }
  return Array.from(map.values());
}