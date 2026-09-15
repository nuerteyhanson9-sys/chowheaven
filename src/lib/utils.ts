/** Small, dependency-free utilities shared across the app. */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Format a number as Nigerian Naira. Accepts string/Decimal/number. */
export function formatMoney(value: number | string | { toString(): string }, withSymbol = true) {
  const num = Number(value);
  if (Number.isNaN(num)) return withSymbol ? "₦0" : "0";
  const formatted = num.toLocaleString("en-NG", { maximumFractionDigits: num % 1 ? 2 : 0 });
  return withSymbol ? `₦${formatted}` : formatted;
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return `${formatDate(date)}, ${formatTime(date)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function todayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function timeAgo(date: Date | string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units: Array<[number, string]> = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Mask a phone/email partially for privacy in admin views. */
export function maskContact(value: string, type: "email" | "phone") {
  if (!value) return "—";
  if (type === "email") {
    const [name, domain] = value.split("@");
    if (!domain) return value;
    return `${name.slice(0, 2)}•••@${domain}`;
  }
  return value.length > 6 ? `${value.slice(0, 3)}••••${value.slice(-2)}` : "••••";
}

export function deepClone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}