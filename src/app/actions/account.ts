"use server";

import { prisma } from "@/lib/db";
import { getSessionPayload, requireUser } from "@/lib/auth";
import { profileSchema, addressSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; error?: string };

export async function updateProfile(input: unknown): Promise<Result> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data." };
  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Not authenticated." };

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/account");
  return { ok: true };
}

export async function upsertAddress(input: unknown): Promise<Result & { id?: string }> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address." };
  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Not authenticated." };

  const data = parsed.data;

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.userId }, data: { isDefault: false } });
  }

  const result = await prisma.address.upsert({
    where: { id: data.id ?? "nonexistent" },
    create: {
      userId: session.userId,
      label: data.label,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip || null,
      isDefault: data.isDefault ?? false,
    },
    update: {
      label: data.label,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip || null,
      isDefault: data.isDefault ?? false,
    },
  });

  revalidatePath("/account");
  return { ok: true, id: result.id };
}

export async function deleteAddress(id: string): Promise<Result> {
  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Not authenticated." };

  await prisma.address.deleteMany({ where: { id, userId: session.userId } });
  revalidatePath("/account");
  return { ok: true };
}

export async function getAddresses() {
  const session = await getSessionPayload();
  if (!session) return [];
  return prisma.address.findMany({ where: { userId: session.userId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
}

export async function getOrderHistory() {
  const session = await getSessionPayload();
  if (!session) return [];
  return prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getReservations() {
  const session = await getSessionPayload();
  if (!session) return [];
  const upcoming = await prisma.reservation.findMany({
    where: { userId: session.userId, date: { gte: new Date() }, status: { notIn: ["CANCELLED", "REJECTED", "COMPLETED"] } },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
  const past = await prisma.reservation.findMany({
    where: { userId: session.userId, OR: [{ date: { lt: new Date() } }, { status: { in: ["CANCELLED", "REJECTED", "COMPLETED"] } }] },
    orderBy: [{ date: "desc" }],
    take: 20,
  });
  return { upcoming, past };
}

export async function getDashboardSummary() {
  const session = await getSessionPayload();
  if (!session) return null;
  const [user, recentOrders, upcomingReservations] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, include: { customer: true } }),
    prisma.order.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.reservation.findMany({
      where: { userId: session.userId, date: { gte: new Date() }, status: { notIn: ["CANCELLED", "REJECTED", "COMPLETED"] } },
      orderBy: [{ date: "asc" }],
      take: 3,
    }),
  ]);
  return { user, recentOrders, upcomingReservations };
}