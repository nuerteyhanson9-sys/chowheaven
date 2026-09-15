import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle={<>New to Chow Heaven? <Link href="/register" className="font-semibold text-burgundy hover:underline">Create an account</Link></>}
    >
      <LoginForm />
      <div className="mt-8 rounded-sm border border-ink/10 bg-paper-warm p-4 text-xs text-ink-muted">
        <p className="font-bold uppercase tracking-wider text-ink-faint">Demo accounts</p>
        <p className="mt-1.5">
          Admin: <span className="font-mono text-ink">{DEMO_CREDENTIALS.admin.email}</span> ·{" "}
          Customer: <span className="font-mono text-ink">{DEMO_CREDENTIALS.customer.email}</span>
        </p>
        <p className="mt-1">
          Password for all: <span className="font-mono text-ink">{DEMO_CREDENTIALS.customer.password}</span>
        </p>
      </div>
    </AuthShell>
  );
}