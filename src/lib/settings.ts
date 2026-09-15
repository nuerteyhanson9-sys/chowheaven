import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/db";

export const DEFAULT_SETTINGS: Record<string, string> = {
  restaurant_name: "Chow Heaven",
  restaurant_tagline: "The taste of Nigeria, reimagined.",
  address: "42 Market Street, Lagos Island, Lagos, Nigeria",
  phone: "+234 803 555 0199",
  email: "hello@chowheaven.ng",
  hours: "Open Daily · 11:00 — 22:00",
  delivery_fee: "1200",
  delivery_min_order: "3000",
  delivery_eta_min: "45",
  pickup_eta_min: "20",
  instagram: "https://instagram.com/chowheaven",
  facebook: "https://facebook.com/chowheaven",
  tiktok: "https://tiktok.com/@chowheaven",
  currency: "NGN",
};

export type Settings = Record<string, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await prisma.restaurantSetting.findMany({ select: { key: true, value: true } });
  const map: Settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) map[row.key] = row.value;
  return map;
});

export async function getSetting(key: string): Promise<string> {
  const settings = await getSettings();
  return settings[key] ?? DEFAULT_SETTINGS[key] ?? "";
}

export function numericSetting(settings: Settings, key: string, fallback = 0): number {
  const value = Number(settings[key]);
  return Number.isFinite(value) ? value : fallback;
}

export const getDeliveryFee = async () => {
  const settings = await getSettings();
  return numericSetting(settings, "delivery_fee", 1200);
};

export const getMinOrderForDelivery = async () => {
  const settings = await getSettings();
  return numericSetting(settings, "delivery_min_order", 3000);
};