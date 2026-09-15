"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { resetPersistedCart } from "@/app/actions/cart";
import {
  createOrderRecord,
  type NewOrderInput,
  type OrderLineInput,
} from "@/lib/order-service";

type Result = { ok: boolean; error?: string; orderId?: string; paymentRef?: string };

/** Server-authoritative coupon validation endpoint called from client before checkout. */
export async function validateCoupon(input: { code: string; subtotal: number; deliveryFee: number }) {
  const { validateCouponCode } = await import("@/lib/order-service");
  return validateCouponCode(input.code, input.subtotal, input.deliveryFee);
}

/** Authoritative server-side order creation with full DB-resolved pricing. */
export async function submitOrder(input: NewOrderInput, cartLines: Array<{
  itemId: string;
  qty: number;
  options: Array<{ groupName: string; optionName: string; priceModifier: number }>;
  note?: string;
}>): Promise<Result> {
  if (!cartLines.length) return { ok: false, error: "Your cart is empty." };

  try {
    const { lines, subtotal } = await (await import("@/lib/order-service")).resolveOrderLines(cartLines);
    const result = await createOrderRecord(input, lines, subtotal);
    const session = await getSessionPayload();
    if (session) {
      await prisma.order.update({ where: { id: result.order.id }, data: { userId: session.userId } });
      await resetPersistedCart();
    }
    revalidatePath("/");
    return { ok: true, orderId: result.order.id, paymentRef: result.payment.reference };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to place order." };
  }
}

/**
 * Simulates payment processing.
 * In DEMO_MODE this runs synchronously and always succeeds — architecturally
 * correct states: PENDING → PROCESSING → SUCCESSFUL / FAILED.
 */
export async function processPayment(orderId: string, opts?: { fail?: boolean }): Promise<Result> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order || !order.payment) return { ok: false, error: "Order not found." };
  if (order.status !== "PENDING") return { ok: false, error: "This order cannot be paid for right now." };

  const payment = order.payment;
  if (payment.status === "SUCCESSFUL") return { ok: true, orderId: order.id, paymentRef: payment.reference };
  if (payment.status === "FAILED") return { ok: false, error: "This payment has failed. Please retry." };

  const now = new Date().toISOString();
  const attempts = Array.isArray(payment.metadata) ? [...(payment.metadata as unknown[])] : [];

  if (opts?.fail) {
    attempts.push({ at: now, action: "simulate_failure", provider: "demo", status: "FAILED" });
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        metadata: { attempts } as any,
      },
    });
    return { ok: false, error: "Payment was declined. Please try again or use a different method." };
  }

  // PROCESSING
  attempts.push({ at: now, action: "processing", provider: "demo", status: "PROCESSING" });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "PROCESSING", metadata: { attempts } as any },
  });

  // SUCCESSFUL
  const historyArr = [...(((order.statusHistory as unknown[]) as Array<{ status: string; at: string; msg?: string }>)),
    { status: "CONFIRMED", at: now, msg: "Payment confirmed." },
  ] as unknown as Prisma.InputJsonValue[];
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESSFUL",
        metadata: {
          attempts: [...attempts, { at: now, action: "completed", provider: "demo", status: "SUCCESSFUL" }],
        } as any,
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CONFIRMED",
        statusHistory: historyArr,
      },
    }),
  ]);

  // Update customer stats (best-effort, outside transaction)
  if (order.userId) {
    await prisma.customer.upsert({
      where: { userId: order.userId },
      create: {
        userId: order.userId,
        totalSpent: order.total,
        ordersCount: 1,
      },
      update: {
        totalSpent: { increment: order.total },
        ordersCount: { increment: 1 },
      },
    }).catch(() => {});
  }

  revalidatePath("/");
  return { ok: true, orderId: order.id, paymentRef: payment.reference };
}

/** Reset a FAILED payment so a customer can make a new attempt. */
export async function resetPaymentForRetry(orderId: string): Promise<Result> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order?.payment) return { ok: false, error: "Order not found." };
  if (order.payment.status === "SUCCESSFUL") return { ok: true };
  await prisma.payment.update({
    where: { id: order.payment.id },
    data: { status: "PENDING" },
  });
  return { ok: true };
}

/** For guests/lookup: returns a safe-to-render snapshot of an order. */
export async function lookupOrder(orderNumber: number, phone: string) {
  const order = await prisma.order.findFirst({
    where: { orderNumber, customerPhone: { contains: phone.replace(/\D/g, "").slice(-6) } },
    include: { items: true, payment: true },
  });
  return order;
}

export async function getOrderById(id: string) {
  const session = await getSessionPayload();
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true },
  });
  if (!order) return null;
  if (session && order.userId === session.userId) return order;
  return null;
}