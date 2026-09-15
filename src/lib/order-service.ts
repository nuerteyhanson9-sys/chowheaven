import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { type AppliedCoupon, type CartItem, couponDiscountAmount } from "@/lib/cart";
import { numericSetting, getSettings } from "@/lib/settings";

export type CouponCheckResult = {
  ok: boolean;
  error?: string;
  coupon?: AppliedCoupon;
};

export type OrderLineInput = {
  itemId: string;
  qty: number;
  options: Array<{ groupName: string; optionName: string; priceModifier: number }>;
  note?: string;
};

/**
 * Validate a coupon code against the database. Returns a flattened discount
 * object the cart can display, without trusting any client-computed amounts.
 */
export async function validateCouponCode(code: string, subtotal: number, deliveryFee: number): Promise<CouponCheckResult> {
  if (!code) return { ok: false, error: "Enter a coupon code." };

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active) return { ok: false, error: "This coupon code isn't valid." };
  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (subtotal < Number(coupon.minOrderValue)) {
    return {
      ok: false,
      error: `This coupon needs a minimum order of ₦${Number(coupon.minOrderValue).toLocaleString("en-NG")}.`,
    };
  }
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }

  const value = Number(coupon.discountValue);
  const applied: AppliedCoupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: value,
    discountAmount: couponDiscountAmount(
      {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: value,
        discountAmount: 0,
        level: "stack",
      },
      subtotal,
      deliveryFee,
    ),
    level: "stack",
    note: "Validated against server prices",
  };

  return { ok: true, coupon: applied };
}

/**
 * Resolve client cart lines against the real menu DB and rebuild authoritative
 * prices, snapshots and subtotal. Never trust prices sent from the browser.
 */
export async function resolveOrderLines(inputLines: OrderLineInput[]) {
  const itemIds = inputLines.filter((l) => l.itemId).map((l) => l.itemId);
  if (itemIds.length === 0) throw new Error("Your cart is empty.");

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: itemIds }, available: true },
    include: { category: true, options: true },
  });
  const byId = new Map(menuItems.map((item) => [item.id, item]));

  const lines = [];
  let subtotal = 0;

  for (const input of inputLines) {
    const menuItem = byId.get(input.itemId);
    if (!menuItem) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(input.qty || 1)));

    const optionIds = new Set((input.options ?? []).map((o) => o.groupName + "|" + o.optionName));
    const matchedOptions = menuItem.options
      .filter((o) => optionIds.has(`${o.groupName}|${o.optionName}`))
      .map((o) => ({
        groupName: o.groupName,
        optionName: o.optionName,
        priceModifier: Number(o.priceModifier),
      }));

    const basePrice = Number(menuItem.price);
    const modifiers = matchedOptions.reduce((sum, o) => sum + o.priceModifier, 0);
    const unitPrice = basePrice + modifiers;
    subtotal += unitPrice * qty;

    lines.push({
      menuItem: {
        id: menuItem.id,
        name: menuItem.name,
        categoryName: menuItem.category?.name ?? null,
        imageUrl: menuItem.imageUrl,
        price: unitPrice,
      },
      qty,
      options: matchedOptions,
      note: (input.note ?? "").slice(0, 500),
      basePrice,
    });
  }

  if (lines.length === 0) throw new Error("None of the items in your cart are available right now.");

  return { lines, subtotal };
}

export type NewOrderInput = {
  orderType: "DELIVERY" | "PICKUP";
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  note?: string | null;
  scheduledFor?: string | null;
  address?: { street: string; city: string; state: string; zip?: string | null } | null;
  couponCode?: string | null;
};

/** Single source of truth for building and saving an order + its payment. */
export async function createOrderRecord(input: NewOrderInput, lines: Array<{
  menuItem: { id: string; name: string; categoryName: string | null; imageUrl: string | null; price: number };
  qty: number;
  options: Array<{ groupName: string; optionName: string; priceModifier: number }>;
  note: string;
  basePrice: number;
}>, subtotal: number) {
  const settings = await getSettings();
  const deliveryFee = numericSetting(settings, "delivery_fee", 1200);
  const minOrder = numericSetting(settings, "delivery_min_order", 3000);

  if (input.orderType === "DELIVERY" && subtotal < minOrder) {
    throw new Error(`Delivery orders need a minimum of ₦${minOrder.toLocaleString("en-NG")}.`);
  }

  let discount = 0;
  if (input.couponCode) {
    const result = await validateCouponCode(input.couponCode, subtotal, deliveryFee);
    if (!result.ok || !result.coupon) throw new Error(result.error ?? "Coupon is not valid.");
    discount = result.coupon.discountAmount;
  }

  const fee = input.orderType === "DELIVERY" ? deliveryFee : 0;
  const total = Math.max(0, subtotal - discount + fee);

  const created = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: null, // set by caller via update if a session exists
        orderType: input.orderType,
        status: "PENDING",
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        note: input.note || null,
        scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
        addressText: input.address ? `${input.address.street}, ${input.address.city}, ${input.address.state}` : null,
        subtotal: new Prisma.Decimal(subtotal),
        deliveryFee: new Prisma.Decimal(fee),
        discount: new Prisma.Decimal(discount),
        total: new Prisma.Decimal(total),
        couponCode: input.couponCode || null,
        etaMin:
          input.orderType === "DELIVERY"
            ? numericSetting(settings, "delivery_eta_min", 45)
            : numericSetting(settings, "pickup_eta_min", 20),
        statusHistory: [
          {
            status: "PENDING",
            at: new Date().toISOString(),
            msg: "Order received. Awaiting payment confirmation.",
          },
        ],
        items: {
          create: lines.map((line) => ({
            menuItemId: line.menuItem.id,
            name: line.menuItem.name,
            categoryName: line.menuItem.categoryName,
            imageUrl: line.menuItem.imageUrl,
            price: new Prisma.Decimal(line.menuItem.price),
            quantity: line.qty,
            note: line.note || null,
            customizations: line.options,
          })),
        },
      },
      include: { items: true },
    });

    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        amount: new Prisma.Decimal(total),
        status: "PENDING",
        provider: "DEMO",
        reference: `CHW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase(),
        metadata: {
          attempts: [
            {
              at: new Date().toISOString(),
              action: "payment_initialized",
              provider: process.env.DEMO_MODE === "true" ? "demo" : "unconfigured",
              status: "PENDING",
            },
          ],
        },
      },
    }).catch(async (err) => {
      // Keep the order coherent if payment creation fails.
      await tx.order.delete({ where: { id: order.id } });
      throw err;
    });

    return { order, payment };
  });

  return { order: created.order, payment: created.payment, deliveryFee: fee, discount, total };
}

export type { AppliedCoupon };