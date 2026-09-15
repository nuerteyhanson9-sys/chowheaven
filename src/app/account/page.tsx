import Link from "next/link";
import {
  ShoppingBag,
  CalendarClock,
  Heart,
  Star,
  MapPin,
} from "lucide-react";

import { getDashboardSummary } from "@/app/actions/account";
import { getFavoriteIds } from "@/app/actions/favorites";
import { OrderCard } from "@/components/account/order-card";
import { formatDate } from "@/lib/utils";
import { OCCASION_LABEL, RESERVATION_STATUS_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const [summary, favIds] = await Promise.all([getDashboardSummary(), getFavoriteIds()]);
  if (!summary) return null;
  const { user, recentOrders, upcomingReservations } = summary;
  const customer = user?.customer;

  return (
    <div className="space-y-10">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total orders" value={customer?.ordersCount ?? 0} href="/account/orders" />
        <StatCard icon={CalendarClock} label="Upcoming reservations" value={upcomingReservations.length} href="/account/reservations" />
        <StatCard icon={Heart} label="Favourites" value={favIds.size} href="/account/favorites" />
        <StatCard icon={Star} label="Loyalty points" value={customer?.loyaltyPoints ?? 0} />
      </div>

      {/* Upcoming reservations */}
      <div>
        <h2 className="font-serif text-2xl text-ink">Upcoming reservations</h2>
        {upcomingReservations.length === 0 ? (
          <div className="card-shell mt-4 p-6 text-sm text-ink-muted">
            <p>No upcoming reservations.</p>
            <Link href="/reservations" className="mt-3 inline-block font-semibold text-burgundy hover:underline">Book a table →</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {upcomingReservations.map((r) => (
              <li key={r.id} className="card-shell flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-serif text-lg text-ink">
                    {r.guests} {r.guests === 1 ? "guest" : "guests"} · {OCCASION_LABEL[r.occasion] ?? r.occasion}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatDate(r.date, { weekday: "long" })} at {r.time}
                  </p>
                </div>
                <span className="badge">{RESERVATION_STATUS_LABEL[r.status] ?? r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl text-ink">Recent orders</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-burgundy hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card-shell mt-4 p-6 text-sm text-ink-muted">
            <p>No orders yet — time to change that.</p>
            <Link href="/menu" className="mt-3 inline-block font-semibold text-burgundy hover:underline">Explore the menu →</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                orderNumber={order.orderNumber}
                createdAt={order.createdAt}
                status={order.status}
                total={order.total}
                items={order.items}
                compact
              />
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink icon={MapPin} label="Manage addresses" href="/account/addresses" />
        <QuickLink icon={ShoppingBag} label="Order history" href="/account/orders" />
        <QuickLink icon={Star} label="Profile settings" href="/account/profile" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-2 font-serif text-2xl text-ink">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </>
  );

  return (
    <div className="card-shell flex flex-col items-center p-5 text-center">
      {href ? <Link href={href} className="flex h-full w-full flex-col items-center">{inner}</Link> : inner}
    </div>
  );
}

function QuickLink({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="card-shell flex items-center gap-4 p-5 transition-shadow hover:shadow-lift">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold/15 text-gold-deep">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </Link>
  );
}