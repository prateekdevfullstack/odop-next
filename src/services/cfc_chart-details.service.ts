import { ENDPOINTS, httpClient } from "@/lib/api";

export async function getCfcChartDetails(id: string | number) {
  return httpClient.get(ENDPOINTS.cfc.chatdetails(id));
}
