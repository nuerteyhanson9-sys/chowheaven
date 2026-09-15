export const SITE = {
  name: "Chow Heaven",
  tagline: "The taste of Nigeria, reimagined.",
  description:
    "Chow Heaven is a premium Nigerian restaurant serving authentic flavours with contemporary presentation — jollof rice, suya, egusi soup, grills and more, in Lagos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@chowheaven.ng",
  address: "42 Market Street, Lagos Island, Lagos, Nigeria",
  phone: "+234 803 555 0199",
};

export const ORDER_STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Order received",
  CONFIRMED: "Payment confirmed",
  PREPARING: "Preparing your order",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_LIST = Object.entries(ORDER_STATUS_LABEL);

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SUCCESSFUL: "Successful",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const RESERVATION_STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting confirmation",
  CONFIRMED: "Confirmed",
  REJECTED: "Declined",
  CANCELLED: "Cancelled",
  ARRIVED: "Guest arrived",
  COMPLETED: "Completed",
};

export const OCCASION_LABEL: Record<string, string> = {
  DINING: "Casual dining",
  BIRTHDAY: "Birthday",
  ANNIVERSARY: "Anniversary",
  PROPOSAL: "Proposal",
  BUSINESS: "Business dinner",
  FAMILY_DINNER: "Family dinner",
  OTHER: "Other",
};

export const GALLERY_CATEGORIES = [
  { value: "FOOD", label: "Food" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "PEOPLE", label: "People" },
  { value: "EVENTS", label: "Events" },
  { value: "BEHIND_THE_SCENES", label: "Behind the scenes" },
] as const;

export const PAYMENT_METHODS = [
  { value: "card", label: "Card payment", hint: "Visa, Mastercard, Verve — secured by Paystack" },
  { value: "bank_transfer", label: "Bank transfer", hint: "Instant transfer via your bank app" },
  { value: "ussd", label: "USSD", hint: "Dial *737# style payment from your phone" },
  { value: "pay_on_pickup", label: "Pay on pickup", hint: "Settle in cash when you collect" },
] as const;

export const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/our-story", label: "Our Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reservations", label: "Reservations" },
];

export const DEMO_CREDENTIALS = {
  admin: { email: "admin@chowheaven.ng", password: "password123" },
  staff: { email: "staff@chowheaven.ng", password: "password123" },
  customer: { email: "chiamaka@example.com", password: "password123" },
};

export const RECEIPT_NOTE =
  "Chow Heaven — thank you for ordering with us. Your feedback helps our kitchen grow.";