import { z } from "zod";
import { ExporterType } from "@/lib/district-admin/constants";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import {
  mobileSchema,
  normalizeMobileInput,
  optionalEmailSchema,
  optionalWebsiteSchema,
  trimString,
} from "./district-admin-shared.schema";

const optionalYearSchema = z
  .string()
  .optional()
  .refine(
    (v) => !v || v.trim() === "" || /^(19|20)\d{2}$/.test(v.trim()),
    "Year of establishment must be a 4-digit year"
  );

const exporterFieldsSchema = z.object({
  export_company_name: z.string().optional(),
  mobile_no: mobileSchema,
  entity_type: z.nativeEnum(ExporterType).optional(),
  owner_director_name: z.string().min(1, "Owner/Director name is required"),
  iec_number: z.string().min(1, "IEC number is required"),
  rcmc_details: z.string().optional(),
  year_of_establishment: optionalYearSchema,
  office_address: z.string().optional(),
  contact_person: z.string().optional(),
  designation: z.string().optional(),
  email: optionalEmailSchema,
  website: optionalWebsiteSchema,
  product_category_id: z.string().min(1, "ODOP Product category is required"),
  district_id: z.string().optional(),
  district: z.string().optional(),
});

export const districtExporterCreateSchema = exporterFieldsSchema;
export const districtExporterUpdateSchema = exporterFieldsSchema;

export type DistrictExporterCreateInput = z.infer<typeof districtExporterCreateSchema>;
export type DistrictExporterUpdateInput = z.infer<typeof districtExporterUpdateSchema>;

export function toExporterValidationInput(values: DistrictEntityFormValues) {
  const exportCompanyName = (
    values.export_company_name ||
    values.enterprise_name ||
    ""
  ).trim();
  const officeAddress = (values.office_address || values.address || "").trim();

  const exporterTypeValue = Object.values(ExporterType).includes(
    values.entity_type as ExporterType
  )
    ? (values.entity_type as ExporterType)
    : undefined;

  return {
    export_company_name: exportCompanyName || undefined,
    mobile_no: normalizeMobileInput(values.mobile_no),
    entity_type: exporterTypeValue,
    owner_director_name: trimString(values.owner_director_name) as string,
    iec_number: trimString(values.iec_number) as string,
    rcmc_details: values.rcmc_details || undefined,
    year_of_establishment: values.year_of_establishment || undefined,
    office_address: officeAddress || undefined,
    contact_person: values.contact_person || undefined,
    designation: values.designation || undefined,
    email: values.email || values.email_id || undefined,
    website: values.website || undefined,
    product_category_id: values.product_category_id || undefined,
    district_id: values.district_id || undefined,
    district: values.district || undefined,
  };
}

export function parseExporterForm(values: DistrictEntityFormValues) {
  return districtExporterCreateSchema.safeParse(toExporterValidationInput(values));
}

export function parseExporterFormUpdate(values: DistrictEntityFormValues) {
  return districtExporterUpdateSchema.safeParse(toExporterValidationInput(values));
}
