import type { Metadata } from "next";
import Image from "next/image";
import { getSessionPayload } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { ReservationForm } from "@/components/reservations/reservation-form";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description: "Book a table at Chow Heaven for casual dining, birthdays, anniversaries and business dinners.",
};

export const revalidate = 120;

const IMG = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70";

export default async function ReservationsPage() {
  const [session, settings] = await Promise.all([getSessionPayload(), getSettings()]);

  return (
    <section className="pt-32 pb-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">
            Book your table
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-muted">
            Celebrate birthdays, anniversaries, proposals or simply a beautiful dinner
            with us. Tell us what brings you in and we&apos;ll take care of the rest.
          </p>

          <div className="relative mt-10 aspect-[4/3] overflow-hidden">
            <Image src={IMG} alt="Elegantly plated fine-dining dish at Chow Heaven" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>

          <div className="card-shell mt-8 p-6 text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink">Opening hours</p>
            <p className="mt-2 text-ink-muted">{settings.hours}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-ink">Bookings & parties</p>
            <p className="mt-2 text-ink-muted">
              For groups larger than 40 guests or private events, call{" "}
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="font-semibold text-burgundy">{settings.phone}</a>
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-ink">Location</p>
            <p className="mt-2 text-ink-muted">{settings.address}</p>
          </div>
        </div>

        <div className="lg:pt-4">
          <ReservationForm user={session ? { name: session.name, email: session.email } : null} />
        </div>
      </div>
    </section>
  );
}