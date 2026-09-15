"use client";

import { Banknote, ClipboardList, CalendarCheck, AlertCircle, Users, Receipt } from "lucide-react";

import { formatMoney } from "@/lib/utils";

type Stats = {
  todayRevenue: number;
  todayOrders: number;
  todayReservations: number;
  pendingOrders: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export function KpiCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Today's revenue", value: formatMoney(stats.todayRevenue), icon: Banknote, sub: `${formatMoney(stats.totalRevenue)} lifetime` },
    { label: "Today's orders", value: String(stats.todayOrders), icon: ClipboardList, sub: `${stats.totalOrders} all time` },
    { label: "Reservations today", value: String(stats.todayReservations), icon: CalendarCheck, sub: "excl. cancelled" },
    { label: "Pending orders", value: String(stats.pendingOrders), icon: AlertCircle, sub: "need your attention", accent: stats.pendingOrders > 0 },
    { label: "Customers", value: String(stats.totalCustomers), icon: Users, sub: "registered accounts" },
    { label: "Total revenue", value: formatMoney(stats.totalRevenue), icon: Receipt, sub: "all successful payments" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className={
            c.accent
              ? "rounded-sm border border-gold/50 bg-gold/10 p-4"
              : "rounded-sm border border-white/10 bg-white/5 p-4"
          }
        >
          <c.icon className={c.accent ? "h-5 w-5 text-gold" : "h-5 w-5 text-paper/40"} />
          <p className="mt-3 font-serif text-2xl text-paper">{c.value}</p>
          <p className="mt-0.5 text-xs text-paper/50">{c.label}</p>
          <p className="mt-1 text-[0.65rem] text-paper/35">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}