"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDateTime, formatMoney } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { updateOrderStatus } from "@/app/actions/admin";

type OrderLite = {
  id: string;
  orderNumber: number;
  createdAt: Date;
  status: string;
  orderType: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  addressText: string | null;
  total: number;
  items: Array<{ id: string; name: string; quantity: number; price: number; note: string | null }>;
  payment: { status: string; reference: string; method: string | null } | null;
};

type Props = {
  orders: OrderLite[];
  page: number;
  totalPages: number;
  currentStatus?: string;
  query?: string;
};

export function OrdersTable({ orders, page, totalPages, currentStatus, query }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(query ?? "");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  function applyStatus(status: string) {
    const q = search ? `&q=${encodeURIComponent(search)}` : "";
    router.push(`/admin/orders?status=${status === "ALL" ? "" : status}${q}`);
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/admin/orders?q=${encodeURIComponent(search)}`);
  }

  async function setStatus(id: string, status: string) {
    setUpdating(id);
    const result = await updateOrderStatus(id, status);
    setUpdating(null);
    if (!result.ok) {
      toast.error(result.error ?? "Could not update status.");
      return;
    }
    toast.success(`Order marked ${ORDER_STATUS_LABEL[status] ?? status}.`);
    router.refresh();
  }

  const statusClass: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-sky-100 text-sky-800",
    PREPARING: "bg-violet-100 text-violet-800",
    READY: "bg-indigo-100 text-indigo-800",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-neutral-200 text-neutral-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {["ALL", ...ORDER_STATUS_ORDER, "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => applyStatus(s)}
              className={cn(
                "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors",
                (currentStatus ?? "ALL") === s
                  ? "border-gold bg-gold text-night"
                  : "border-white/15 text-paper/70 hover:border-gold/50 hover:text-paper",
              )}
            >
              {s === "ALL" ? "All" : ORDER_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <form onSubmit={applySearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone or #number"
            className="rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
          />
          <button type="submit" className="rounded-sm border border-white/15 px-3 text-sm text-paper/70 hover:border-gold hover:text-gold">Search</button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No orders found.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Order</th>
                <th className="hidden px-4 py-3 md:table-cell">Customer</th>
                <th className="hidden px-4 py-3 sm:table-cell">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <OrderRow
                  key={o.id}
                  order={o}
                  expanded={expanded === o.id}
                  onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
                  onStatus={setStatus}
                  updating={updating === o.id}
                  statusClass={statusClass}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            disabled={page <= 1}
            onClick={() => router.push(`/admin/orders?page=${page - 1}${currentStatus && currentStatus !== "ALL" ? `&status=${currentStatus}` : ""}${query ? `&q=${encodeURIComponent(query)}` : ""}`)}
            className="flex items-center gap-1 rounded-sm border border-white/15 px-3 py-1.5 text-paper/70 hover:border-gold hover:text-gold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <p className="text-paper/50">Page {page} of {totalPages}</p>
          <button
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/orders?page=${page + 1}${currentStatus && currentStatus !== "ALL" ? `&status=${currentStatus}` : ""}${query ? `&q=${encodeURIComponent(query)}` : ""}`)}
            className="flex items-center gap-1 rounded-sm border border-white/15 px-3 py-1.5 text-paper/70 hover:border-gold hover:text-gold disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onStatus,
  updating,
  statusClass,
}: {
  order: OrderLite;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (id: string, status: string) => void;
  updating: boolean;
  statusClass: Record<string, string>;
}) {
  return (
    <>
      <tr className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
        <td className="px-4 py-3">
          <Link href={`/order/track?number=${order.orderNumber}`} className="font-mono font-semibold text-paper">
            #{String(order.orderNumber).padStart(4, "0")}
          </Link>
          <p className="text-xs text-paper/40">{formatDateTime(order.createdAt)}</p>
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <p className="font-medium text-paper">{order.customerName}</p>
          <p className="text-xs text-paper/40">{order.customerPhone}{order.customerEmail ? ` · ${order.customerEmail}` : ""}</p>
        </td>
        <td className="hidden px-4 py-3 sm:table-cell">
          <span className={cn("rounded-sm px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider", order.orderType === "DELIVERY" ? "bg-sky-100 text-sky-800" : "bg-gold text-night")}>
            {order.orderType === "DELIVERY" ? "Delivery" : "Pickup"}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-sm px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider", statusClass[order.status] ?? "bg-white/10 text-paper")}>
              {ORDER_STATUS_LABEL[order.status] ?? order.status}
            </span>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => onStatus(order.id, e.target.value)}
              className="rounded-sm border border-white/15 bg-night px-1.5 py-1 text-xs text-paper/70 focus:border-gold focus:outline-none disabled:opacity-50"
              aria-label="Change status"
            >
              {[...ORDER_STATUS_ORDER, "CANCELLED"].map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-serif font-semibold text-gold">{formatMoney(order.total)}</td>
        <td className="px-4 py-3 text-right">
          <button onClick={onToggle} className="text-paper/40 hover:text-gold" aria-label="Toggle details">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-white/10 bg-white/[0.03]">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-paper/50">Items</h4>
                <ul className="mt-2 space-y-1.5">
                  {order.items.map((i) => (
                    <li key={i.id} className="flex items-center justify-between text-sm">
                      <span><span className="font-mono text-gold">{i.quantity}×</span> {i.name}</span>
                      <span className="text-paper/60">{formatMoney(i.price * i.quantity)}</span>
                    </li>
                  ))}
                  {order.items.length === 0 && <li className="text-xs text-paper/40">No item records.</li>}
                </ul>
                {order.addressText && (
                  <p className="mt-3 text-xs text-paper/50"><span className="font-semibold text-paper/70">Deliver to:</span> {order.addressText}</p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-paper/50">Payment</h4>
                {order.payment ? (
                  <ul className="mt-2 space-y-1 text-sm text-paper/70">
                    <li>Status: <span className="font-semibold text-paper">{PAYMENT_STATUS_LABEL[order.payment.status] ?? order.payment.status}</span></li>
                    <li>Method: <span className="font-semibold text-paper">{order.payment.method ?? "—"}</span></li>
                    <li>Reference: <span className="font-mono text-xs">{order.payment.reference}</span></li>
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-paper/40">No payment record. This may be a demo or legacy order.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}