import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import type { KnowledgeHubScrollResponse } from "@/lib/api/knowledge-hub-scroll.types";

export async function fetchAboutUs(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.aboutUs, options);
}

export async function fetchGovernmentSchemes(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.governmentSchemes, options);
}

export async function fetchLoanLinkCategories(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.loanLinkCategory, options);
}

export async function fetchKnowledgeHub(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.knowledgeHub, options);
}

export async function fetchKnowledgeHubScroll(options?: RequestOptions) {
  return httpClient.get<KnowledgeHubScrollResponse>(ENDPOINTS.knowledgeHubScroll, options);
}

export async function fetchGalleryMaster(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.gallery_master, options);
}

export async function fetchMdaReports(scheme?: string, options?: RequestOptions) {
  const url = scheme ? `${ENDPOINTS.mda_reports}?scheme=${scheme}` : ENDPOINTS.mda_reports;
  return httpClient.get(url, options);
}
