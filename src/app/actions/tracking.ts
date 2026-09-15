"use server";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";

type TrackResult =
  | { ok: true; order: null }
  | { ok: true; order: {
      id: string;
      orderNumber: number;
      customerName: string;
      status: string;
      orderType: "DELIVERY" | "PICKUP";
      addressText: string | null;
      etaMin: number | null;
      createdAt: string;
      scheduledFor: string | null;
      statusHistory: Array<{ status: string; at: string; msg?: string }>;
      items: Array<{ id: string; name: string; qty: number }>;
    } }
  | { ok: false; error: string };

export async function track(orderNumber: number, phone: string): Promise<TrackResult> {
  const session = await getSessionPayload();

  const where: Record<string, unknown> = { orderNumber };
  if (phone) {
    where.customerPhone = { contains: phone.replace(/\D/g, "").slice(-6) };
  } else if (session) {
    where.userId = session.userId;
  } else {
    return { ok: false, error: "Enter your phone number to look up this order." };
  }

  const order = await prisma.order.findFirst({
    where,
    include: { items: true, payment: true },
  });

  if (!order) return { ok: true, order: null };

  return {
    ok: true,
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      status: order.status,
      orderType: order.orderType,
      addressText: order.addressText,
      etaMin: order.etaMin,
      createdAt: order.createdAt.toISOString(),
      scheduledFor: order.scheduledFor?.toISOString() ?? null,
      statusHistory: (order.statusHistory as Array<{ status: string; at: string; msg?: string }>) ?? [],
      items: order.items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity })),
    },
  };
}