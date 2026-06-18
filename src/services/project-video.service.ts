import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchProjectVideos(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.productDocumentary, options);
}
