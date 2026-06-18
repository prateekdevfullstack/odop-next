import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { ExporterType } from "@/lib/district-admin/constants";
import type { DistrictExporter } from "@/types/district-admin";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import { withDistrictAdminAuth, unwrapEntity, unwrapList } from "./district-admin-api";

function normalizeExporterType(value?: string | null): string {
  if (!value?.trim()) return ExporterType.MANUFACTURER;
  const match = Object.values(ExporterType).find(
    (option) => option.toLowerCase() === value.trim().toLowerCase()
  );
  return match ?? ExporterType.MANUFACTURER;
}

export type ExporterListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  product_category_id?: number;
  category_id?: number;
};

function appendFormValue(fd: FormData, key: string, value: string | number | undefined) {
  if (value === undefined || value === null || value === "") return;
  fd.append(key, String(value));
}

export function buildExporterFormData(
  values: DistrictEntityFormValues,
  logoFile?: File | null
): FormData {
  const fd = new FormData();

  const contactPerson = values.contact_person?.trim() ?? "";
  fd.append("name", values.owner_director_name?.trim() || "");
  appendFormValue(fd, "contact_person", contactPerson);
  appendFormValue(fd, "mobile_no", values.mobile_no.replace(/\D/g, "").slice(0, 10));
  if (values.email?.trim()) {
    appendFormValue(fd, "email", values.email.trim());
  }

  appendFormValue(fd, "export_company_name", (values.export_company_name?.trim() || values.enterprise_name?.trim()) || undefined);
  appendFormValue(fd, "office_address", (values.office_address?.trim() || values.address?.trim()) || undefined);
  appendFormValue(fd, "iec_number", values.iec_number.trim());
  appendFormValue(fd, "district", values.district.trim());

  if (values.district_id) {
    appendFormValue(fd, "district_id", values.district_id);
  }
  if (values.entity_type) {
    appendFormValue(fd, "exporter_type", values.entity_type);
  }
  if (values.product_category_id) {
    appendFormValue(fd, "product_category_id", values.product_category_id);
  }

  if (values.owner_director_name?.trim()) {
    appendFormValue(fd, "owner_director_name", values.owner_director_name.trim());
  }
  if (values.rcmc_details?.trim()) {
    appendFormValue(fd, "rcmc_details", values.rcmc_details.trim());
  }
  if (values.year_of_establishment?.trim()) {
    appendFormValue(fd, "year_of_establishment", values.year_of_establishment.trim());
  }
  if (values.designation?.trim()) {
    appendFormValue(fd, "designation", values.designation.trim());
  }
  if (values.website?.trim()) {
    let site = values.website.trim();
    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
    }
    appendFormValue(fd, "website", site);
  }

  return fd;
}

export async function listDistrictExporters(
  query: ExporterListQuery,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.exporters, {
    ...withDistrictAdminAuth(options),
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      product_category_id: query.product_category_id,
      category_id: query.category_id,
    },
  });
  const result = unwrapList<DistrictExporter>(res.data);
  result.items = [...result.items].sort((a, b) => a.id - b.id);
  return result;
}

export async function getDistrictExporter(id: number | string, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.exporterDetail(id), {
    ...withDistrictAdminAuth(options),
  });
  const entity = unwrapEntity<DistrictExporter>(res.data);
  return { ...res, data: entity };
}

export async function createDistrictExporter(
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.post<unknown>(ENDPOINTS.districtAdmin.exporters, formData, {
    ...withDistrictAdminAuth(options),
  });
}

export async function updateDistrictExporter(
  id: number | string,
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(ENDPOINTS.districtAdmin.exporterDetail(id), formData, {
    ...withDistrictAdminAuth(options),
  });
}

export function exporterToFormValues(
  exporter: DistrictExporter,
  districtName: string
): DistrictEntityFormValues {
  const user = exporter.user;
  return {
    name_prefix: "Do not wish to disclose",
    name: "",
    email: user?.email ?? exporter.email ?? exporter.email_id ?? "",
    mobile_no: user?.mobile_no ?? exporter.mobile_no ?? "",
    enterprise_name: exporter.export_company_name ?? exporter.enterprise_name ?? "",
    address: exporter.office_address ?? exporter.address ?? "",
    district: (exporter.districtMaster?.districtName ?? exporter.district) || districtName,
    enterprise_type: "",
    entity_type: normalizeExporterType(exporter.exporter_type),
    product_category_id: exporter.product_category_id
      ? String(exporter.product_category_id)
      : "",
    category_id: "",
    craft_specialization: "",
    contact_person: exporter.contact_person ?? user?.name ?? exporter.name ?? "",
    pincode: "",
    gst_number: "",
    udyam_registration: "",
    website: exporter.website ?? "",
    description: "",
    status: "",
    is_verified: "",
    district_id: exporter.district_id ? String(exporter.district_id) : "",
    registered_address: "",
    proprietor_director_name: "",
    pan_number: "",
    bulk_order: "false",
    export_company_name: exporter.export_company_name ?? exporter.enterprise_name ?? "",
    office_address: exporter.office_address ?? exporter.address ?? "",
    iec_number: exporter.iec_number ?? "",
    owner_director_name: exporter.owner_director_name ?? "",
    rcmc_details: exporter.rcmc_details ?? "",
    year_of_establishment: exporter.year_of_establishment ? String(exporter.year_of_establishment) : "",
    designation: exporter.designation ?? "",
    email_id: "",
    aadhar_number: "",
    production_capacity: "",
    customized_order: "no",
  };
}
