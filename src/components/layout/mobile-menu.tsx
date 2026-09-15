"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, UtensilsCrossed, UserRound, MapPin, Phone, Clock, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/components/providers/cart-provider";

type NavUser = { name: string; email: string; role: string } | null;

const MOBILE_BG = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/960px-A_plate_of_jollof_rice_and_chicken.jpg";

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

  const allLinks = [{ href: "/", label: "Home" }, ...NAV_LINKS];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-night/70 backdrop-blur-[2px] transition-opacity duration-400",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "absolute inset-0 flex flex-col overflow-y-auto transition-all duration-500 ease-out",
          open ? "opacity-100 translate-x-0 scale-x-100" : "opacity-0 translate-x-8 scale-x-105",
        )}
      >
        {/* Background image + overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={MOBILE_BG}
            alt=""
            className="h-[110%] w-full object-cover object-center opacity-25 grayscale-[20%]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-burgundy-darker/90 adire-cream" />
        </div>

        <div className="relative z-10 flex min-h-full flex-col px-7 py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="logo-mark flex items-baseline gap-1 text-xl font-medium tracking-[0.04em] text-paper">
              Chow
              <span className="font-serif italic text-gold-soft">Heaven</span>
            </span>
            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-paper transition-colors hover:bg-paper/10"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" strokeWidth={1.5} />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-12 flex-1" aria-label="Mobile">
            <ul className="space-y-1">
              {allLinks.map((link, i) => (
                <li
                  key={link.href}
                  className={open ? "page-enter" : ""}
                  style={{ animationDelay: open ? `${80 + i * 60}ms` : undefined }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between border-b border-paper/12 py-4"
                  >
                    <span className="font-serif text-[2rem] font-medium tracking-tight text-paper transition-colors group-hover:text-gold-soft">
                      {link.label}
                    </span>
                    <span className="text-gold transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-3">
              <Link
                href="/menu"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 bg-gold px-7 py-4 text-[0.82rem] font-bold uppercase tracking-[0.18em] text-night transition-all hover:bg-gold-deep"
              >
                <UtensilsCrossed className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" aria-hidden />
                ORDER ONLINE
              </Link>
              {user ? (
                <Link
                  href={user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/account"}
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 border border-paper/20 bg-paper/5 px-7 py-4 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
                >
                  <UserRound className="h-4 w-4" aria-hidden /> Hi, {user.name.split(" ")[0]}
                  {count > 0 ? ` · ${count} in cart` : ""}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 border border-paper/20 bg-paper/5 px-7 py-4 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
                >
                  <UserRound className="h-4 w-4" aria-hidden /> Sign in / Create account
                </Link>
              )}
            </div>
          </nav>

          {/* Footer info */}
          <div className="mt-auto border-t border-paper/10 pt-5 text-[0.82rem] text-paper/60">
            <p className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-gold" aria-hidden /> {settings.phone}</p>
            <p className="mt-2 flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden /> {settings.address}</p>
            <p className="mt-2 flex items-center gap-2.5"><Clock className="h-4 w-4 text-gold" aria-hidden /> {settings.hours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}