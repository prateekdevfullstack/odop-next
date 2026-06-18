import { z } from "zod";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import {
  mobileSchema,
  normalizeMobileInput,
  optionalEmailSchema,
  optionalWebsiteSchema,
  trimString,
} from "./district-admin-shared.schema";

const optionalPanSchema = z
  .string()
  .optional()
  .refine(
    (v) => !v || v.trim() === "" || /^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(v.trim()),
    "PAN must be 10 characters (e.g. ABCDE1234F)"
  );

const supplierFieldsSchema = z.object({
  enterprise_name: z.string().min(1, "Enterprise/Unit name is required"),
  proprietor_director_name: z.string().min(1, "Proprietor/Director name is required"),
  udyam_registration: z.string().max(50).optional(),
  gst_number: z.string().max(30).optional(),
  pan_number: optionalPanSchema,
  registered_address: z.string().optional(),
  mobile_no: mobileSchema,
  email: optionalEmailSchema,
  website: optionalWebsiteSchema,
  bulk_order: z.enum(["true", "false"]).optional().default("false"),
  product_category_id: z.string().min(1, "ODOP Product category is required"),
  district_id: z.string().optional(),
  district: z.string().optional(),
});

export const districtSupplierCreateSchema = supplierFieldsSchema;
export const districtSupplierUpdateSchema = supplierFieldsSchema;

export type DistrictSupplierCreateInput = z.infer<typeof districtSupplierCreateSchema>;
export type DistrictSupplierUpdateInput = z.infer<typeof districtSupplierUpdateSchema>;

export function toSupplierValidationInput(values: DistrictEntityFormValues) {
  const registeredAddress = (
    values.registered_address ||
    values.address ||
    ""
  ).trim();

  return {
    enterprise_name: trimString(values.enterprise_name) as string,
    proprietor_director_name: trimString(values.proprietor_director_name) as string,
    udyam_registration: values.udyam_registration || undefined,
    gst_number: values.gst_number || undefined,
    pan_number: values.pan_number || undefined,
    registered_address: registeredAddress || undefined,
    mobile_no: normalizeMobileInput(values.mobile_no),
    email: values.email || undefined,
    website: values.website || undefined,
    bulk_order: values.bulk_order === "true" ? "true" : "false",
    product_category_id: values.product_category_id || undefined,
    district_id: values.district_id || undefined,
    district: values.district || undefined,
  };
}

export function parseSupplierForm(values: DistrictEntityFormValues) {
  return districtSupplierCreateSchema.safeParse(toSupplierValidationInput(values));
}

export function parseSupplierFormUpdate(values: DistrictEntityFormValues) {
  return districtSupplierUpdateSchema.safeParse(toSupplierValidationInput(values));
}
