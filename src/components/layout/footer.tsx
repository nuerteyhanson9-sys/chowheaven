import Link from "next/link";
import { Instagram, Facebook, Music2, MapPin, Phone, Mail, Clock } from "lucide-react";

import { SITE } from "@/lib/constants";

export function Footer({ settings }: { settings: Record<string, string> }) {
  const navCols = [
    {
      heading: "Explore",
      links: [
        { label: "Menu", href: "/menu" },
        { label: "Our Story", href: "/our-story" },
        { label: "Experience", href: "/our-story#experience" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      heading: "Visit us",
      links: [
        { label: "Reserve a Table", href: "/reservations" },
        { label: "Order Online", href: "/menu" },
        { label: "Track My Order", href: "/order/track" },
        { label: "Contact", href: "/our-story#contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-ink/10 bg-paper-warm">
      <div className="container-x grid gap-14 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-ink">
            Chow<span className="text-gold">Heaven</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            {settings.restaurant_tagline} Authentic Nigerian flavours, presented with
            contemporary elegance in the heart of Lagos.
          </p>

          <div className="mt-6 space-y-2.5 text-sm text-ink-muted">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              {settings.address}
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-ink">{settings.phone}</a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              {settings.hours}
            </p>
          </div>
        </div>

        {navCols.map((col) => (
          <nav key={col.heading} className="lg:col-span-2" aria-label={col.heading}>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-ink">{col.heading}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="link-quiet text-sm text-ink/70">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-ink">Stay in the loop</h3>
          <p className="mt-5 text-sm text-ink-muted">
            Join our newsletter for seasonal menus, secret-tasting events and offers from the kitchen.
          </p>
          <NewsletterForm />

          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.22em] text-ink-muted">Follow us</span>
            <div className="flex gap-2">
              <FooterSocial href={settings.instagram} label="Instagram"><Instagram className="h-[18px] w-[18px]" /></FooterSocial>
              <FooterSocial href={settings.facebook} label="Facebook"><Facebook className="h-[18px] w-[18px]" /></FooterSocial>
              <FooterSocial href={settings.tiktok} label="TikTok"><Music2 className="h-[18px] w-[18px]" /></FooterSocial>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-faint md:flex-row">
          <p>© {new Date().getFullYear()} {settings.restaurant_name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="transition-colors hover:text-ink">Privacy Policy</Link>
            <Link href="/legal/terms" className="transition-colors hover:text-ink">Terms of Service</Link>
            <Link href="/legal/refunds" className="transition-colors hover:text-ink">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSocial({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-ink/15 text-ink/70 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-night"
    >
      {children}
    </a>
  );
}

function NewsletterForm() {
  return (
    <form className="mt-5 flex max-w-sm gap-2">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="your@email.com"
        className="input-field flex-1"
      />
      <button type="submit" className="btn bg-ink px-5 py-3 text-paper hover:bg-burgundy">
        Subscribe
      </button>
    </form>
  );
}