import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

type CourseCategory =
  | "industrial"
  | "professional"
  | "technical"
  | "competitive"
  | "udyamitaForYouth"
  | "careerCounselling";

type AuthCourseCategory =
  | "industrial"
  | "professional"
  | "technical"
  | "competitive"
  | "udyamitaForYouth"
  | "documentaries"
  | "projectReport";

export async function fetchCollegeCoursesByCategory(
  category: CourseCategory,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.collegeCourses[category], options);
}

export async function fetchCollegeCoursesAuthByCategory(
  category: AuthCourseCategory,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.collegeCoursesAuth[category], options);
}

export async function fetchCourseDetail(
  slug: string,
  subSlug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.courseDetail(slug, subSlug), options);
}

export async function fetchCourseDetailAuth(
  slug: string,
  subSlug: string,
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.courseDetailAuth(slug, subSlug), options);
}

export async function fetchJobVacancies(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.jobVacancy, options);
}

export async function fetchJobVacanciesAuth(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.jobVacancyAuth, options);
}
