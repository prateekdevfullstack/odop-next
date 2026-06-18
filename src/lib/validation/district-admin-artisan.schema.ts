import { z } from "zod";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import {
  ARTISAN_CUSTOMIZED_ORDER_OPTIONS,
  ARTISAN_NAME_PREFIX_OPTIONS,
} from "@/lib/district-admin/constants";
import {
  mobileSchema,
  normalizeAadharInput,
  normalizeMobileInput,
  optionalEmailSchema,
  trimString,
} from "./district-admin-shared.schema";

const optionalAadharSchema = z
  .string()
  .optional()
  .refine(
    (v) => !v || v.trim() === "" || /^\d{12}$/.test(v.trim()),
    "Aadhar number must be 12 digits"
  );

const namePrefixSchema = z.enum(ARTISAN_NAME_PREFIX_OPTIONS);

const craftSpecializationSchema = z.string().optional();

/** Matches backend CreateArtisanDto / UpdateArtisanDto fields. */
const artisanFieldsSchema = z.object({
  name: z.string().min(1, "Artisan name is required"),
  email: optionalEmailSchema,
  mobile_no: mobileSchema,
  address: z.string().optional(),
  district_id: z.string().optional(),
  product_category_id: z.string().min(1, "ODOP Product category is required"),
  name_prefix: namePrefixSchema.optional(),
  aadhar_number: optionalAadharSchema,
  craft_specialization: craftSpecializationSchema,
  production_capacity: z.string().optional(),
  customized_order: z.enum(ARTISAN_CUSTOMIZED_ORDER_OPTIONS).optional().default("No"),
});

export const districtArtisanCreateSchema = artisanFieldsSchema;
export const districtArtisanUpdateSchema = artisanFieldsSchema;

export type DistrictArtisanCreateInput = z.infer<typeof districtArtisanCreateSchema>;
export type DistrictArtisanUpdateInput = z.infer<typeof districtArtisanUpdateSchema>;

function normalizeCustomizedOrder(value: string): "Yes" | "No" {
  if (value === "Yes" || value.toLowerCase() === "yes") return "Yes";
  return "No";
}

export function toArtisanValidationInput(values: DistrictEntityFormValues) {
  const craft = values.craft_specialization?.trim() || undefined;

  return {
    name: trimString(values.name) as string,
    email: values.email || undefined,
    mobile_no: normalizeMobileInput(values.mobile_no),
    address: trimString(values.address) || undefined,
    district_id: values.district_id || undefined,
    product_category_id: values.product_category_id || undefined,
    name_prefix: ARTISAN_NAME_PREFIX_OPTIONS.includes(
      values.name_prefix as (typeof ARTISAN_NAME_PREFIX_OPTIONS)[number]
    )
      ? (values.name_prefix as (typeof ARTISAN_NAME_PREFIX_OPTIONS)[number])
      : undefined,
    aadhar_number: normalizeAadharInput(values.aadhar_number),
    craft_specialization: craft,
    production_capacity: values.production_capacity?.trim() || undefined,
    customized_order: normalizeCustomizedOrder(values.customized_order),
  };
}

export function parseArtisanForm(values: DistrictEntityFormValues) {
  return districtArtisanCreateSchema.safeParse(toArtisanValidationInput(values));
}

export function parseArtisanFormUpdate(values: DistrictEntityFormValues) {
  return districtArtisanUpdateSchema.safeParse(toArtisanValidationInput(values));
}
