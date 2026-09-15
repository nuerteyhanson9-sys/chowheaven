import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return (
    <div className="min-h-screen bg-night text-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col overflow-y-auto border-r border-white/10 bg-night/95 p-5 lg:flex">
        <Link href="/admin" className="px-1 font-serif text-xl font-bold text-paper">
          Chow<span className="text-gold">Heaven</span>
          <span className="ml-2 rounded-sm bg-gold px-1.5 py-0.5 align-middle font-sans text-[0.6rem] font-bold uppercase tracking-wider text-night">Admin</span>
        </Link>
        <div className="mt-6 flex-1">
          <AdminNav />
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-night/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif text-lg text-paper lg:hidden">
              Chow<span className="text-gold">Heaven</span> <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold">Admin</span>
            </Link>
            <p className="hidden text-sm text-paper/60 lg:block">Restaurant management console</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-paper">{user?.fullName}</p>
              <p className="text-xs text-paper/50">{session.email}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-xs font-bold uppercase text-night">
              {(user?.fullName ?? "A").slice(0, 1)}
            </span>
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}