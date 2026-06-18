import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import {
  mapPublicSuccessStory,
  sortPublicSuccessStories,
  type PublicSuccessStory,
} from "@/lib/success-stories";

export async function fetchSuccessStories(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.successStories, options);
}

export async function fetchSuccessStoriyList() {
  return httpClient.get(ENDPOINTS.successStoriesListAPI);
}

/** Home + KB list from `/api/public/success-stories`. */
export async function fetchPublicSuccessStories(
  options?: RequestOptions,
  limit = 1000,
): Promise<PublicSuccessStory[]> {
  const baseUrl = ENDPOINTS.successStoriesListAPI.split("?")[0];
  const url = `${baseUrl}?page=1&limit=${limit}`;
  const response = await httpClient.get<{ data?: unknown[] }>(url, options);
  const rows = Array.isArray(response.data?.data) ? response.data.data : [];
  const stories = rows
    .map(mapPublicSuccessStory)
    .filter((story): story is PublicSuccessStory => story != null);
  return sortPublicSuccessStories(stories);
}

export type { PublicSuccessStory };