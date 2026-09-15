"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/account";
import { formatMoney } from "@/lib/utils";
import { UserRound, Crown } from "lucide-react";

type Props = {
  user: { id: string; fullName: string; email: string; phone: string | null };
  stats: { points: number; orders: number; totalSpent: string };
};

export function ProfileForm({ user, stats }: Props) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile({ fullName, phone });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save changes.");
      return;
    }
    toast.success("Profile updated.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 font-serif text-2xl font-bold text-gold-deep">
          {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <div>
          <p className="font-serif text-lg text-ink">{user.fullName}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-sm border border-ink/10 bg-paper-warm p-4 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <Crown className="h-4 w-4 text-gold" />
          <p className="font-serif text-lg text-ink">{stats.points}</p>
          <p className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Points</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <UserRound className="h-4 w-4 text-gold" />
          <p className="font-serif text-lg text-ink">{stats.orders}</p>
          <p className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Orders</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-serif text-lg text-ink">{formatMoney(stats.totalSpent)}</p>
          <p className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Spent</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <div>
          <Input label="Email" type="email" value={user.email} disabled />
          <p className="mt-1.5 text-xs text-ink-faint">Email can&apos;t be changed yet — contact support for help.</p>
        </div>
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}