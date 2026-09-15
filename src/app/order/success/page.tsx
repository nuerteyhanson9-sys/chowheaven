import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MapPin, Clock, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/db";
import { formatMoney, formatDateTime, formatTime } from "@/lib/utils";
import { getSessionPayload } from "@/lib/auth";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false } };

type Props = { searchParams: Promise<{ id?: string; key?: string }> };

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.id) notFound();

  const [order, session] = await Promise.all([
    prisma.order.findUnique({ where: { id: params.id }, include: { items: true, payment: true } }),
    getSessionPayload(),
  ]);

  const accessOk =
    order &&
    ((session && order.userId === session.userId) ||
      (params.key && order.payment?.reference === params.key));

  if (!order || !accessOk) notFound();

  const payment = order.payment;
  const paid = payment?.status === "SUCCESSFUL";

  return (
    <section className="pt-32 pb-24 min-h-screen">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 animate-pop-in items-center justify-center rounded-full bg-gold text-night">
            <Check className="h-8 w-8" />
          </span>
          <p className="eyebrow mt-6 justify-center">Order confirmed</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tightest">
            Thanks, {order.customerName.split(" ")[0]}!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
            Your order <span className="font-bold text-ink">#{order.orderNumber}</span> is confirmed
            {order.orderType === "DELIVERY" ? " and heading your way" : " and ready for pickup"}. We&apos;ve saved
            your reference: <span className="font-mono text-xs text-gold-deep">{payment?.reference}</span>
          </p>
        </div>

        {!paid && (
          <p className="mx-auto mt-6 max-w-md rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-center text-sm text-ink-muted">
            {payment?.status === "FAILED"
              ? "Your payment was declined. Please return to checkout to complete payment."
              : "Your payment is still pending confirmation."}
          </p>
        )}

        <div className="card-shell mt-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl text-ink">Order #{order.orderNumber}</h2>
              <p className="mt-0.5 text-sm text-ink-muted">{formatDateTime(order.createdAt)}</p>
            </div>
            <span className="tag-chip bg-burgundy/5 text-burgundy">{ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
          </div>

          <div className="mt-6 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-ink/5 pb-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-paper-deep text-[10px] text-ink-faint">Chow</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{item.quantity} × {item.name}</p>
                  {item.categoryName && <p className="text-xs text-ink-faint">{item.categoryName}</p>}
                </div>
                <span className="text-sm font-medium text-ink">{formatMoney(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 text-sm">
            <SummaryRow label="Subtotal" value={formatMoney(Number(order.subtotal))} />
            <SummaryRow label="Delivery" value={Number(order.deliveryFee) > 0 ? formatMoney(Number(order.deliveryFee)) : "Free"} />
            {Number(order.discount) > 0 && <SummaryRow label={`Discount ${order.couponCode ?? ""}`} value={`-${formatMoney(Number(order.discount))}`} accent />}
            <div className="flex justify-between border-t border-ink/10 pt-2.5 font-serif text-lg font-bold">
              <span>Total</span>
              <span className="text-burgundy">{formatMoney(Number(order.total))}</span>
            </div>
          </div>
        </div>

        <div className="card-shell mt-6 grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                {order.orderType === "DELIVERY" ? "Delivering to" : "Pick up at"}
              </p>
              <p className="mt-1 text-sm text-ink">{order.addressText ?? "Chow Heaven, 42 Market Street, Lagos Island"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Estimated</p>
              <p className="mt-1 text-sm text-ink">
                {order.scheduledFor
                  ? `Scheduled for ${formatDateTime(order.scheduledFor)}`
                  : `About ${order.etaMin ?? 45} minutes${order.orderType === "DELIVERY" ? "" : " — please arrive on time"} `}
              </p>
              {order.scheduledFor && order.etaMin && <p className="text-xs text-ink-faint">ETA {formatTime(order.scheduledFor)}</p>}
            </div>
          </div>
        </div>

        {Number(order.total) < 0.001 && (
          <p className="mt-4 text-xs text-ink-faint" aria-hidden>
            Demo build — reference {payment?.id}
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={`/order/track?id=${order.id}&key=${payment?.reference}`} className="btn-gold">
            Track My Order <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/menu" className="btn-outline">Order More</Link>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-ink-muted">
      <span>{label}</span>
      <span className={accent ? "font-semibold text-gold-deep" : "font-medium text-ink"}>{value}</span>
    </div>
  );
}