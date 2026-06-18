import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchEntrepreneurDevelopmentList(
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.entrepreneurDevelopment, options);
}

export async function fetchEntrepreneurDevelopmentDetail(
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.entrepreneurDevelopmentDetail(slug),
    options
  );
}

export async function fetchProductDocumentary(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.productDocumentary, options);
}

export async function fetchIndustrialDetail(
  category: string,
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.industrialDetail(category, slug),
    options
  );
}

export async function fetchExpertTalkTabs(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.expertTalkTabs, options);
}

export async function fetchExpertEpisode(
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.expertEpisode(slug), options);
}

export async function fetchIndustrialSolutions(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.industrialSolutions, options);
}

export async function fetchIndustrialSolutionDetail(
  category: string,
  slug: string,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.industrialSolutionDetail(category, slug),
    options
  );
}
