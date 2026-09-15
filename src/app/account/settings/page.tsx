import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { SecuritySettings } from "@/components/account/security-settings";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const session = await requireSession();
  return (
    <div className="max-w-xl">
      <h2 className="font-serif text-2xl text-ink">Security</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Manage your password and active session. Signed in as <span className="font-semibold text-ink">{session.email}</span>.
      </p>

      <div className="card-shell mt-6 p-6">
        <SecuritySettings />
      </div>
    </div>
  );
}