import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { withDistrictAdminAuth } from "./district-admin-api";
import type { UnifiedEnquiryListQuery, UnifiedEnquiryListResponse } from "@/types/unified-enquiry";

function cleanQuery(query: UnifiedEnquiryListQuery): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

export async function fetchUnifiedEnquiries(
  query: UnifiedEnquiryListQuery = {},
  options?: RequestOptions
): Promise<UnifiedEnquiryListResponse> {
  const res = await httpClient.get<UnifiedEnquiryListResponse>(
    ENDPOINTS.districtAdmin.enquiries,
    {
      ...withDistrictAdminAuth(options),
      params: cleanQuery({
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        ...query,
      }),
    }
  );
  return res.data;
}
