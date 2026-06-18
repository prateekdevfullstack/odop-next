import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { SUPPLIER_TYPE_OPTIONS } from "@/lib/district-admin/constants";
import type { DistrictSupplier } from "@/types/district-admin";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import { withDistrictAdminAuth, unwrapEntity, unwrapList } from "./district-admin-api";

function normalizeSupplierType(value?: string | null): string {
  if (!value?.trim()) return "Manufacturers";
  const match = SUPPLIER_TYPE_OPTIONS.find(
    (option) => option.toLowerCase() === value.trim().toLowerCase()
  );
  return match ?? "Manufacturers";
}

export type SupplierListQuery = {
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

export function buildSupplierFormData(
  values: DistrictEntityFormValues,
  logoFile?: File | null
): FormData {
  const fd = new FormData();

  const enterpriseName = values.enterprise_name.trim();
  appendFormValue(fd, "name", enterpriseName);
  appendFormValue(fd, "enterprise_name", enterpriseName);
  appendFormValue(fd, "mobile_no", values.mobile_no.replace(/\D/g, "").slice(0, 10));
  if (values.email?.trim()) {
    appendFormValue(fd, "email", values.email.trim());
  }

  appendFormValue(fd, "registered_address", values.registered_address.trim() || values.address.trim());
  appendFormValue(fd, "district", values.district.trim());

  if (values.district_id) {
    appendFormValue(fd, "district_id", values.district_id);
  }
  if (values.product_category_id) {
    appendFormValue(fd, "product_category_id", values.product_category_id);
  }
  if (values.gst_number?.trim()) {
    appendFormValue(fd, "gst_number", values.gst_number.trim());
  }
  if (values.udyam_registration?.trim()) {
    appendFormValue(fd, "udyam_registration", values.udyam_registration.trim());
  }

  if (values.website?.trim()) {
    let site = values.website.trim();
    if (!/^https?:\/\//i.test(site)) {
      site = `https://${site}`;
    }
    appendFormValue(fd, "website", site);
  }

  if (values.proprietor_director_name?.trim()) {
    appendFormValue(fd, "proprietor_director_name", values.proprietor_director_name.trim());
  }
  if (values.pan_number?.trim()) {
    appendFormValue(fd, "pan_number", values.pan_number.trim());
  }

  appendFormValue(fd, "bulk_order", values.bulk_order === "true" ? "true" : "false");

  return fd;
}

export async function listDistrictSuppliers(
  query: SupplierListQuery,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.suppliers, {
    ...withDistrictAdminAuth(options),
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      product_category_id: query.product_category_id,
      category_id: query.category_id,
    },
  });
  const result = unwrapList<DistrictSupplier>(res.data);
  result.items = [...result.items].sort((a, b) => a.id - b.id);
  return result;
}

export async function getDistrictSupplier(id: number | string, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.supplierDetail(id), {
    ...withDistrictAdminAuth(options),
  });
  const entity = unwrapEntity<DistrictSupplier>(res.data);
  return { ...res, data: entity };
}

export async function createDistrictSupplier(
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.post<unknown>(ENDPOINTS.districtAdmin.suppliers, formData, {
    ...withDistrictAdminAuth(options),
  });
}

export async function updateDistrictSupplier(
  id: number | string,
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(ENDPOINTS.districtAdmin.supplierDetail(id), formData, {
    ...withDistrictAdminAuth(options),
  });
}

export function supplierToFormValues(
  supplier: DistrictSupplier,
  districtName: string
): DistrictEntityFormValues {
  const user = supplier.user;
  return {
    name_prefix: "Do not wish to disclose",
    name: "",
    email: user?.email ?? supplier.email ?? "",
    mobile_no: user?.mobile_no ?? supplier.mobile_no ?? "",
    enterprise_name:
      supplier.enterprise_name ?? user?.name ?? supplier.name ?? "",
    address: supplier.registered_address ?? supplier.address ?? "",
    district: (supplier.districtMaster?.districtName ?? supplier.district) || districtName,
    enterprise_type: "",
    entity_type: "Manufacturers",
    product_category_id: supplier.product_category_id
      ? String(supplier.product_category_id)
      : "",
    category_id: "",
    craft_specialization: "",
    contact_person: "",
    pincode: "",
    gst_number: supplier.gst_number ?? "",
    udyam_registration: supplier.udyam_registration ?? "",
    website: supplier.website ?? "",
    description: "",
    status: "",
    is_verified: "",
    district_id: supplier.district_id ? String(supplier.district_id) : "",
    registered_address: supplier.registered_address ?? supplier.address ?? "",
    proprietor_director_name: supplier.proprietor_director_name ?? "",
    pan_number: supplier.pan_number ?? "",
    bulk_order: supplier.bulk_order === true || String(supplier.bulk_order) === "true" ? "true" : "false",
    export_company_name: "",
    office_address: "",
    iec_number: "",
    owner_director_name: "",
    rcmc_details: "",
    year_of_establishment: "",
    designation: "",
    email_id: "",
    aadhar_number: "",
    production_capacity: "",
    customized_order: "no",
  };
}
