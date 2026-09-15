"use server";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; added?: boolean; error?: string };

export async function toggleFavorite(itemId: string): Promise<Result> {
  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Please sign in to save favorites." };

  const existing = await prisma.favorite.findUnique({
    where: { userId_menuItemId: { userId: session.userId, menuItemId: itemId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/menu");
    return { ok: true, added: false };
  }

  await prisma.favorite.create({ data: { userId: session.userId, menuItemId: itemId } });
  revalidatePath("/menu");
  return { ok: true, added: true };
}

export async function getFavoriteIds(): Promise<Set<string>> {
  const session = await getSessionPayload();
  if (!session) return new Set();
  const favs = await prisma.favorite.findMany({ where: { userId: session.userId }, select: { menuItemId: true } });
  return new Set(favs.map((f) => f.menuItemId));
}

export async function getFavoriteItems() {
  const session = await getSessionPayload();
  if (!session) return [];
  return prisma.favorite.findMany({
    where: { userId: session.userId },
    include: { menuItem: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}