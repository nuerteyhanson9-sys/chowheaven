import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Missing reset token"),
  password: passwordSchema,
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const addressSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Add a label (e.g. Home, Office)").max(40),
  street: z.string().trim().min(3, "Street address is required").max(160),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  zip: z.string().trim().max(20).optional().or(z.literal("")),
  isDefault: z.boolean().optional().default(false),
});

export const reservationSchema = z.object({
  date: z.coerce
    .date()
    .refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), "Reservation date must be today or later"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid time"),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(40, "Maximum 40 guests per reservation"),
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  specialRequest: z.string().trim().max(500, "Keep your request under 500 characters").optional().or(z.literal("")),
  occasion: z
    .enum(["DINING", "BIRTHDAY", "ANNIVERSARY", "PROPOSAL", "BUSINESS", "FAMILY_DINNER", "OTHER"])
    .default("DINING"),
});

export const customerDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  street: z.string().trim().min(3, "Street address is required").max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(80).optional().or(z.literal("")),
  state: z.string().trim().min(2, "State is required").max(80).optional().or(z.literal("")),
  scheduledFor: z.string().datetime().optional().nullable().or(z.literal("")),
});

export const reviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().trim().min(3, "A short review helps other guests").max(600).optional().or(z.literal("")),
});

export const couponCodeSchema = z.object({
  code: z.string().trim().toUpperCase().min(3, "Enter a coupon code").max(30),
});

export const adminMenuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().min(1, "Choose a category"),
  description: z.string().trim().min(5).max(600),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.coerce.number().nonnegative().optional().nullable(),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  ingredients: z.string().trim().optional().or(z.literal("")),
  allergens: z.string().trim().optional().or(z.literal("")),
  tags: z.string().trim().optional().or(z.literal("")),
  spiceLevel: z.coerce.number().int().min(0).max(3).default(0),
  isVegetarian: z.boolean().optional().default(false),
  available: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const adminCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  ordering: z.coerce.number().int().min(0).default(0),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

export const adminCouponSchema = z.object({
  id: z.string().optional(),
  code: z.string().trim().toUpperCase().min(3).max(30),
  discountType: z.enum(["PERCENTAGE", "FIXED", "FREE_DELIVERY"]),
  discountValue: z.coerce.number().nonnegative("Enter a discount value").max(1000000),
  expiryDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  minOrderValue: z.coerce.number().nonnegative().default(0),
  usageLimit: z.coerce.number().int().nonnegative().nullable().optional(),
  active: z.boolean().optional().default(true),
});

export const adminGallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required").max(120),
  category: z.enum(["FOOD", "RESTAURANT", "PEOPLE", "EVENTS", "BEHIND_THE_SCENES"]),
  imageUrl: z.string().trim().min(5, "Image URL is required").max(500),
  alt: z.string().trim().max(200).optional().or(z.literal("")),
  ordering: z.coerce.number().int().min(0).default(0),
  active: z.boolean().optional().default(true),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type AddressInput = z.infer<typeof addressSchema>;