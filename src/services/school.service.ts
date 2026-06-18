import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

type SchoolCategory =
  | "projectWork"
  | "careerCounselling"
  | "orientationCourses"
  | "industrialTour"
  | "expertTalk"
  | "carrierCourses"
  | "competitiveExam";

export async function fetchSchoolClassList(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.schoolCbse, options);
}

export async function fetchSchoolClassListAuth(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.schoolCbseAuth, options);
}

export async function fetchSchoolSubjectDetail(
  classSlug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.schoolSubjectDetail(classSlug), options);
}

export async function fetchSchoolSubjectDetailAuth(
  classSlug: string,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.schoolSubjectDetailAuth(classSlug),
    options
  );
}

export async function fetchSchoolCategoryContent(
  category: SchoolCategory,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.schoolCategories[category], options);
}

export async function fetchSchoolCategoryContentAuth(
  category: SchoolCategory,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.schoolCategoriesAuth[category], options);
}

export async function fetchClassCurriculum(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.classCurriculum, options);
}
