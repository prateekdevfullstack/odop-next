import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import {
  ARTISAN_NAME_PREFIX_OPTIONS,
  type ArtisanCustomizedOrderOption,
} from "@/lib/district-admin/constants";
import type { DistrictArtisan, DistrictEntityFormValues } from "@/types/district-admin";
import { withDistrictAdminAuth, unwrapEntity, unwrapList } from "./district-admin-api";

export type ArtisanListQuery = {
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

function toApiCustomizedOrder(value: string): ArtisanCustomizedOrderOption {
  if (value === "Yes" || value.toLowerCase() === "yes") return "Yes";
  return "No";
}

function normalizeCraftSpecialization(value?: string | number | null): string {
  if (value === undefined || value === null || String(value).trim() === "") return "";
  return String(value).trim();
}

/** Build multipart body matching backend CreateArtisanDto / UpdateArtisanDto. */
export function buildArtisanFormData(values: DistrictEntityFormValues): FormData {
  const fd = new FormData();

  appendFormValue(fd, "name", values.name.trim());
  appendFormValue(fd, "mobile_no", values.mobile_no.replace(/\D/g, "").slice(0, 10));
  appendFormValue(fd, "address", values.address.trim());
  appendFormValue(fd, "aadhar_number", values.aadhar_number.replace(/\D/g, "").slice(0, 12));

  if (values.email?.trim()) {
    appendFormValue(fd, "email", values.email.trim());
  }
  appendFormValue(fd, "district", values.district.trim());
  if (values.district_id) {
    appendFormValue(fd, "district_id", Number(values.district_id));
  }
  if (values.product_category_id) {
    appendFormValue(fd, "product_category_id", Number(values.product_category_id));
  }
  if (
    values.name_prefix &&
    ARTISAN_NAME_PREFIX_OPTIONS.includes(
      values.name_prefix as (typeof ARTISAN_NAME_PREFIX_OPTIONS)[number]
    )
  ) {
    appendFormValue(fd, "name_prefix", values.name_prefix);
  }
  if (values.craft_specialization?.trim()) {
    appendFormValue(fd, "craft_specialization", values.craft_specialization.trim());
  }
  if (values.production_capacity?.trim()) {
    appendFormValue(fd, "production_capacity", values.production_capacity.trim());
  }
  appendFormValue(fd, "customized_order", toApiCustomizedOrder(values.customized_order));
  if (values.website?.trim()) {
    appendFormValue(fd, "website", values.website.trim());
  }

  return fd;
}

export async function listDistrictArtisans(query: ArtisanListQuery, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.artisans, {
    ...withDistrictAdminAuth(options),
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      product_category_id: query.product_category_id,
      category_id: query.category_id,
    },
  });
  const result = unwrapList<DistrictArtisan>(res.data);
  result.items = [...result.items].sort((a, b) => a.id - b.id);
  return result;
}

export async function getDistrictArtisan(id: number | string, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.artisanDetail(id), {
    ...withDistrictAdminAuth(options),
  });
  const entity = unwrapEntity<DistrictArtisan>(res.data);
  return { ...res, data: entity };
}

export async function createDistrictArtisan(formData: FormData, options?: RequestOptions) {
  return httpClient.post<unknown>(ENDPOINTS.districtAdmin.artisans, formData, {
    ...withDistrictAdminAuth(options),
  });
}

export async function updateDistrictArtisan(
  id: number | string,
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(ENDPOINTS.districtAdmin.artisanDetail(id), formData, {
    ...withDistrictAdminAuth(options),
  });
}

function parseArtisanNamePrefix(name: string): { name_prefix: string; name: string } {
  const prefixes = [...ARTISAN_NAME_PREFIX_OPTIONS];
  const trimmed = name.trim();
  for (const prefix of prefixes) {
    if (trimmed.startsWith(`${prefix} `)) {
      return {
        name_prefix: prefix,
        name: trimmed.slice(prefix.length).trim(),
      };
    }
  }
  return { name_prefix: "Do not wish to disclose", name: trimmed };
}

export function artisanToFormValues(
  artisan: DistrictArtisan,
  districtName: string
): DistrictEntityFormValues {
  const user = artisan.user;
  const rawName = user?.name ?? artisan.name ?? "";
  const parsedName = parseArtisanNamePrefix(rawName);

  return {
    name_prefix: parsedName.name_prefix,
    name: parsedName.name,
    email: user?.email ?? artisan.email ?? "",
    mobile_no: user?.mobile_no ?? artisan.mobile_no ?? "",
    enterprise_name: artisan.enterprise_name ?? "",
    address: artisan.address ?? "",
    district: artisan.district || districtName,
    enterprise_type: artisan.enterprise_type ?? "",
    entity_type: "",
    product_category_id: artisan.product_category_id
      ? String(artisan.product_category_id)
      : "",
    category_id: artisan.category_id ? String(artisan.category_id) : "",
    craft_specialization: normalizeCraftSpecialization(
      artisan.craft_specialization ?? artisan.category?.name
    ),
    contact_person: artisan.contact_person ?? "",
    pincode: artisan.pincode ?? "",
    gst_number: artisan.gst_number ?? "",
    udyam_registration: artisan.udyam_registration ?? "",
    website: artisan.website ?? "",
    aadhar_number: artisan.aadhar_number ?? "",
    production_capacity: artisan.production_capacity ?? "",
    customized_order: toApiCustomizedOrder(String(artisan.customized_order ?? "No")),
    description: artisan.artisan_description ?? "",
    status: artisan.status !== undefined ? String(artisan.status) : "1",
    is_verified: artisan.is_verified !== undefined ? String(artisan.is_verified) : "0",
    district_id: artisan.district_id ? String(artisan.district_id) : "",
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
