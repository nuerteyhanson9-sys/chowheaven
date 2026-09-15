import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle={<>Remembered it? <Link href="/login" className="font-semibold text-burgundy hover:underline">Back to sign in</Link></>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}