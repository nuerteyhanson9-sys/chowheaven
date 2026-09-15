"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/app/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await registerAction(form);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="mb-4 rounded-sm border border-burgundy/30 bg-burgundy/5 px-3 py-2 text-sm text-burgundy" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <Input label="Full name" autoComplete="name" required placeholder="Ada Obi" name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <Input label="Email" type="email" autoComplete="email" required placeholder="you@email.com" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone (optional)" type="tel" placeholder="+234 800 000 0000" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <div>
          <label htmlFor="password" className="label-field">Password</label>
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field pr-11"
              placeholder="8+ characters with a number"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
        Create Account
      </Button>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        By registering you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}