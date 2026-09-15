import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "chw_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionRole = "CUSTOMER" | "STAFF" | "ADMIN";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  name: string;
  email: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createSession(input: SessionPayload) {
  const token = await new SignJWT(input)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export const getSessionPayload = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.userId || !payload.role) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
});

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      customer: true,
      addresses: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function requireSession() {
  const session = await getSessionPayload();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/account`)}`);
  return session;
}

export async function requireUser() {
  const session = await getSessionPayload();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/account`)}`);
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");
  return { session, user };
}

export async function requireAdmin() {
  const session = await getSessionPayload();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN" && session.role !== "STAFF") redirect("/");
  return session;
}

/** Verifies a session token without DB access — used in edge middleware. */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.userId || !payload.role) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function isAdminScope(role: SessionRole) {
  return role === "ADMIN" || role === "STAFF";
}