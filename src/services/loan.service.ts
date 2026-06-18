import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchUserLoan(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.loan, options);
}

export async function checkUserLoan(
  mobile: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.checkUserLoan(mobile), options);
}
