"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn, formatDate } from "@/lib/utils";
import { RESERVATION_STATUS_LABEL, OCCASION_LABEL } from "@/lib/constants";
import { updateReservationStatus } from "@/app/actions/admin";

type ReservationLite = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: Date;
  time: string;
  guests: number;
  occasion: string;
  specialRequest: string | null;
  status: string;
};

const STATUSES = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "ARRIVED", "COMPLETED"];

export function ReservationsTable({
  reservations,
  currentDate,
  currentStatus,
  query,
}: {
  reservations: ReservationLite[];
  currentDate?: string;
  currentStatus?: string;
  query?: string;
}) {
  const router = useRouter();

  function apply(delta: { date?: string; status?: string; q?: string }) {
    const sp = new URLSearchParams();
    const date = delta.date ?? currentDate;
    const status = delta.status ?? currentStatus;
    const q = delta.q ?? query;
    if (date) sp.set("date", date);
    if (status && status !== "ALL") sp.set("status", status);
    if (q) sp.set("q", q);
    router.push(`/admin/reservations?${sp.toString()}`);
  }

  async function setStatus(id: string, status: string) {
    const result = await updateReservationStatus(id, status);
    if (!result.ok) {
      toast.error(result.error ?? "Could not update reservation.");
      return;
    }
    toast.success(`Reservation ${RESERVATION_STATUS_LABEL[status] ?? status}.`);
    router.refresh();
  }

  const statusClass: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    CANCELLED: "bg-neutral-200 text-neutral-700",
    ARRIVED: "bg-sky-100 text-sky-800",
    COMPLETED: "bg-violet-100 text-violet-800",
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          apply({ date: String(fd.get("date") ?? ""), q: String(fd.get("q") ?? "") });
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="grid gap-1 text-xs text-paper/50">
          Date
          <input type="date" name="date" defaultValue={currentDate ?? ""} className="rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none" />
        </label>
        <label className="grid gap-1 text-xs text-paper/50">
          Search
          <input type="text" name="q" defaultValue={query ?? ""} placeholder="Name or phone" className="rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none" />
        </label>
        <button className="rounded-sm border border-white/15 px-3 py-2 text-sm text-paper/70 hover:border-gold hover:text-gold">Filter</button>
        {(currentDate || currentStatus || query) && (
          <button
            type="button"
            onClick={() => router.push("/admin/reservations")}
            className="rounded-sm border border-white/15 px-3 py-2 text-sm text-paper/70 hover:border-gold hover:text-gold"
          >
            Clear
          </button>
        )}
      </form>

      <div className="no-scrollbar flex gap-1 overflow-x-auto">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => apply({ status: s })}
            className={cn(
              "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold",
              (currentStatus ?? "ALL") === s ? "border-gold bg-gold text-night" : "border-white/15 text-paper/70 hover:border-gold/50 hover:text-paper",
            )}
          >
            {s === "ALL" ? "All" : RESERVATION_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No reservations found.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Date & time</th>
                <th className="hidden px-4 py-3 md:table-cell">Party</th>
                <th className="hidden px-4 py-3 lg:table-cell">Occasion</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-paper">{r.name}</p>
                    <p className="text-xs text-paper/40">{r.phone}{r.email ? ` · ${r.email}` : ""}</p>
                    {r.specialRequest && <p className="mt-1 max-w-[220px] truncate text-xs italic text-paper/40" title={r.specialRequest}>“{r.specialRequest}”</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-paper">{formatDate(r.date, { weekday: "short" })}</p>
                    <p className="text-xs text-paper/40">{r.time}</p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{r.guests} guest{r.guests > 1 ? "s" : ""}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">{OCCASION_LABEL[r.occasion] ?? r.occasion}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-sm px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider", statusClass[r.status] ?? "bg-white/10 text-paper")}>
                      {RESERVATION_STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="rounded-sm border border-white/15 bg-night px-1.5 py-1 text-xs text-paper/70 focus:border-gold focus:outline-none"
                      aria-label="Change reservation status"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}