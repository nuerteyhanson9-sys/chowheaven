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

export function Navbar({ user, settings }: { user: NavUser; settings: Record<string, string> }) {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || pathname !== "/"
            ? "border-b border-ink/10 bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-night/70 to-transparent",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-0.5" aria-label={`${settings.restaurant_name} home`}>
            <span
              className={cn(
                "font-serif text-2xl font-bold tracking-tight",
                scrolled || pathname !== "/" ? "text-ink" : "text-paper",
              )}
            >
              Chow
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-gold">Heaven</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative text-sm font-semibold tracking-wide transition-colors",
                    scrolled || pathname !== "/" ? "text-ink/75 hover:text-ink" : "text-paper/85 hover:text-paper",
                    active && (scrolled || pathname !== "/" ? "text-ink" : "text-paper"),
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300",
                      active ? "w-full" : "group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
            <a
              href="/our-story#experience"
              className={cn(
                "text-sm font-semibold tracking-wide transition-colors",
                scrolled || pathname !== "/" ? "text-ink/75 hover:text-ink" : "text-paper/85 hover:text-paper",
              )}
            >
              Experience
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/menu"
              className="hidden items-center gap-2 bg-gold px-5 py-2.5 text-sm font-bold text-night transition-all hover:-translate-y-0.5 hover:bg-gold-soft md:inline-flex"
            >
              <UtensilsCrossed className="h-4 w-4" aria-hidden />
              Order Online
            </Link>

            <Link
              href="/cart"
              className={cn(
                "relative inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors",
                scrolled || pathname !== "/" ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/10",
              )}
              aria-label={`Shopping cart, ${count} items`}
            >
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.8} aria-hidden />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-burgundy px-1 text-[11px] font-bold text-paper"
                >
                  {count}
                </span>
              )}
            </Link>

            <div className="relative hidden md:block" ref={menuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition-colors",
                      scrolled || pathname !== "/"
                        ? "text-ink hover:bg-ink/5"
                        : "text-paper hover:bg-paper/10",
                    )}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-burgundy text-[11px] font-bold text-paper">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-28 truncate xl:inline">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")} />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-64 origin-top-right scale-in rounded-sm border border-ink/10 bg-paper-card p-1.5 shadow-lift"
                    >
                      <div className="border-b border-ink/10 px-4 py-3">
                        <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-ink-muted">{user.email}</p>
                      </div>
                      <Link href={accountDest[user.role as keyof typeof accountDest] ?? "/account"} role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5 hover:text-ink">
                        <LayoutDashboard className="h-4 w-4" aria-hidden /> My Dashboard
                      </Link>
                      <Link href="/account/orders" role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5 hover:text-ink">
                        <ShoppingBag className="h-4 w-4" aria-hidden /> My Orders
                      </Link>
                      {(user.role === "ADMIN" || user.role === "STAFF") && (
                        <Link href="/admin" role="menuitem"
                          className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm font-semibold text-burgundy hover:bg-burgundy/5">
                          <LayoutDashboard className="h-4 w-4" aria-hidden /> Admin console
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-left text-sm text-ink/80 hover:bg-ink/5 hover:text-ink"
                      >
                        <LogOut className="h-4 w-4" aria-hidden /> Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition-colors",
                    scrolled || pathname !== "/" ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/10",
                  )}
                >
                  <UserRound className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                  <span className="hidden xl:inline">Sign in</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-sm lg:hidden",
                scrolled || pathname !== "/" ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/10",
              )}
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