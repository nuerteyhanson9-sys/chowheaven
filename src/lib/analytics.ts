import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { todayKey } from "@/lib/utils";

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function dashboardStats() {
  const now = new Date();
  const today = startOfDay(now);

  const [totalOrders, pendingOrders, todayOrders, todayReservations, totalCustomers, totalRevenueRow] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.reservation.count({ where: { date: today, status: { notIn: ["CANCELLED", "REJECTED"] } } }),
    prisma.customer.count(),
    prisma.payment.aggregate({ where: { status: "SUCCESSFUL" }, _sum: { amount: true } }),
  ]);

  const todayRevenueRow = await prisma.payment.aggregate({
    where: { status: "SUCCESSFUL", createdAt: { gte: today } },
    _sum: { amount: true },
  });

  return {
    totalOrders,
    pendingOrders,
    todayOrders,
    todayReservations,
    totalCustomers,
    totalRevenue: Number(totalRevenueRow._sum.amount ?? 0),
    todayRevenue: Number(todayRevenueRow._sum.amount ?? 0),
  };
}

export async function revenueByDay(days = 14) {
  const rows = await prisma.$queryRaw<Array<{ day: string; revenue: number }>>`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS day,
      SUM(amount)::numeric AS revenue
    FROM "Payment"
    WHERE status = 'SUCCESSFUL'
      AND created_at >= (NOW() - ${days}::int * INTERVAL '1 day')
    GROUP BY day
    ORDER BY day ASC
  `;
  return rows.map((r) => ({ date: r.day, value: Number(r.revenue) }));
}

export async function ordersByDay(days = 14) {
  const rows = await prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS day,
      COUNT(*) AS count
    FROM "Order"
    WHERE created_at >= (NOW() - ${days}::int * INTERVAL '1 day')
    GROUP BY day
    ORDER BY day ASC
  `;
  return rows.map((r) => ({ date: r.day, value: Number(r.count) }));
}

export async function popularDishes(limit = 10) {
  const rows = await prisma.$queryRaw<Array<{ name: string; qty: bigint; revenue: number }>>`
    SELECT
      oi.name,
      SUM(oi.quantity)::int AS qty,
      SUM(oi.price::numeric * oi.quantity)::numeric AS revenue
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    WHERE o.status != 'CANCELLED'
    GROUP BY oi.name
    ORDER BY qty DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ name: r.name, quantity: Number(r.qty), revenue: Number(r.revenue) }));
}

export async function ordersByCategory(limit = 10) {
  const rows = await prisma.$queryRaw<Array<{ category: string; count: bigint }>>`
    SELECT
      COALESCE(oi."categoryName", 'Other') AS category,
      COUNT(*) AS count
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    WHERE o.status != 'CANCELLED'
    GROUP BY category
    ORDER BY count DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
}

export async function reservationTrend(days = 14) {
  const rows = await prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS day,
      COUNT(*) AS count
    FROM "Reservation"
    WHERE created_at >= (NOW() - ${days}::int * INTERVAL '1 day')
    GROUP BY day
    ORDER BY day ASC
  `;
  return rows.map((r) => ({ date: r.day, value: Number(r.count) }));
}