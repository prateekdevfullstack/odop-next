import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchCertificateProgress(
  categoryId: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.certificate.udyamitaProgress(categoryId),
    options
  );
}

export async function fetchCertificateList(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.certificate.udyamitaList, options);
}

export async function storeUserProgress(
  slug: string,
  id: string | number,
  options?: RequestOptions
) {
  return httpClient.post(
    ENDPOINTS.certificate.storeUserProgress(slug, id),
    undefined,
    options
  );
}

export async function fetchAssessmentQuestions(
  slug: string,
  id: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.certificate.getQuestions(slug, id),
    options
  );
}

export async function submitAssessmentAnswer(
  data: Record<string, unknown>,
  options?: RequestOptions
) {
  return httpClient.post(
    ENDPOINTS.certificate.submitAnswer,
    data,
    options
  );
}

export async function submitAssessment(
  data: Record<string, unknown>,
  options?: RequestOptions
) {
  return httpClient.post(
    ENDPOINTS.certificate.submitAssessment,
    data,
    options
  );
}

export async function fetchAnswerKey(
  slug: string,
  id: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.certificate.downloadAnswerKey(slug, id),
    options
  );
}

export async function downloadCertificate(
  userId: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.certificate.downloadCertificate(userId),
    options
  );
}

export async function downloadEdpCertificate(
  userId: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.certificate.downloadEdpCertificate(userId),
    options
  );
}
