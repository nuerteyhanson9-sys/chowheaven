"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarClock,
  Heart,
  UserRound,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/reservations", label: "Reservations", icon: CalendarClock },
  { href: "/account/favorites", label: "Favourites", icon: Heart },
  { href: "/account/profile", label: "Profile", icon: UserRound },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold transition-colors",
              active ? "bg-ink text-paper" : "text-ink-muted hover:bg-ink/5 hover:text-ink",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={() => logoutAction()}
        className="flex shrink-0 items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-burgundy/5 hover:text-burgundy"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign out
      </button>
    </nav>
  );
}