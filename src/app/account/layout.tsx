import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { customer: true } });

  return (
    <section className="pt-28 pb-20">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-ink/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">My account</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tightest">
              {user?.fullName ?? "Welcome back"}
            </h1>
          </div>
          <p className="text-sm text-ink-muted">
            {user?.customer?.ordersCount ?? 0} orders · {user?.customer?.loyaltyPoints ?? 0} loyalty points
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AccountNav />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}