"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarCheck,
  UtensilsCrossed,
  Tag,
  Users,
  Star,
  Images,
  Percent,
  Banknote,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/promotions", label: "Promotions", icon: Percent },
  { href: "/admin/payments", label: "Payments", icon: Banknote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:pb-0" aria-label="Admin">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-gold text-night" : "text-paper/70 hover:bg-white/5 hover:text-paper",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="h-4 w-4" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-2 border-t border-white/10 pt-2 lg:mt-6">
        <button
          onClick={() => logoutAction()}
          className="flex w-full items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium text-paper/70 transition-colors hover:bg-white/5 hover:text-paper"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium text-paper/70 transition-colors hover:bg-white/5 hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" /> View site
        </Link>
      </div>
    </nav>
  );
}