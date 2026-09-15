"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, PartyPopper, Clock } from "lucide-react";
import { toast } from "sonner";

import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createReservation } from "@/app/actions/reservations";
import { reservationSchema } from "@/lib/validation";
import { OCCASION_LABEL } from "@/lib/constants";

type ReservationFormProps = { user: { name: string; email: string } | null };

type Confirmation = {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  occasion: string;
  status: string;
};

export function ReservationForm({ user }: ReservationFormProps) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [form, setForm] = useState({
    date: "",
    time: "19:00",
    guests: "2",
    name: user?.name ?? "",
    phone: "",
    email: user?.email ?? "",
    specialRequest: "",
    occasion: "DINING",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = reservationSchema.safeParse({
      ...form,
      date: form.date ? new Date(form.date + "T00:00:00") : undefined,
      guests: Number(form.guests),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const result = await createReservation(parsed.data);
    setSubmitting(false);
    if (!result.ok || !result.id) {
      toast.error(result.error ?? "We couldn't book your table. Please try again.");
      return;
    }

    setConfirmed({
      id: result.id,
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      name: form.name,
      occasion: form.occasion,
      status: "PENDING",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmed) {
    const dateLabel = new Date(`${confirmed.date}T00:00:00`).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return (
      <div className="card-shell p-8 sm:p-10">
        <div className="flex flex-col items-start">
          <span className="animate-pop-in flex h-14 w-14 items-center justify-center rounded-full bg-gold text-night">
            <Check className="h-7 w-7" />
          </span>
          <h2 className="mt-6 font-serif text-3xl text-ink">Request received, {confirmed.name.split(" ")[0]}!</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
            Your reservation has been submitted. Our team reviews every booking and will confirm
            shortly via phone or email. Please arrive 10 minutes early.
          </p>
        </div>

        <dl className="mt-8 grid gap-4 rounded-sm border border-ink/10 bg-paper-warm p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
              <CalendarCheck className="h-3.5 w-3.5 text-gold" /> Date
            </dt>
            <dd className="mt-1 font-semibold text-ink">{dateLabel}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
              <Clock className="h-3.5 w-3.5 text-gold" /> Time
            </dt>
            <dd className="mt-1 font-semibold text-ink">{confirmed.time}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
              <PartyPopper className="h-3.5 w-3.5 text-gold" /> Guests
            </dt>
            <dd className="mt-1 font-semibold text-ink">{confirmed.guests} {confirmed.guests === 1 ? "guest" : "guests"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-faint">Occasion</dt>
            <dd className="mt-1 font-semibold text-ink">{OCCASION_LABEL[confirmed.occasion] ?? "Casual dining"}</dd>
          </div>
        </dl>

        <p className="mt-5 rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-xs text-ink-muted">
          Reference: <span className="font-mono text-gold-deep">RSV-{confirmed.id.slice(-8).toUpperCase()}</span>
          {user ? " · View it anytime under My Reservations." : " — sign in to manage reservations in your account."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link href="/account/reservations" className="btn-primary">View My Reservations</Link>
          ) : (
            <Link href="/login?next=/account/reservations" className="btn-primary">Create an Account</Link>
          )}
          <Button variant="outline" onClick={() => setConfirmed(null)}>Make another booking</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-shell p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-ink">Reservation details</h2>
      <p className="mt-1 text-sm text-ink-muted">Fields marked * are required.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="Date *"
          type="date"
          min={today}
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          error={errors.date}
        />
        <Input
          label="Time *"
          type="time"
          min="11:00"
          max="21:30"
          value={form.time}
          onChange={(e) => set("time", e.target.value)}
          error={errors.time}
        />
        <Input
          label="Number of guests *"
          type="number"
          min={1}
          max={40}
          value={form.guests}
          onChange={(e) => set("guests", e.target.value)}
          error={errors.guests}
        />
        <Select
          label="Occasion"
          value={form.occasion}
          onChange={(e) => set("occasion", e.target.value)}
          options={Object.entries(OCCASION_LABEL).map(([value, label]) => ({ value, label }))}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Full name *" placeholder="Chiamaka Eze" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <Input label="Phone *" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
      </div>
      <div className="mt-4">
        <Input label="Email" type="email" placeholder="you@email.com (for confirmation)" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      </div>
      <div className="mt-4">
        <Textarea
          label="Special request"
          placeholder="Window seat, cake for a birthday, dietary preferences…"
          value={form.specialRequest}
          onChange={(e) => set("specialRequest", e.target.value)}
          error={errors.specialRequest}
        />
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs text-ink-faint">No payment needed to reserve.</p>
        <Button type="submit" loading={submitting}>
          Reserve a Table
        </Button>
      </div>
    </form>
  );
}