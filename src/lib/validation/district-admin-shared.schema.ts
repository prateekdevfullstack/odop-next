import { z } from "zod";

export const trimString = (v: unknown) => (typeof v === "string" ? v.trim() : v);

export const mobileSchema = z
  .string()
  .min(1, "Mobile number is required")
  .regex(/^\d{10}$/, "Mobile number must be 10 digits");

export const aadharSchema = z
  .string()
  .min(1, "Aadhar number is required")
  .regex(/^\d{12}$/, "Aadhar number must be 12 digits");

export const optionalEmailSchema = z
  .string()
  .optional()
  .refine(
    (v) => !v || v.trim() === "" || z.string().email().safeParse(v.trim()).success,
    "Invalid email address"
  );

/** Accepts full URLs or bare domains (https:// is added when saving). */
export const optionalWebsiteSchema = z
  .string()
  .optional()
  .refine((v) => {
    if (!v || v.trim() === "") return true;
    const trimmed = v.trim();
    if (/^https?:\/\/.+/i.test(trimmed)) return true;
    return !/\s/.test(trimmed) && trimmed.includes(".");
  }, "Enter a valid website address");

export const districtIdSchema = z.string().min(1, "District is required");

export const namePrefixSchema = z.enum([
  "Mr.",
  "Miss",
  "Mrs.",
  "Do not wish to disclose",
] as const);

export function digitsOnly(value: string, maxLen: number): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

export function normalizeMobileInput(value: string): string {
  return digitsOnly(value, 10);
}

export function normalizeAadharInput(value: string): string {
  return digitsOnly(value, 12);
}
