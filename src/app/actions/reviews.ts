"use server";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; error?: string };

export async function submitReview(input: unknown): Promise<Result> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Could not submit review." };

  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Please sign in to leave a review." };

  const { orderId, rating, comment } = parsed.data;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: "Order not found." };
  if (order.userId !== session.userId) return { ok: false, error: "Not authorized." };
  if (order.status !== "DELIVERED") return { ok: false, error: "You can review orders after they are delivered." };

  const existing = await prisma.review.findFirst({ where: { orderId, userId: session.userId } });
  if (existing) return { ok: false, error: "You have already reviewed this order." };

  await prisma.review.create({
    data: {
      userId: session.userId,
      orderId,
      rating,
      comment: comment || null,
      customerName: session.name,
    },
  });

  revalidatePath("/");
  return { ok: true };
}

export async function getPublicReviews() {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: [{ createdAt: "desc" }],
    take: 30,
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: { user: { select: { id: true, fullName: true, email: true } } },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });
}

export async function updateReviewApproval(id: string, approved: boolean): Promise<Result> {
  const session = await getSessionPayload();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) return { ok: false, error: "Not authorized." };
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/");
  return { ok: true };
}

export async function deleteReview(id: string): Promise<Result> {
  const session = await getSessionPayload();
  if (!session || session.role !== "ADMIN") return { ok: false, error: "Not authorized." };
  await prisma.review.delete({ where: { id } });
  revalidatePath("/");
  return { ok: true };
}