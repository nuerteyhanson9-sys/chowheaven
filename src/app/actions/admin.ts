"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getSessionPayload, requireAdmin } from "@/lib/auth";
import {
  adminCategorySchema,
  adminCouponSchema,
  adminGallerySchema,
  adminMenuItemSchema,
} from "@/lib/validation";
import { slugify } from "@/lib/utils";

type Result = { ok: boolean; error?: string; id?: string };

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function updateOrderStatus(id: string, status: string): Promise<Result> {
  const session = await requireAdmin();
  const allowed = ["PENDING","CONFIRMED","PREPARING","READY","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"];
  if (!allowed.includes(status)) return { ok: false, error: "Invalid status." };

  const now = new Date().toISOString();
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return { ok: false, error: "Order not found." };

  const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as unknown[])] : [];

  await prisma.order.update({
    where: { id },
    data: {
      status: status as any,
      statusHistory: [...history, { status, at: now, msg: `Updated by ${session.role}` }] as Prisma.InputJsonValue[],
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function getAllOrders(params: { status?: string; q?: string; take?: number; skip?: number }) {
  const where: any = {};
  if (params.status && params.status !== "ALL") where.status = params.status;
  if (params.q) {
    const q = params.q;
    where.OR = [
      { orderNumber: Number.isNaN(Number(q)) ? undefined : Number(q) },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q } },
      { customerEmail: { contains: q, mode: "insensitive" } },
    ].filter(Boolean);
  }
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: params.take ?? 25,
      skip: params.skip ?? 0,
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total };
}

// ─── Menu ────────────────────────────────────────────────────────────────────

export async function upsertMenuItem(input: unknown): Promise<Result> {
  const parsed = adminMenuItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data." };
  await requireAdmin();

  const data = parsed.data;
  const slug = slugify(data.name);
  const itemsData = {
    name: data.name.trim(),
    slug,
    description: data.description,
    price: new Prisma.Decimal(data.price),
    discountPrice: data.discountPrice ? new Prisma.Decimal(data.discountPrice) : null,
    imageUrl: data.imageUrl || null,
    ingredients: data.ingredients ? data.ingredients.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    allergens: data.allergens ? data.allergens.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    tags: data.tags ? data.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    spiceLevel: data.spiceLevel,
    isVegetarian: data.isVegetarian,
    available: data.available,
    isFeatured: data.isFeatured,
    categoryId: data.categoryId,
  };

  if (data.id) {
    await prisma.menuItem.update({ where: { id: data.id }, data: itemsData });
  } else {
    await prisma.menuItem.create({ data: itemsData });
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteMenuItem(id: string): Promise<Result> {
  await requireAdmin();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { ok: true };
}

export async function getMenuItems() {
  return prisma.menuItem.findMany({ include: { category: true, options: true }, orderBy: { createdAt: "desc" } });
}

export async function toggleItemAvailability(id: string, available: boolean): Promise<Result> {
  await requireAdmin();
  await prisma.menuItem.update({ where: { id }, data: { available } });
  revalidatePath("/menu");
  return { ok: true };
}

export async function toggleItemFeatured(id: string, featured: boolean): Promise<Result> {
  await requireAdmin();
  await prisma.menuItem.update({ where: { id }, data: { isFeatured: featured } });
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true };
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function upsertCategory(input: unknown): Promise<Result> {
  const parsed = adminCategorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  await requireAdmin();
  const data = parsed.data;
  const slug = slugify(data.name);

  if (data.id) {
    await prisma.menuCategory.update({ where: { id: data.id }, data: { name: data.name.trim(), slug, description: data.description || null, ordering: data.ordering, imageUrl: data.imageUrl || null } });
  } else {
    await prisma.menuCategory.create({ data: { name: data.name.trim(), slug, description: data.description || null, ordering: data.ordering, imageUrl: data.imageUrl || null } });
  }
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<Result> {
  await requireAdmin();
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { ok: true };
}

export async function getCategories() {
  return prisma.menuCategory.findMany({ include: { _count: { select: { items: true } } }, orderBy: { ordering: "asc" } });
}

// ─── Reservations ────────────────────────────────────────────────────────────

export async function updateReservationStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();
  const allowed = ["PENDING","CONFIRMED","REJECTED","CANCELLED","ARRIVED","COMPLETED"];
  if (!allowed.includes(status)) return { ok: false, error: "Invalid status." };

  await prisma.reservation.update({ where: { id }, data: { status: status as any, updatedAt: new Date() } });
  revalidatePath("/admin/reservations");
  return { ok: true };
}

export async function getReservationsAdmin(params: { date?: string; status?: string; q?: string }) {
  const where: any = {};
  if (params.status && params.status !== "ALL") where.status = params.status;
  if (params.date) {
    const day = new Date(params.date);
    const next = new Date(day); next.setDate(next.getDate() + 1);
    where.date = { gte: day, lt: next };
  }
  if (params.q) {
    where.OR = [{ name: { contains: params.q, mode: "insensitive" } }, { phone: { contains: params.q } }];
  }
  return prisma.reservation.findMany({ where, orderBy: [{ date: "desc" }, { time: "desc" }], take: 50 });
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getAllCustomers() {
  return prisma.customer.findMany({
    include: { user: { select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function upsertGalleryImage(input: unknown): Promise<Result> {
  const parsed = adminGallerySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  await requireAdmin();
  const data = parsed.data;

  if (data.id) {
    await prisma.galleryImage.update({
      where: { id: data.id },
      data: { title: data.title, category: data.category, imageUrl: data.imageUrl, alt: data.alt || null, ordering: data.ordering, active: data.active },
    });
  } else {
    await prisma.galleryImage.create({
      data: { title: data.title, category: data.category, imageUrl: data.imageUrl, alt: data.alt || null, ordering: data.ordering, active: data.active },
    });
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function deleteGalleryImage(id: string): Promise<Result> {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function getGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: [{ ordering: "asc" }, { createdAt: "desc" }], take: 200 });
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function upsertCoupon(input: unknown): Promise<Result> {
  const parsed = adminCouponSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  await requireAdmin();
  const data = parsed.data;

  const values = {
    code: data.code.toUpperCase(),
    discountType: data.discountType,
    discountValue: new Prisma.Decimal(data.discountValue),
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    minOrderValue: new Prisma.Decimal(data.minOrderValue),
    usageLimit: data.usageLimit ?? null,
    active: data.active,
  };

  if (data.id) {
    await prisma.coupon.update({ where: { id: data.id }, data: values });
  } else {
    await prisma.coupon.create({ data: values });
  }
  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function deleteCoupon(id: string): Promise<Result> {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function upsertSettings(entries: Record<string, string>): Promise<Result> {
  await requireAdmin();
  for (const [key, value] of Object.entries(entries)) {
    await prisma.restaurantSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}

export async function getSettingsAdmin() {
  return prisma.restaurantSetting.findMany({ orderBy: { key: "asc" } });
}

export async function getPaymentsAdmin() {
  return prisma.payment.findMany({ include: { order: { select: { orderNumber: true, customerName: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
}