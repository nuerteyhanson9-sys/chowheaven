import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSessionPayload } from "@/lib/auth";
import { OrderTracker } from "@/components/orders/order-tracker";

export const metadata: Metadata = { title: "Track Your Order" };

type Props = { searchParams: Promise<{ id?: string; key?: string }> };

export default async function TrackPage({ searchParams }: Props) {
  const params = await searchParams;
  let initial = null;

  if (params.id && params.key) {
    const [order, session] = await Promise.all([
      prisma.order.findUnique({ where: { id: params.id }, include: { items: true, payment: true } }),
      getSessionPayload(),
    ]);
    const accessOk =
      order && ((session && order.userId === session.userId) || order.payment?.reference === params.key);
    if (order && accessOk) {
      initial = {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        orderType: order.orderType,
        addressText: order.addressText,
        etaMin: order.etaMin,
        createdAt: order.createdAt.toISOString(),
        scheduledFor: order.scheduledFor?.toISOString() ?? null,
        statusHistory: order.statusHistory as Array<{ status: string; at: string; msg?: string }>,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.quantity,
        })),
      };
    }
  }

  return (
    <section className="pt-32 pb-24 min-h-screen">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Live updates</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">Track Your Order</h1>
        <p className="mt-4 max-w-lg text-[15px] text-ink-muted">
          Follow your meal from the kitchen to your door — refreshed live as our team updates it.
        </p>
        <div className="mt-10">
          <OrderTracker initial={initial} />
        </div>
      </div>
    </section>
  );
}