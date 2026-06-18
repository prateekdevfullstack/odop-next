import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import {
  withDistrictAdminAuth,
  unwrapEntity,
  unwrapList,
} from "./district-admin-api";
import type {
  ContactEnquiry,
  ContactEnquiryListQuery,
  EnquiryQueryCategoryOption,
  UpdateContactEnquiryStatusPayload,
} from "@/types/contact-enquiry";

function cleanQuery(
  query: ContactEnquiryListQuery
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

function unwrapCategories(body: unknown): EnquiryQueryCategoryOption[] {
  if (Array.isArray(body)) return body as EnquiryQueryCategoryOption[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: EnquiryQueryCategoryOption[] }).data;
  }
  return [];
}

export async function listDistrictContactEnquiries(
  query: ContactEnquiryListQuery = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.contactEnquiries, {
    ...withDistrictAdminAuth(options),
    params: cleanQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      ...query,
    }),
  });
  return unwrapList<ContactEnquiry>(res.data);
}

export async function getDistrictContactEnquiry(
  id: number | string,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.districtAdmin.contactEnquiryDetail(id),
    { ...withDistrictAdminAuth(options) }
  );
  const entity = unwrapEntity<ContactEnquiry>(res.data);
  return { ...res, data: entity };
}

export async function updateDistrictContactEnquiryStatus(
  id: number | string,
  payload: UpdateContactEnquiryStatusPayload,
  options?: RequestOptions
) {
  const res = await httpClient.patch<unknown>(
    ENDPOINTS.districtAdmin.contactEnquiryStatusUpdate(id),
    payload,
    { ...withDistrictAdminAuth(options) }
  );
  const entity = unwrapEntity<ContactEnquiry>(res.data);
  return { ...res, data: entity };
}

export async function fetchContactQueryCategoryOptions(
  options?: RequestOptions
): Promise<EnquiryQueryCategoryOption[]> {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.publicEnquiryQueryCategories,
    { skipAuth: true, ...options }
  );
  return unwrapCategories(res.data);
}
