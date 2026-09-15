import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { getUpcomingReservations, getPastReservations } from "@/app/actions/reservations";
import { formatDate } from "@/lib/utils";
import { RESERVATION_STATUS_LABEL, OCCASION_LABEL } from "@/lib/constants";
import { CancelReservationButton } from "@/components/account/cancel-reservation-button";

export const metadata: Metadata = { title: "My Reservations" };
export const dynamic = "force-dynamic";

export default async function AccountReservationsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingReservations(), getPastReservations()]);

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Reservations</h2>
      <p className="mt-1 text-sm text-ink-muted">Manage your upcoming and past bookings.</p>

      {/* Upcoming */}
      <div className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-faint">Upcoming</h3>
        {upcoming.length === 0 ? (
          <div className="card-shell mt-4 p-6 text-sm text-ink-muted flex items-center justify-between">
            <p>No upcoming reservations.</p>
            <Link href="/reservations" className="font-semibold text-burgundy hover:underline">Book a table</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {upcoming.map((r) => {
              const dateLabel = formatDate(r.date, { weekday: "long" });
              const canCancel = ["PENDING", "CONFIRMED"].includes(r.status);
              return (
                <li key={r.id} className="card-shell flex flex-col justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold/15 text-gold-deep">
                      <CalendarClock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-serif text-lg text-ink">
                        {r.guests} {r.guests === 1 ? "guest" : "guests"} · {OCCASION_LABEL[r.occasion] ?? "Dining"}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">{dateLabel} at {r.time}</p>
                      {r.specialRequest && <p className="mt-1.5 text-xs text-ink-faint">Note: {r.specialRequest}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge">{RESERVATION_STATUS_LABEL[r.status] ?? r.status}</span>
                    {canCancel && <CancelReservationButton id={r.id} />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-faint">Past</h3>
          <ul className="mt-4 space-y-3">
            {past.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 py-3 last:border-0">
                <div>
                  <p className="text-sm text-ink">{formatDate(r.date)} at {r.time}</p>
                  <p className="text-xs text-ink-muted">{r.guests} guest{r.guests > 1 ? "s" : ""}</p>
                </div>
                <span className="badge badge--muted">{RESERVATION_STATUS_LABEL[r.status] ?? r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}