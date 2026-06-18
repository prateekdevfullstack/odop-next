import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchDocumentaries(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.productDocumentary, options);
}
