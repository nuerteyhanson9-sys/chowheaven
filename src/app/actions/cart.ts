"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { type CartItem } from "@/lib/cart";

function sanitizeItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const itemId = typeof r.itemId === "string" ? r.itemId : "";
  const name = typeof r.name === "string" ? r.name : "";
  const price = Number(r.price);
  const qty = Math.max(1, Math.min(99, Number(r.qty) || 1));
  if (!itemId || !name || !Number.isFinite(price) || price < 0) return null;
  const options = Array.isArray(r.options)
    ? (r.options as Array<Record<string, unknown>>)
        .map((o) => ({
          groupName: String(o.groupName ?? ""),
          optionName: String(o.optionName ?? ""),
          priceModifier: Number(o.priceModifier) || 0,
        }))
        .filter((o) => o.groupName && o.optionName)
    : [];
  return {
    itemId,
    name,
    slug: typeof r.slug === "string" ? r.slug : "",
    price,
    imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : null,
    categoryName: typeof r.categoryName === "string" ? r.categoryName : null,
    qty,
    note: typeof r.note === "string" ? r.note.slice(0, 500) : undefined,
    options,
  };
}

export async function persistCart(items: unknown): Promise<{ ok: boolean; count: number }> {
  const session = await getSessionPayload();
  if (!session || !Array.isArray(items)) return { ok: false, count: 0 };
  const clean = items.map(sanitizeItem).filter(Boolean) as CartItem[];
  await prisma.cart.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, items: clean },
    update: { items: clean },
  });
  return { ok: true, count: clean.length };
}

export async function loadPersistedCart(): Promise<CartItem[]> {
  const session = await getSessionPayload();
  if (!session) return [];
  const cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
  if (!cart) return [];
  const raw = cart.items as unknown;
  if (!Array.isArray(raw)) return [];
  return raw.map(sanitizeItem).filter(Boolean) as CartItem[];
}

/** Called once an order is placed so the DB cart doesn't keep stale items. */
export async function resetPersistedCart(): Promise<void> {
  const session = await getSessionPayload();
  if (!session) return;
  await prisma.cart.update({ where: { userId: session.userId }, data: { items: [] } }).catch(() => {});
  revalidatePath("/cart");
}

export async function adminCartRevalidate() {
  revalidatePath("/");
}