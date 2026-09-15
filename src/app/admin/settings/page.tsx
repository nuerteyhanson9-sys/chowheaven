import { getSettingsAdmin } from "@/app/actions/admin";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await getSettingsAdmin();
  const initial = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Restaurant Settings</h1>
        <p className="mt-1 text-sm text-paper/50">Global information shown across the site and in checkout.</p>
      </div>
      <div className="rounded-sm border border-white/10 bg-white/5 p-6">
        <SettingsManager initial={initial} />
      </div>
    </div>
  );
}