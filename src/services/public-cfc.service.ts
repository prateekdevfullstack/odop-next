import { ENDPOINTS, httpClient, type RequestOptions } from "@/lib/api";
import { unwrapEntity, unwrapList } from "@/lib/cfc/api";
import type { CfcActivity } from "@/types/cfc-activity";
import type { CfcEvent } from "@/types/cfc-portal";

export type PublicCfcEventsParams = {
  cfc_id?: number | string;
  page?: number;
  limit?: number;
  search?: string;
};

export async function listPublicCfcEvents(
  params: PublicCfcEventsParams = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.publicEvents, {
    skipAuth: true,
    ...options,
    params: {
      cfc_id: params.cfc_id,
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      search: params.search?.trim() || undefined,
    },
  });
  return unwrapList<CfcEvent>(res.data);
}

export async function getPublicCfcEventDetail(id: string | number, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.publicEventDetail(id), {
    skipAuth: true,
    ...options,
  });
  return unwrapEntity<CfcEvent>(res.data);
}

export type PublicCfcActivitiesParams = {
  cfc_id: number | string;
  page?: number;
  limit?: number;
  search?: string;
};

export async function listPublicCfcActivities(
  params: PublicCfcActivitiesParams,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.publicActivities, {
    skipAuth: true,
    ...options,
    params: {
      cfc_id: params.cfc_id,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search?.trim() || undefined,
    },
  });
  return unwrapList<CfcActivity>(res.data);
}

export async function getPublicCfcActivityDetail(id: string | number, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.publicActivityDetail(id), {
    skipAuth: true,
    ...options,
  });
  return unwrapEntity<CfcActivity>(res.data);
}
