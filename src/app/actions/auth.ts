"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { createSession, destroySession, getSessionPayload, SESSION_MAX_AGE } from "@/lib/auth";
import { authRateLimit, serializeRateLimitError } from "@/lib/rate-limit";
import { createPasswordReset, consumePasswordReset } from "@/lib/password-reset";
import {
  forgotPasswordSchema,
  loginSchema,
  passwordSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation";

async function callerIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

type ActionResult = { error?: string; ok?: boolean; demoResetLink?: string };

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  if (!authRateLimit(`register:${await callerIp()}`).ok) {
    return { error: "Too many signups from this network. Try again shortly." };
  }

  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) {
    return { error: "An account with this email already exists. Sign in instead." };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      fullName: data.fullName.trim(),
      phone: data.phone || null,
      passwordHash,
      role: "CUSTOMER",
      customer: { create: {} },
    },
  });

  await createSession({ userId: user.id, role: user.role, name: user.fullName, email: user.email });
  redirect("/account");
}

export async function loginAction(input: unknown, next?: string | null): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }
  const data = parsed.data;
  const limit = authRateLimit(`login:${await callerIp()}`);
  if (!limit.ok) {
    return { error: serializeRateLimitError(limit) };
  }

  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  const valid = user && (await bcrypt.compare(data.password, user.passwordHash));
  if (!user || !valid) {
    return { error: "Incorrect email or password." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.fullName, email: user.email });

  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
  redirect(safeNext ?? (user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/account"));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function willRenderLogoutBoundary() {
  return !(await getSessionPayload());
}

export async function forgotPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: "Enter a valid email address." };

  const limit = authRateLimit(`forgot:${await callerIp()}`);
  if (!limit.ok) return { error: serializeRateLimitError(limit) };

  const token = await createPasswordReset(parsed.data.email);
  const demo = process.env.DEMO_MODE === "true";

  if (demo && token) {
    // Demo convenience: surface the reset link instead of sending an email.
    return { ok: true, demoResetLink: `/reset-password?token=${token}` };
  }
  return { ok: true };
}

export async function resetPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid request." };

  const limit = authRateLimit(`reset:${await callerIp()}`);
  if (!limit.ok) return { error: serializeRateLimitError(limit) };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const ok = await consumePasswordReset(parsed.data.token, passwordHash);
  if (!ok) return { error: "This reset link is invalid or has expired. Request a new one." };

  return { ok: true };
}

export async function logout() {
  await destroySession();
}

export async function changePasswordAction(input: { currentPassword: string; newPassword: string }): Promise<ActionResult> {
  const session = await getSessionPayload();
  if (!session) return { error: "Not authenticated." };

  const limit = authRateLimit(`changepw:${session.userId}:${await callerIp()}`);
  if (!limit.ok) return { error: serializeRateLimitError(limit) };

  const validated = passwordSchema.safeParse(input.newPassword);
  if (!validated.success) return { error: validated.error.issues[0]?.message ?? "Choose a stronger password." };
  if (!input.currentPassword) return { error: "Enter your current password." };

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({ where: { id: session.userId }, data: { passwordHash } });
  await destroySession();
  return { ok: true };
}

export { SESSION_MAX_AGE };