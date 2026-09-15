"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/app/actions/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ sent: boolean; resetLink?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await forgotPasswordAction({ email });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSuccess({ sent: true, resetLink: (result as any)?.demoResetLink });
  }

  if (success) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-night">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-serif text-xl text-ink">Check your inbox</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {success.sent
            ? "If an account exists for that email, we've sent a secure reset link (valid for 1 hour)."
            : ""}
        </p>
        {success.resetLink && (
          <div className="mt-4 rounded-sm border border-gold/40 bg-gold/5 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">Demo mode — no email server</p>
            <p className="mt-1 text-xs text-ink-muted">
              Use this link to complete the reset flow right now:
            </p>
            <Link href={success.resetLink} className="mt-2 inline-block break-all font-mono text-xs text-burgundy underline">
              {window.location.origin}
              {success.resetLink}
            </Link>
          </div>
        )}
        <Link href="/login" className="btn-primary mt-8">Back to sign in</Link>
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
        <Input label="Email" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
        Send Reset Link
      </Button>
    </form>
  );
}