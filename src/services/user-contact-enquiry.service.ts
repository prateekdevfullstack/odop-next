import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { unwrapEntity, unwrapList } from "@/services/district-admin-api";
import type {
  ContactEnquiry,
  ContactEnquiryListQuery,
  CreateContactEnquiryPayload,
  CreateContactEnquiryResult,
  EnquiryQueryCategoryOption,
} from "@/types/contact-enquiry";

function unwrapCategories(body: unknown): EnquiryQueryCategoryOption[] {
  if (Array.isArray(body)) return body as EnquiryQueryCategoryOption[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: EnquiryQueryCategoryOption[] }).data;
  }
  return [];
}

export async function listEnquiryQueryCategories(options?: RequestOptions) {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.users.contactEnquiryQueryCategories,
    options
  );
  return unwrapCategories(res.data);
}

export async function listPublicEnquiryQueryCategories(options?: RequestOptions) {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.publicEnquiryQueryCategories,
    { skipAuth: true, ...options }
  );
  return unwrapCategories(res.data);
}

export async function submitContactEnquiry(
  payload: CreateContactEnquiryPayload,
  options?: RequestOptions
) {
  const res = await httpClient.post<unknown>(
    ENDPOINTS.users.contactEnquiries,
    payload,
    options
  );
  const body = res.data as {
    success?: boolean;
    message?: string;
    data?: CreateContactEnquiryResult;
  };
  return {
    ...res,
    data: body.data ?? null,
    message: body.message,
  };
}

export async function listUserContactEnquiries(
  query: ContactEnquiryListQuery = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.users.contactEnquiries, {
    ...options,
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
  });
  return unwrapList<ContactEnquiry>(res.data);
}

export async function getUserContactEnquiry(
  id: number | string,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.users.contactEnquiryDetail(id),
    options
  );
  const entity = unwrapEntity<ContactEnquiry>(res.data);
  return { ...res, data: entity };
}

export async function addUserContactEnquiryComment(
  id: number | string,
  remarks: string,
  options?: RequestOptions
) {
  return httpClient.post<unknown>(
    ENDPOINTS.users.contactEnquiryComments(id),
    { remarks: remarks.trim() },
    options
  );
}
