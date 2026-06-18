import { ENDPOINTS, httpClient, type RequestOptions } from "@/lib/api";
import { unwrapEntity, unwrapList, withCfcAuth } from "@/lib/cfc/api";
import type { CfcActivity, CfcActivityFormData } from "@/types/cfc-activity";
import type { CfcChartsListParams, CfcEvent, CfcPortalChart } from "@/types/cfc-portal";

export async function listCfcPortalEvents(
  params: { page?: number; limit?: number; search?: string } = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalEvents, {
    ...withCfcAuth(options),
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search?.trim() || undefined,
    },
  });
  return unwrapList<CfcEvent>(res.data);
}

export async function getCfcPortalEvent(id: string | number, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalEventDetail(id), withCfcAuth(options));
  return unwrapEntity<CfcEvent>(res.data);
}

export function buildCfcEventFormData(
  values: { event_name: string; event_date: string },
  images?: File[]
): FormData {
  const fd = new FormData();
  fd.append("event_name", values.event_name.trim());
  fd.append("event_date", values.event_date);
  if (images?.length) {
    for (const file of images) {
      fd.append("images", file);
    }
  }
  return fd;
}

export async function createCfcPortalEvent(formData: FormData, options?: RequestOptions) {
  return httpClient.post<unknown>(ENDPOINTS.cfc.portalEvents, formData, withCfcAuth(options));
}

export async function updateCfcPortalEvent(
  id: string | number,
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(ENDPOINTS.cfc.portalEventDetail(id), formData, withCfcAuth(options));
}

export async function deleteCfcPortalEvent(id: string | number, options?: RequestOptions) {
  return httpClient.delete<unknown>(ENDPOINTS.cfc.portalEventDetail(id), withCfcAuth(options));
}

export async function deleteCfcPortalEventImage(imageId: string | number, options?: RequestOptions) {
  return httpClient.delete<unknown>(ENDPOINTS.cfc.portalEventImage(imageId), withCfcAuth(options));
}

export async function listCfcPortalCharts(
  params: CfcChartsListParams = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalCharts, {
    ...withCfcAuth(options),
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      year: params.year,
      month: params.month,
      metric: params.metric,
    },
  });
  return unwrapList<CfcPortalChart>(res.data);
}

export async function getCfcPortalChart(id: string | number, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalChartDetail(id), withCfcAuth(options));
  return unwrapEntity<CfcPortalChart>(res.data);
}

export type CfcChartPayload = {
  year: string;
  month: string;
  income_month_year_wise?: number;
  expenses_month_year_wise?: number;
  capacity_usage_month_year_wise?: number;
};

export async function createCfcPortalChart(body: CfcChartPayload, options?: RequestOptions) {
  return httpClient.post<unknown>(ENDPOINTS.cfc.portalCharts, body, withCfcAuth(options));
}

export async function updateCfcPortalChart(
  id: string | number,
  body: CfcChartPayload,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(ENDPOINTS.cfc.portalChartDetail(id), body, withCfcAuth(options));
}

export async function deleteCfcPortalChart(id: string | number, options?: RequestOptions) {
  return httpClient.delete<unknown>(ENDPOINTS.cfc.portalChartDetail(id), withCfcAuth(options));
}

export async function listCfcPortalActivities(
  params: { page?: number; limit?: number; search?: string } = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalActivities, {
    ...withCfcAuth(options),
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search?.trim() || undefined,
    },
  });
  return unwrapList<CfcActivity>(res.data);
}

export async function getCfcPortalActivity(id: string | number, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.cfc.portalActivityDetail(id), withCfcAuth(options));
  return unwrapEntity<CfcActivity>(res.data);
}

export async function createCfcPortalActivity(body: CfcActivityFormData, options?: RequestOptions) {
  return httpClient.post<unknown>(
    ENDPOINTS.cfc.portalActivities,
    {
      activity_name: body.activity_name.trim(),
      activity_date: body.activity_date,
    },
    withCfcAuth(options)
  );
}

export async function updateCfcPortalActivity(
  id: string | number,
  body: CfcActivityFormData,
  options?: RequestOptions
) {
  return httpClient.put<unknown>(
    ENDPOINTS.cfc.portalActivityDetail(id),
    {
      activity_name: body.activity_name.trim(),
      activity_date: body.activity_date,
    },
    withCfcAuth(options)
  );
}

export async function deleteCfcPortalActivity(id: string | number, options?: RequestOptions) {
  return httpClient.delete<unknown>(ENDPOINTS.cfc.portalActivityDetail(id), withCfcAuth(options));
}
