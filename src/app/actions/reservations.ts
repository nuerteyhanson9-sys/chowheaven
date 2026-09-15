"use server";

import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { reservationSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; error?: string; id?: string };

export async function createReservation(input: unknown): Promise<Result> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your reservation details." };
  }
  const session = await getSessionPayload();
  const data = parsed.data;

  const reservation = await prisma.reservation.create({
    data: {
      userId: session?.userId ?? null,
      name: data.name.trim(),
      phone: data.phone,
      email: data.email || null,
      date: data.date,
      time: data.time,
      guests: data.guests,
      occasion: data.occasion,
      specialRequest: data.specialRequest || null,
      status: "PENDING",
    },
  });

  revalidatePath("/reservations");
  return { ok: true, id: reservation.id };
}

export async function cancelReservation(id: string): Promise<Result> {
  const session = await getSessionPayload();
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) return { ok: false, error: "Reservation not found." };
  if (session && reservation.userId !== session.userId) return { ok: false, error: "Not authorized." };
  if (["CANCELLED", "COMPLETED"].includes(reservation.status)) return { ok: false, error: "This reservation can't be cancelled." };

  await prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED", updatedAt: new Date() },
  });

  revalidatePath("/");
  return { ok: true };
}

export async function getUpcomingReservations() {
  const session = await getSessionPayload();
  if (!session) return [];
  return prisma.reservation.findMany({
    where: { userId: session.userId, date: { gte: new Date() }, status: { notIn: ["CANCELLED", "REJECTED", "COMPLETED"] } },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
}

export async function getPastReservations() {
  const session = await getSessionPayload();
  if (!session) return [];
  return prisma.reservation.findMany({
    where: { userId: session.userId, OR: [{ date: { lt: new Date() } }, { status: { in: ["CANCELLED", "REJECTED", "COMPLETED"] } }] },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 20,
  });
}