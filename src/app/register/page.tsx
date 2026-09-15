import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create Account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle={<>Already have an account? <Link href="/login" className="font-semibold text-burgundy hover:underline">Sign in</Link></>}
    >
      <RegisterForm />
    </AuthShell>
  );
}