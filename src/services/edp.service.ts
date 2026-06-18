import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchEdpList(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.edp.list, options);
}

export async function fetchEdpModuleList(
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.edp.moduleList(slug), options);
}

export async function fetchEdpOrders(
  userId: string | number,
  centerCode: string,
  categoryId: string | number,
  aadharNo: string,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.edp.orders(userId, centerCode, categoryId, aadharNo),
    options
  );
}
