"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/app/actions/auth";

export function SecuritySettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords don't match.");
      return;
    }
    setLoading(true);
    const result = await changePasswordAction({ currentPassword: current, newPassword: next });
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Password changed — please sign in again.");
    setLoading(false);
    window.location.href = "/login";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-serif text-lg text-ink">Change password</h3>
      <Input label="Current password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
      <Input label="New password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="8+ characters with a number" />
      <Input label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" />
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Update Password</Button>
      </div>
      <p className="text-xs text-ink-faint">
        Need to update your email? <Link href="/our-story#contact" className="text-burgundy hover:underline">Contact support</Link>.
      </p>
    </form>
  );
}