import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchWorkshops(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.workshop, options);
}

export async function fetchUpcomingWorkshops(
  limit: number,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.upcomingWorkshops(limit), options);
}
