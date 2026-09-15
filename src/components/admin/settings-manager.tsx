"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertSettings } from "@/app/actions/admin";

const FIELDS: { key: string; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "restaurant_name", label: "Restaurant name", placeholder: "Chow Heaven" },
  { key: "address", label: "Address", placeholder: "42 Market Street, Lagos" },
  { key: "phone", label: "Phone", placeholder: "+234 803 555 0199" },
  { key: "email", label: "Email", placeholder: "hello@chowheaven.ng" },
  { key: "hours", label: "Opening hours", placeholder: "Mon – Sun, 11am – 11pm" },
  { key: "delivery_fee", label: "Delivery fee (₦)", placeholder: "500" },
  { key: "free_delivery_min_order", label: "Free delivery min (₦)", placeholder: "5000" },
  { key: "currency", label: "Currency code", placeholder: "NGN" },
  { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
  { key: "social_tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@" },
  { key: "social_twitter", label: "X / Twitter URL", placeholder: "https://x.com/…" },
];

export function SettingsManager({ initial }: { initial: Record<string, string> }) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, initial[f.key] ?? ""]))
  );
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertSettings(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save settings.");
      return;
    }
    toast.success("Settings saved — changes are live on the site.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map((f) =>
          f.multiline ? (
            <Textarea key={f.key} label={f.label} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} className="md:col-span-2" />
          ) : (
            <Input key={f.key} label={f.label} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          )
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" loading={saving}>Save Settings</Button>
      </div>
    </form>
  );
}