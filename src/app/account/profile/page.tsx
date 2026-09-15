import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { customer: true } });
  if (!user) return null;

  return (
    <div className="max-w-xl">
      <h2 className="font-serif text-2xl text-ink">Profile</h2>
      <p className="mt-1 text-sm text-ink-muted">Your personal details and contact information.</p>

      <div className="card-shell mt-6 p-6">
        <ProfileForm
          user={{ id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }}
          stats={{
            points: user.customer?.loyaltyPoints ?? 0,
            orders: user.customer?.ordersCount ?? 0,
            totalSpent: user.customer?.totalSpent.toString() ?? "0",
          }}
        />
      </div>
    </div>
  );
}