import "server-only";

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterMs?: number };

const WINDOW_MS = 60 * 1000;
const MAX = 20;

const buckets = new Map<string, { count: number; resetAt: number }>();

function prune() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for a single-instance deployment / demo; swap for Redis-backed
 * storage (e.g. @upstash/ratelimit) in a multi-instance production setup.
 */
export function rateLimit(key: string, max = MAX, windowMs = WINDOW_MS): RateLimitResult {
  prune();
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (bucket.count >= max) {
    const retryAfterMs = bucket.resetAt - now;
    return { ok: false, remaining: 0, retryAfterMs };
  }
  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count };
}

export function authRateLimit(identifier: string) {
  return rateLimit(`auth:${identifier}`, 10, 60 * 1000);
}

export function serializeRateLimitError(res: RateLimitResult) {
  return `Too many attempts. Try again in ${Math.ceil((res.retryAfterMs ?? 60000) / 1000)} seconds.`;
}