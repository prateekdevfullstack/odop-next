import { ENDPOINTS, httpClient, RequestOptions, PaginatedResponse } from "@/lib/api";
import { Scheme } from "@/lib/schemes";
import type { LookupOption } from "@/services/district-admin-lookups.service";
import { CfcItem } from "@/lib/api/cfc.types";
import { NablLabsListResponse } from "@/lib/api/nabl-labs.types";

export async function fetchSchemesList(options?: RequestOptions) {
  return httpClient.get<Scheme[]>(ENDPOINTS.schemes.list, options);
}

export async function fetchOdopSchemeOptions(
  options?: RequestOptions
): Promise<LookupOption[]> {
  const res = await fetchSchemesList(options);
  const list = Array.isArray(res?.data) ? res.data : [];
  return list
    .filter((scheme) => scheme.schemeType === "ODOP")
    .map((scheme) => ({ id: scheme.id, name: scheme.name }));
}

export async function fetchSchemeDetail(slug: string, options?: RequestOptions) {
  return httpClient.get<Scheme>(ENDPOINTS.schemes.detail(slug), options);
}

export interface SchemeQueryOption {
  id: number;
  name?: string;
  query_title?: string;
  title?: string;
  label?: string;
  question?: string;
  name_hindi?: string | null;
  title_hindi?: string | null;
}

export async function fetchSchemeQueryOptions(
  schemeId: number | string,
  options?: RequestOptions
) {
  return httpClient.get<SchemeQueryOption[]>(ENDPOINTS.schemeQueries.list, {
    ...options,
    params: { scheme_id: schemeId, ...options?.params },
  });
}

export async function submitSchemeGrievance(
  payload: Record<string, string | number>,
  options?: RequestOptions
) {
  return httpClient.post<unknown>(ENDPOINTS.userGrievances.create, payload, options);
}

export async function fetchCfcList(page: number = 1, limit: number = 10, id?: string | number, options?: RequestOptions) {
  let url = `${ENDPOINTS.cfc.list}?page=${page}&limit=${limit}`;
  if (id) {
    url += `&id=${id}`;
  }
  return httpClient.get<PaginatedResponse<CfcItem>>(url, options);
}

export async function fetchCfcDetail(id: string | number, options?: RequestOptions) {
  return httpClient.get<PaginatedResponse<CfcItem>>(`${ENDPOINTS.cfc.detail(id)}`, options);
}

export async function fetchNablLabsList(page: number = 1, limit: number = 10, options?: RequestOptions) {
  return httpClient.get<NablLabsListResponse>(`${ENDPOINTS.nablLabs.list}?page=${page}&limit=${limit}`, options);
}


