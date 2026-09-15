"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/app/actions/auth";

export function ResetPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await resetPasswordAction({ token, password });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (!token) {
    return <p className="text-sm text-ink-muted">This reset link is missing its token. Request a new one.</p>;
  }

  if (done) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-night">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-serif text-xl text-ink">Password updated</h2>
        <p className="mt-2 text-sm text-ink-muted">Your password has been changed. You can sign in now.</p>
        <Link href="/login" className="btn-primary mt-8">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="mb-4 rounded-sm border border-burgundy/30 bg-burgundy/5 px-3 py-2 text-sm text-burgundy" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <Input label="New password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters with a number" />
        <Input label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" />
      </div>
      <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
        Update Password
      </Button>
    </form>
  );
}