import "server-only";

import { createHash, randomBytes } from "crypto";

import { prisma } from "@/lib/db";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordReset(email: string): Promise<string | null> {
  // Returns the raw reset token (for the demo this is surfaced so flows can be
  // completed without a mail server; in production it would be emailed).
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const rawToken = randomBytes(32).toString("hex");
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  return rawToken;
}

export async function consumePasswordReset(rawToken: string, newPasswordHash: string): Promise<boolean> {
  const record = await prisma.passwordReset.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  if (!record) return false;
  if (record.usedAt) return false;
  if (record.expiresAt < new Date()) return false;

  await prisma.$transaction([
    prisma.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash: newPasswordHash } }),
  ]);
  return true;
}