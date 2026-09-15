"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, UtensilsCrossed, UserRound, MapPin, Phone, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/components/providers/cart-provider";

type NavUser = { name: string; email: string; role: string } | null;

export function MobileMenu({
  open,
  onClose,
  user,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  user: NavUser;
  settings: Record<string, string>;
}) {
  const { count } = useCart();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const experience = [
    { label: "Our Story", href: "/our-story", icon: null },
    { label: "Experience", href: "/our-story#experience", icon: null },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-night/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-lift transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <span className="font-serif text-xl font-bold">
            Chow<span className="text-gold">Heaven</span>
          </span>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-ink/5"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className="reveal" style={{ animation: `fade-up .5s ${150 + i * 70}ms both` }}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between border-b border-ink/10 py-4"
                >
                  <span className="font-serif text-3xl text-ink transition-colors group-hover:text-burgundy">
                    {link.label}
                  </span>
                  <span className="text-gold transition-transform group-hover:-translate-x-1 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/our-story#experience"
                onClick={onClose}
                className="flex items-center justify-between border-b border-ink/10 py-4"
              >
                <span className="font-serif text-3xl text-ink transition-colors hover:text-burgundy">Experience</span>
                <span className="text-gold">→</span>
              </a>
            </li>
          </ul>

          <div className="mt-8 space-y-3">
            <Link
              href="/menu"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 bg-burgundy px-7 py-4 text-sm font-bold tracking-wide text-paper"
            >
              <UtensilsCrossed className="h-4 w-4" aria-hidden /> ORDER ONLINE
            </Link>
            {user ? (
              <Link
                href={user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/account"}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 border border-ink/20 px-7 py-4 text-sm font-bold text-ink"
              >
                <UserRound className="h-4 w-4" aria-hidden /> Hi, {user.name.split(" ")[0]}
                {count > 0 ? ` · ${count} in cart` : ""}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 border border-ink/20 px-7 py-4 text-sm font-bold text-ink"
              >
                <UserRound className="h-4 w-4" aria-hidden /> Sign in / Create account
              </Link>
            )}
          </div>
        </nav>

        <div className="border-t border-ink/10 bg-paper-warm px-6 py-5 text-sm text-ink-muted">
          <p className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-gold" aria-hidden /> {settings.phone}</p>
          <p className="mt-2 flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden /> {settings.address}</p>
          <p className="mt-2 flex items-center gap-2.5"><Clock className="h-4 w-4 text-gold" aria-hidden /> {settings.hours}</p>
        </div>
      </div>
    </div>
  );
}