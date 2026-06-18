import type { DistrictEntityFormValues } from "@/types/district-admin";
import { ExporterType } from "./constants";

export function createEmptyEntityForm(districtName: string): DistrictEntityFormValues {
  return {
    name_prefix: "Do not wish to disclose",
    name: "",
    email: "",
    mobile_no: "",
    enterprise_name: "",
    address: "",
    district: districtName,
    enterprise_type: "",
    entity_type: "Manufacturers",
    product_category_id: "",
    category_id: "",
    craft_specialization: "",
    contact_person: "",
    pincode: "",
    gst_number: "",
    udyam_registration: "",
    website: "",
    aadhar_number: "",
    production_capacity: "",
    customized_order: "No",
    description: "",
    status: "1",
    is_verified: "0",
    district_id: "",
    registered_address: "",
    proprietor_director_name: "",
    pan_number: "",
    bulk_order: "false",
    export_company_name: "",
    office_address: "",
    iec_number: "",
    owner_director_name: "",
    rcmc_details: "",
    year_of_establishment: "",
    designation: "",
    email_id: "",
  };
}

export function createEmptyArtisanForm(districtName: string): DistrictEntityFormValues {
  return {
    ...createEmptyEntityForm(districtName),
    entity_type: "",
    enterprise_name: "",
    enterprise_type: "",
  };
}

export { bootstrapDistrictFormValues, validateDistrictId } from "./district-form-bootstrap";

export function createEmptyExporterForm(districtName: string): DistrictEntityFormValues {
  return {
    ...createEmptyEntityForm(districtName),
    entity_type: ExporterType.MANUFACTURER,
  };
}

export function zodErrorsToMap(err: import("zod").ZodError): Record<string, string> {
  const flat = err.flatten().fieldErrors;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(flat)) {
    if (v?.[0]) out[k] = v[0];
  }
  return out;
}

export function apiErrorsToMap(errors: Record<string, string[]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, arr] of Object.entries(errors)) {
    if (arr?.length) out[k] = arr.length > 1 ? arr.join("; ") : arr[0]!;
  }
  return out;
}
