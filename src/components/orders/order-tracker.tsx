"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { ORDER_STATUS_ORDER, ORDER_STATUS_LABEL } from "@/lib/constants";
import { track } from "@/app/actions/tracking";

type TrackedOrder = {
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
};

export function OrderTracker({ initial }: { initial: TrackedOrder | null }) {
  const [order, setOrder] = useState<TrackedOrder | null>(initial);
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    const num = Number(number.trim());
    if (!num || !phone.trim()) {
      setError("Enter your order number and the phone number used to order.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await track(num, phone.trim());
    setLoading(false);
    if (!result.ok || !result.order) {
      setError("We couldn't find an order with those details. Double-check and try again.");
      return;
    }
    setOrder(result.order);
  }

  useEffect(() => {
    if (!order) return;
    const interval = window.setInterval(async () => {
      const result = await track(order.orderNumber, "");
      if (result.ok && result.order && result.order.status !== order.status) {
        setOrder(result.order);
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [order]);

  if (order) {
    return (
      <div className="space-y-6">
        <div className="card-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-ink">Order #{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Placed {formatDate(order.createdAt)} · {order.customerName}
              </p>
            </div>
            <button onClick={() => { setOrder(null); setNumber(""); setPhone(""); }} className="btn-ghost">
              <X className="h-4 w-4" /> New lookup
            </button>
          </div>

          <div className="mt-6 rounded-sm border border-ink/10 bg-paper-warm px-4 py-3 text-sm text-ink-muted">
            {order.items.map((item) => (
              <span key={item.id} className="mr-3">{item.qty} × {item.name}</span>
            ))}
          </div>

          <div className="mt-8">
            <OrderTimeline status={order.status} orderType={order.orderType} history={order.statusHistory} />
          </div>

          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-sm border border-ink/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Status</p>
              <p className="mt-1 font-semibold text-ink">{ORDER_STATUS_LABEL[order.status] ?? order.status}</p>
            </div>
            <div className="rounded-sm border border-ink/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Estimated</p>
              <p className="mt-1 font-semibold text-ink">
                {order.scheduledFor
                  ? `${formatDate(order.scheduledFor)} at ${formatTime(order.scheduledFor)}`
                  : `≈ ${order.etaMin ?? 45} min`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={lookup} className="card-shell max-w-lg p-6 sm:p-8">
      <h2 className="font-serif text-xl text-ink">Find your order</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Use the order number from your confirmation and the phone you ordered with.
      </p>
      <div className="mt-6 space-y-4">
        <Input label="Order number" type="number" inputMode="numeric" placeholder="e.g. 1024" value={number} onChange={(e) => setNumber(e.target.value)} />
        <Input label="Phone number" type="tel" placeholder="e.g. 0803 555 0199" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Track Order
        </Button>
      </div>
    </form>
  );
}

export function OrderTimeline({
  status,
  orderType,
  history,
}: {
  status: string;
  orderType: "DELIVERY" | "PICKUP";
  history?: Array<{ status: string; at: string; msg?: string }>;
}) {
  const cancelled = status === "CANCELLED";
  const steps = ORDER_STATUS_ORDER.map((s) => (orderType === "PICKUP" && s === "OUT_FOR_DELIVERY" ? "READY" : s));
  const currentIndex = steps.indexOf(status as (typeof ORDER_STATUS_ORDER)[number]);
  const labelsForPickup: Record<string, string> = {
    ...ORDER_STATUS_LABEL,
    OUT_FOR_DELIVERY: "Ready for pickup",
  };

  const historyByStatus = new Map<string, { at: string; msg?: string }>();
  for (const h of history ?? []) {
    historyByStatus.set(h.status, h);
  }

  if (cancelled) {
    return (
      <div className="rounded-sm border border-burgundy/30 bg-burgundy/5 p-4 text-sm text-burgundy">
        This order was cancelled. Chat with us if you need help.
      </div>
    );
  }

  return (
    <ol className="relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-ink/10 sm:left-[19px]" aria-hidden />
      <div
        className="absolute left-[15px] top-4 w-px bg-gold transition-all duration-700 sm:left-[19px]"
        style={{ height: currentIndex >= 0 ? `${((currentIndex + 1) / steps.length) * 100}%` : "0%" }}
        aria-hidden
      />
      {steps.map((step, i) => {
        const entry = historyByStatus.get(step as string);
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-10 sm:w-10",
                done ? "animate-pop-in border-gold bg-gold text-night" : "border-ink/15 bg-paper-card text-ink-faint",
                isCurrent && "ring-4 ring-gold/25",
              )}
            >
              {done ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm font-bold", done ? "text-ink" : "text-ink-faint")}>
                {orderType === "PICKUP" ? labelsForPickup[step] ?? ORDER_STATUS_LABEL[step] : ORDER_STATUS_LABEL[step]}
              </p>
              {entry && <p className="mt-0.5 text-xs text-ink-muted">{formatTime(entry.at)}</p>}
              {isCurrent && <p className="mt-1 max-w-sm text-xs text-gold-deep">{entry?.msg}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}