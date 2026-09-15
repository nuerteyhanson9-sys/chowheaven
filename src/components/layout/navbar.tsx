"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  UserRound,
  ChevronDown,
  Menu,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { logout } from "@/app/actions/auth";

type NavUser = { name: string; email: string; role: string } | null;

const accountDest = {
  CUSTOMER: "/account",
  STAFF: "/admin",
  ADMIN: "/admin",
} as const;

/** Routes that open with a full-bleed visual hero → transparent navbar at the top. */
const HERO_PAGES = new Set(["/", "/our-story", "/gallery", "/reservations", "/menu", "/experience"]);

export function Navbar({ user, settings }: { user: NavUser; settings: Record<string, string> }) {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasHero = HERO_PAGES.has(pathname);
  const solid = scrolled || !hasHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
          solid
            ? "border-b border-gold/20 bg-burgundy-deep/95 shadow-[0_1px_24px_rgba(20,8,11,.28)] backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-night/80 via-night/40 to-transparent",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="group flex items-baseline gap-1" aria-label={`${settings.restaurant_name} home`}>
            <span
              className={cn(
                "logo-mark bg-gradient-to-b from-paper to-paper/80 bg-clip-text text-2xl font-medium tracking-[0.04em] text-transparent transition-colors duration-300",
                solid && "from-paper to-paper/85",
              )}
            >
              Chow
            </span>
            <span className="logo-mark text-2xl font-medium italic tracking-[0.04em] text-gold-soft">
              Heaven
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative text-[0.82rem] font-medium uppercase tracking-[0.14em] text-paper/80 transition-colors hover:text-paper",
                    active && "text-paper",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300",
                      active ? "w-full" : "group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Order online */}
            <Link href="/menu" className="btn-order hidden items-center gap-2 md:inline-flex">
              <UtensilsCrossed className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden />
              Order Online
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-sm text-paper transition-colors hover:bg-paper/10"
              aria-label={`Shopping cart, ${count} items`}
            >
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.8} aria-hidden />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-night"
                >
                  {count}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative hidden md:block" ref={menuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-night">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-28 truncate xl:inline">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")} />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-64 origin-top-right scale-in rounded-sm border border-gold/25 bg-burgundy-darker p-1.5 shadow-lift"
                    >
                      <div className="border-b border-paper/10 px-4 py-3">
                        <p className="truncate text-sm font-bold text-paper">{user.name}</p>
                        <p className="truncate text-xs text-paper/60">{user.email}</p>
                      </div>
                      <Link href={accountDest[user.role as keyof typeof accountDest] ?? "/account"} role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-paper/85 hover:bg-paper/10 hover:text-paper">
                        <LayoutDashboard className="h-4 w-4" aria-hidden /> My Dashboard
                      </Link>
                      <Link href="/account/orders" role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-paper/85 hover:bg-paper/10 hover:text-paper">
                        <ShoppingBag className="h-4 w-4" aria-hidden /> My Orders
                      </Link>
                      {(user.role === "ADMIN" || user.role === "STAFF") && (
                        <Link href="/admin" role="menuitem"
                          className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm font-semibold text-gold-soft hover:bg-paper/10">
                          <LayoutDashboard className="h-4 w-4" aria-hidden /> Admin console
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-left text-sm text-paper/85 hover:bg-paper/10 hover:text-paper"
                      >
                        <LogOut className="h-4 w-4" aria-hidden /> Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
                >
                  <UserRound className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                  <span className="hidden xl:inline">Sign in</span>
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-paper transition-colors hover:bg-paper/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        settings={settings}
      />
    </>
  );
}