import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchHamaraPradeshDistricts(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.hamaraPradeshDistricts, options);
}

export async function fetchHamaraPradeshVideoIntro(
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.hamaraPradeshVideoIntro, options);
}

export async function fetchHamaraPradeshDetail(
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.hamaraPradeshDetail(slug), options);
}

export async function fetchHamaraPradeshDetailByid(
  id: any,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.hamaraPradeshDetailById(id), options);
}
