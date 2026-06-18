import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchProjectReports(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.projectReports, options);
}

export async function searchProjectReports(
  query: string,
  options?: RequestOptions
) {
  return httpClient.post(ENDPOINTS.projectReportSearch, { query }, options);
}

export async function fetchProjectReportDetail(
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.projectReportDetail(slug), options);
}
