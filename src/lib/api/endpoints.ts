import { API_CONFIG } from "./config";

const base = API_CONFIG.BASE_URL;
const new_base = API_CONFIG.NEW_BASE_URL;

function buildUrl(
  template: string,
  params?: Record<string, string | number>
): string {
  let url = template;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }
  return url;
}

export const ENDPOINTS = {
  aboutUs: `${base}/api/mobile/aboutus`,

  entrepreneurDevelopment: `${base}/api/mobile/entrepreneur-development`,
  entrepreneurDevelopmentDetail: (slug: string) =>
    buildUrl(`${base}/api/mobile/entrepreneur-development/{slug}`, { slug }),

  productDocumentary: `${base}/api/mobile/product-documentry`,
  industrialDetail: (category: string, slug: string) =>
    buildUrl(`${base}/api/mobile/industrialdetails/{category}/{slug}`, {
      category,
      slug,
    }),

  expertTalkTabs: `${base}/api/mobile/professionalepisodes-tab`,
  expertEpisode: (slug: string) =>
    buildUrl(`${base}/api/mobile/expert-episode/{slug}`, { slug }),

  projectReports: `${base}/api/mobile/v1/project-reports?page=1`,
  projectReportSearch: `${base}/api/mobile/report-search`,
  projectReportDetail: (slug: string) =>
    buildUrl(`${base}/api/mobile/reportdetails/{slug}`, { slug }),

  districts: `${base}/api/mobile/districts`,
  marketplaceProductList: (districtId: string | number) =>
    buildUrl(
      `${base}/api/mobile/marketplace-product-list?districtid={districtId}`,
      { districtId }
    ),

  successStoriesListAPI: `${new_base}/api/public/success-stories?page=1&limit=1000`,
  
  successStories: `${base}/api/mobile/v1/get-success-story?page=1`,
  loanLinkCategory: `${base}/api/mobile/link-category-component`,
  governmentSchemes: `${base}/api/mobile/government-scheme`,

  hamaraPradeshDistricts: `${base}/api/mobile/districts`,
  hamaraPradeshVideoIntro: `${base}/api/mobile/district-intro/`,
  hamaraPradeshDetail: (slug: string) =>
    buildUrl(`${base}/api/mobile/district/{slug}`, { slug }),
  hamaraPradeshDetailById: (id: string) =>
    buildUrl(`${base}/api/mobile/district-intro/{id}`, { id }),

   suppliers: (page: number, limit: number) =>
    buildUrl(`${new_base}/public/suppliers?page=${page}&limit=${limit}`, { page, limit }),

  supplierDetail: (id: string | number) =>
    buildUrl(`${new_base}/public/suppliers/{id}`, { id }),

  supplierPhone: (id: string | number) =>
    buildUrl(`${new_base}/public/suppliers/{id}/phone`, { id }),

  supplierFilters: `${new_base}/public/suppliers/filters`,

  industrialSolutions: `${base}/api/mobile/industrial-solutions`,
  industrialSolutionDetail: (category: string, slug: string) =>
    buildUrl(`${base}/api/mobile/industrialdetails/{category}/{slug}`, {
      category,
      slug,
    }),

  workshop: `${base}/api/mobile/workshop`,
  upcomingWorkshops: (limit: number) =>
    buildUrl(`${base}/api/mobile/wed/workshop?limit={limit}`, { limit }),
  uploadProfileImage: `${base}/api/mobile/wed/image-upload`,

  collegeCourses: {
    industrial: `${base}/api/mobile/categories/courses`,
    professional: `${base}/api/mobile/categories/professional-courses`,
    technical: `${base}/api/mobile/categories/technical-courses`,
    competitive: `${base}/api/mobile/categories/competitive-courses`,
    udyamitaForYouth: `${base}/api/mobile/categories/udyamita-for-youth`,
    careerCounselling: `${base}/api/mobile/categories/career-counselling`,
  },

  collegeCoursesAuth: {
    industrial: `${base}/api/mobile/wed/categories/courses`,
    professional: `${base}/api/mobile/wed/categories/professional-courses`,
    technical: `${base}/api/mobile/wed/categories/technical-courses`,
    competitive: `${base}/api/mobile/wed/categories/competitive-courses`,
    udyamitaForYouth: `${base}/api/mobile/wed/categories/udyamita-for-youth`,
    documentaries: `${base}/api/mobile/wed/categories/documentaries-youth`,
    projectReport: `${base}/api/mobile/wed/categories/project-reportyouth`,
  },

  courseDetail: (slug: string, subSlug: string) =>
    buildUrl(`${base}/api/mobile/courses/{slug}/{subSlug}/`, {
      slug,
      subSlug,
    }),
  courseDetailAuth: (slug: string, subSlug: string) =>
    buildUrl(`${base}/api/mobile/wed/courses/{slug}/{subSlug}/`, {
      slug,
      subSlug,
    }),

  jobVacancy: `${base}/api/mobile/job-vacancy`,
  jobVacancyAuth: `${base}/api/mobile/wed/job-vacancy`,

  schoolCbse: `${base}/api/mobile/cbse`,
  schoolCbseAuth: `${base}/api/mobile/wed/cbse`,
  schoolSubjectDetail: (classSlug: string) =>
    buildUrl(`${base}/api/mobile/cbse/{classSlug}`, { classSlug }),
  schoolSubjectDetailAuth: (classSlug: string) =>
    buildUrl(`${base}/api/mobile/wed/cbse/{classSlug}`, { classSlug }),

  schoolCategories: {
    projectWork: `${base}/api/mobile/categories/project-work`,
    careerCounselling: `${base}/api/mobile/categories/careercounselling`,
    orientationCourses: `${base}/api/mobile/categories/orientation-courses`,
    industrialTour: `${base}/api/mobile/categories/industrial-tour`,
    expertTalk: `${base}/api/mobile/categories/expert-talk`,
    carrierCourses: `${base}/api/mobile/categories/carrier-courses`,
    competitiveExam: `${base}/api/mobile/categories/competitive-exam`,
  },

  schoolCategoriesAuth: {
    projectWork: `${base}/api/mobile/wed/categories/project-work`,
    careerCounselling: `${base}/api/mobile/wed/categories/careercounselling`,
    orientationCourses: `${base}/api/mobile/wed/categories/orientation-courses`,
    industrialTour: `${base}/api/mobile/wed/categories/industrial-tour`,
    expertTalk: `${base}/api/mobile/wed/categories/expert-talk`,
    carrierCourses: `${base}/api/mobile/wed/categories/carrier-courses`,
    competitiveExam: `${base}/api/mobile/wed/categories/competitive-exam`,
  },

  marketplaceAuth: {
    districts: `${base}/api/mobile/wed/districts`,
    create: `${base}/api/mobile/create-marketplace`,
    createProduct: `${base}/api/mobile/wed/create-marketplace-product`,
    productListCategory: `${base}/api/mobile/wed/product-list-category`,
  },

  profile: `${base}/api/mobile/wed/profile`,
  profileUpdate: `${base}/api/mobile/wed/profile-update`,

  classCurriculum: `${base}/api/mobile/wed/class-curuculum`,

  certificate: {
    udyamitaProgress: (categoryId: string | number) =>
      buildUrl(
        `${base}/api/mobile/auth/entrepreneur-development?category_id={categoryId}`,
        { categoryId }
      ),
    udyamitaList: `${base}/api/mobile/entrepreneur-development`,
    storeUserProgress: (slug: string, id: string | number) =>
      buildUrl(
        `${base}/api/mobile/wed/entrepreneur-development/user-progress/{slug}?id={id}`,
        { slug, id }
      ),
    getQuestions: (slug: string, id: string | number) =>
      buildUrl(
        `${base}/api/mobile/entrepreneur-development/{slug}/assessment/get-questions?id={id}`,
        { slug, id }
      ),
    submitAnswer: `${base}/api/mobile/wed/assessment/answer`,
    submitAssessment: `${base}/api/mobile/wed/assessment/submit`,
    downloadAnswerKey: (slug: string, id: string | number) =>
      buildUrl(
        `${base}/api/mobile/wed/entrepreneur-development/{slug}/assessment/download-answer-key?id={id}`,
        { slug, id }
      ),
    downloadCertificate: (userId: string | number) =>
      buildUrl(
        `${base}/api/mobile/certificate/download?user_id={userId}`,
        { userId }
      ),
    downloadEdpCertificate: (userId: string | number) =>
      buildUrl(`${base}/api/mobile/edp-certificate?user_id={userId}`, {
        userId,
      }),
  },

  loan: `${base}/api/mobile/wed/user-loan`,
  checkUserLoan: (mobile: string) =>
    buildUrl(`${base}/api/mobile/wed/check-user?mobile={mobile}`, { mobile }),
  forgotPassword: `${base}/api/mobile/wed/forgot-password`,

  edp: {
    list: `${base}/api/mobile/entrepreneur-youth`,
    moduleList: (slug: string) =>
      buildUrl(`${base}/api/mobile/entrepreneur-youth/{slug}`, { slug }),
    orders: (
      userId: string | number,
      centerCode: string,
      categoryId: string | number,
      aadharNo: string
    ) =>
      buildUrl(
        `${base}/api/mobile/wed/edpOrders?user_id={userId}&center_code={centerCode}&category_id={categoryId}&aadhar_no={aadharNo}`,
        { userId, centerCode, categoryId, aadharNo }
      ),
  },

  exhibition: {
    stateExhibition: `${base}/api/mobile/state-exhibition`,
    exhibitionList: `${base}/api/mobile/exhibition-list/`,
    pressGallery: `${base}/api/mobile/pressgallery`,
    photoGallery: `${base}/api/mobile/photogallery`,
    videoGallery: `${base}/api/mobile/videogallery`,
  },

  schemes: {
    list: `${new_base}/api/public/schemes`,
    detail: (slug: string) =>
      buildUrl(`${new_base}/api/public/schemes/{slug}`, { slug }),
  },

  schemeQueries: {
    list: `${new_base}/public/scheme-queries`,
  },

  userGrievances: {
    create: `${new_base}/api/user/grievances`,
  },

  cfc: {
    list: `${new_base}/api/public/cfc`,
    detail: (id: string | number) => buildUrl(`${new_base}/api/public/cfc/{id}`, { id }),
    chatdetails: (id: string | number) => buildUrl(`${new_base}/api/public/cfc-charts/{id}?page=1&limit=1000`, { id }),
    publicCharts: (cfcId: string | number) =>
      buildUrl(`${new_base}/api/public/cfc-charts/{cfcId}`, { cfcId }),
    publicChartDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/public/cfc-charts/detail/{id}`, { id }),
    publicEvents: `${new_base}/api/public/cfc-events`,
    publicEventDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/public/cfc-events/{id}`, { id }),
    login: `${new_base}/api/cfc/login`,
    profile: `${new_base}/api/cfc/profile`,
    portalEvents: `${new_base}/api/cfc/events`,
    portalEventDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/cfc/events/{id}`, { id }),
    portalEventImage: (imageId: string | number) =>
      buildUrl(`${new_base}/api/cfc/events/images/{imageId}`, { imageId }),
    portalCharts: `${new_base}/api/cfc/charts`,
    portalChartDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/cfc/charts/{id}`, { id }),
    portalActivities: `${new_base}/api/cfc/activities`,
    portalActivityDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/cfc/activities/{id}`, { id }),
    publicActivities: `${new_base}/api/public/cfc-activities`,
    publicActivityDetail: (id: string | number) =>
      buildUrl(`${new_base}/api/public/cfc-activities/{id}`, { id }),
  },

  nablLabs:{
    list: `${new_base}/api/public/nabl-labs`
  },
  knowledgeHub: `${new_base}/api/public/knowledge-hub`,
  knowledgeHubScroll: `${API_CONFIG.API_URL}/api/public/knowledge-hub-scroll`,
  gallery_master: `${new_base}/api/public/gallery-master`,
  mda_reports: `${new_base}/api/public/mda-reports`,

  auth: {
    login: `${base}/api/mobile/login`,
    register: `${base}/api/mobile/register`,
    userLogin: `${new_base}/api/users/login`,
    userRegister: `${new_base}/api/users/register`,
    supplierLogin: `${new_base}/auth/login`,
    supplierRegister: `${new_base}/auth/register`,
    districtAdminLogin: `${new_base}/auth/district-admin/login`,
    districtSupervisorLogin: `${new_base}/auth/district-administrator-supervisor/login`,
  },

  users: {
    accessedSuppliers: `${new_base}/api/users/accessed-suppliers`,
    profileUpdate: `${new_base}/api/users/profile`,
    grievances: `${new_base}/api/user/grievances`,
    grievanceDetail: (id: number | string) =>
      `${new_base}/api/user/grievances/${id}`,
    grievanceComments: (id: number | string) =>
      `${new_base}/api/user/grievances/${id}/comments`,
    contactEnquiries: `${new_base}/api/user/contact-enquiries`,
    contactEnquiryQueryCategories: `${new_base}/api/user/contact-enquiries/query-categories`,
    contactEnquiryDetail: (id: number | string) =>
      `${new_base}/api/user/contact-enquiries/${id}`,
    contactEnquiryComments: (id: number | string) =>
      `${new_base}/api/user/contact-enquiries/${id}/comments`,
  },

  supplierPhoneAccessLogs: `${new_base}/api/supplier-phone-access-logs`,

  districtAdmin: {
    suppliers: `${new_base}/api/district-admin/suppliers`,
    supplierDetail: (id: number | string) =>
      `${new_base}/api/district-admin/suppliers/${id}`,
    artisans: `${new_base}/api/district-admin/artisans`,
    artisanDetail: (id: number | string) =>
      `${new_base}/api/district-admin/artisans/${id}`,
    exporters: `${new_base}/api/district-admin/exporters`,
    exporterDetail: (id: number | string) =>
      `${new_base}/api/district-admin/exporters/${id}`,
    grievances: `${new_base}/api/district-admin/grievances`,
    grievanceDetail: (id: number | string) =>
      `${new_base}/api/district-admin/grievances/${id}`,
    grievanceStatusUpdate: (id: number | string) =>
      `${new_base}/api/district-admin/grievances/${id}/status`,
    grievanceDashboard: `${new_base}/api/district-admin/grievances/dashboard`,
    grievanceReports: `${new_base}/api/district-admin/grievances/reports`,
    grievanceExport: `${new_base}/api/district-admin/grievances/reports/export`,
    contactEnquiries: `${new_base}/api/district-admin/contact-enquiries`,
    contactEnquiryDetail: (id: number | string) =>
      `${new_base}/api/district-admin/contact-enquiries/${id}`,
    contactEnquiryStatusUpdate: (id: number | string) =>
      `${new_base}/api/district-admin/contact-enquiries/${id}/status`,
    enquiries: `${new_base}/api/district-admin/enquiries`,
  },

  districtAdminSupervisor: {
    profileSummary: `${new_base}/api/district-admin-supervisor/profile-summary`,
  },

  supplierProducts: {
    base: `${new_base}/api/supplier/supplier-products`,
    stats: `${new_base}/api/supplier/supplier-products/dashboard/stats`,
    /** Supplier-scoped detail (legacy). */
    detail: (id: number | string) => `${new_base}/api/supplier/supplier-products/${id}`,
    profile: `${new_base}/api/supplier/profile`,
    profileUpdate: `${new_base}/api/supplier/profile`,
    /** Admin API: GET / PUT / DELETE by id. */
    adminDetail: (id: number | string) =>
      `${new_base}/api/admin/supplier-products/${id}`,
  },

  publicDistricts: {
    list: `${new_base}/api/public/districts`,
    detail: (id: string | number) =>
      buildUrl(`${new_base}/api/public/districts/{id}`, { id }),
    schemes: (districtId: string | number) =>
      buildUrl(`${new_base}/api/public/district-schemes/district/{districtId}`, { districtId }),
  },

  public: {
    categoriesDropdown: `${new_base}/api/public/product-categories/dropdown`,
    categories: `${new_base}/api/public/categories`,
    craftSpecialization: `${new_base}/api/public/craft-specialization`,
    giProducts: `${new_base}/api/public/product-categories/is_gi_product`,
  },

  eventCategories: {
    list: `${new_base}/api/public/event-categories`,
    all: `${new_base}/api/public/event-categories/all`,
    detail: (id: string | number) =>
      buildUrl(`${new_base}/api/public/event-categories/{id}`, { id }),
  },

  events: {
    list: `${new_base}/api/public/events`,
    gallery: `${new_base}/api/public/events-gallery`,
  },

  publicEnquiryQueryCategories: `${new_base}/public/enquiry-query-categories`,

  pastEvents: {
    list: `${new_base}/api/public/past-events`,
  },

  chat: {
    askStream: "/api/chat",
    backendAskStream: `${API_CONFIG.CHAT_BASE_URL}/chat/ask-stream`,
  },

  visitors: {
    get: `${new_base}/api/public/visitors`,
    increment: `${new_base}/api/public/visitors/increment`,
  },
} as const;

