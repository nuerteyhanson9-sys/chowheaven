"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { OrderCard } from "@/components/account/order-card";

type OrderLite = {
  id: string;
  orderNumber: number;
  createdAt: Date;
  status: string;
  total: { toNumber(): number };
  items: Array<{ id: string; name: string; quantity: number; imageUrl: string | null }>;
};

type Props = {
  orders: OrderLite[];
  reviewedOrderIds: Set<string>;
};

const TABS: { value: string; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrderHistoryList({ orders, reviewedOrderIds }: Props) {
  const [filter, setFilter] = useState("ALL");

  const filtered = orders.filter((o) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return !["DELIVERED", "CANCELLED"].includes(o.status);
    return o.status === filter;
  });

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              filter === tab.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink",
            )}
          >
            {tab.label}
            {tab.value === "ALL" && <span className="ml-1 text-ink-faint">({orders.length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">No orders match this filter.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              createdAt={order.createdAt}
              status={order.status}
              total={order.total}
              items={order.items}
              reviewed={reviewedOrderIds.has(order.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}