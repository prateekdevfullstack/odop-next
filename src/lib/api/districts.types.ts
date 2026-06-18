export interface PublicDistrictState {
  id: number;
  name: string;
  code: string;
  status: number;
}

export interface PublicDistrictCategory {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
}

export interface PublicDistrictCategoryLink {
  id: number;
  city_id: number;
  category_id: number;
  category: PublicDistrictCategory;
}

export interface PublicDistrictProductCategory {
  id: number;
  name: string;
  name_hindi?: string | null;
  nameHindi?: string | null;
  slug: string;
  thumbnail: string | null;
  short_description: string | null;
  description: string | null;
  type: "primary" | "secondary" | string;
  status: number;
  is_approved: number;
  productCategoryImages: unknown[];
}

export interface PublicDistrictProductCategoryImage {
  id: number;
  image?: string | null;
  url?: string | null;
  thumbnail?: string | null;
  path?: string | null;
}

export interface PublicDistrictCfcProductCategory {
  id: number;
  name: string;
  name_hindi?: string | null;
  slug: string;
  status: number;
}

export interface PublicDistrictCfc {
  id: number;
  city_id: number;
  product_category_id: number;
  name: string;
  spv_name?: string | null;
  address?: string | null;
  contact_number?: string | null;
  intervention?: string | null;
  max_capacity_usage?: number | null;
  project_cost?: number | string | null;
  facilities_available?: string | null;
  income_month_year_wise?: string | null;
  expenses_month_year_wise?: string | null;
  capacity_usage_month_year_wise?: string | null;
  beneficiary_last_month?: number | null;
  total_beneficiary_current_financial_year?: number | null;
  beneficiary_out_of_district?: number | null;
  major_initiatives?: string | null;
  cfc_attachment?: string | null;
  thumbnail?: string | null;
  video_url?: string | null;
  cfc_category?: string | null;
  status?: string | null;
  productCategory?: PublicDistrictCfcProductCategory | null;
  product?: PublicDistrictCfcProductCategory | null;
}

export interface PublicDistrictProductCategoryLink {
  id: number;
  city_id: number;
  product_category_id: number;
  description?: string | null;
  description_hindi?: string | null;
  productCategory: PublicDistrictProductCategory;
  cityProductCategoryImages: PublicDistrictProductCategoryImage[];
}

export interface PublicDistrictSuccessStoryImage {
  id: number;
  imagePath?: string | null;
  sortOrder?: number;
  success_story_id?: number;
}

export interface PublicDistrictSuccessStory {
  id: number;
  name: string;
  businessName?: string | null;
  state_id?: number;
  city_id?: number;
  shortDescription?: string | null;
  fullStory?: string | null;
  profileImage?: string | null;
  status?: number;
  isFeatured?: boolean;
  isDeleted?: boolean;
  productImages?: PublicDistrictSuccessStoryImage[];
}

export interface PublicDistrictNablLabProduct {
  id: number;
  name: string;
  name_hindi?: string | null;
  slug: string;
  status: number;
}

export interface PublicDistrictNablLab {
  id: number;
  city_id: number;
  product_id?: number;
  lab_name: string;
  lab_name_hindi?: string | null;
  lab_code?: string | null;
  address?: string | null;
  district?: string | null;
  discipline?: string[] | string | null;
  contact_number?: string | null;
  email?: string | null;
  status?: string | null;
  isDeleted?: boolean;
  product?: PublicDistrictNablLabProduct | null;
}

export interface PublicDistrictDocumentary {
  id?: number;
  name?: string;
  title?: string;
  slug?: string;
  thumbnail?: string | null;
  short_description?: string | null;
  description?: string | null;
  url?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  language?: string | null;
}

export interface PublicDistrictProjectReport {
  id?: number;
  name?: string;
  title?: string;
  slug?: string;
  thumbnail?: string | null;
  image?: string | null;
  description?: string | null;
  short_description?: string | null;
  pdf?: string | null;
  file?: string | null;
  report_url?: string | null;
  url?: string | null;
}

export interface PublicDistrict {
  id: number;
  districtName: string;
  nameHindi: string | null;
  districtDescriptionHeading: string | null;
  districtDescriptionHeadingHindi: string | null;
  districtDescription: string | null;
  districtDescriptionHindi: string | null;
  districtImage: string | null;
  districtImageHindi: string | null;
  documentaryThumbnail: string | null;
  documentaryVideoUrlEnglish: string | null;
  documentaryVideoUrlHindi: string | null;
  population: number | null;
  areaSqKm: number | null;
  state_id: number;
  status: number;
  sequence: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  state?: PublicDistrictState;
  cityCategoryLinks?: PublicDistrictCategoryLink[];
  cityProductCategoryLinks?: PublicDistrictProductCategoryLink[];
  primaryProductCategory?: PublicDistrictProductCategory | null;
  cfcs?: PublicDistrictCfc[];
  successStories?: PublicDistrictSuccessStory[];
  nablLabs?: PublicDistrictNablLab[];
  documentaries?: PublicDistrictDocumentary[];
  projectReports?: PublicDistrictProjectReport[];
}

export interface PublicDistrictPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicDistrictListApiResponse {
  success?: boolean;
  message?: string;
  data: PublicDistrict[];
  pagination?: PublicDistrictPagination;
}

export interface PublicDistrictDetailApiResponse {
  success?: boolean;
  message?: string;
  data: PublicDistrict;
}

export interface PublicDistrictListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicDistrictListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "district_name" | "id" | "sequence" | "name_hindi";
  sort_order?: "asc" | "desc";
}

export interface PublicDistrictListResult {
  items: PublicDistrict[];
  meta: PublicDistrictListMeta;
}

export interface DistrictDetailCfc {
  id: number;
  product_category_id: number;
  product_category_name: string;
  name: string;
  spv_name: string;
  address: string;
  contact_number: string;
  intervention: string;
  facilities_available: string;
  max_capacity_usage: string;
  capacity_usage_month_year_wise: string;
  project_cost: string;
  income_month_year_wise: string;
  expenses_month_year_wise: string;
  beneficiary_last_month: string;
  total_beneficiary_current_financial_year: string;
  beneficiary_out_of_district: string;
  major_initiatives: string;
  major_initiatives_items: string[];
  thumbnail: string;
  attachment_url: string;
  video_url: string;
  cfc_category: string;
  status: string;
}

/** View model consumed by the district detail page UI. */
export interface DistrictDetailProduct {
  id: number;
  linkId: number;
  name: string;
  hindi_name: string;
  slug: string;
  thumbnail: string;
  description: string;
  hindi_description: string;
  status: string;
  type?: string;
  /** Resolved image URLs from cityProductCategoryImages only */
  images: string[];
  /** CFCs linked to this product category */
  cfcs: DistrictDetailCfc[];
}

export interface DistrictDetailFamous {
  id: number;
  name: string;
  hindi_name: string;
  slug: string;
  thumbnail: string;
  descriptions: string;
  hindi_descriptions: string;
  url: string | null;
  status: string;
}

export interface DistrictDetailType {
  id: number;
  name: string;
  hindi_name: string;
  slug: string;
  thumbnail: string;
  descriptions: string;
  district_famous: DistrictDetailFamous[];
}

export interface DistrictDetailSuccessStory {
  id: number;
  name: string;
  businessName: string;
  shortDescription: string;
  fullStory: string;
  profileImage: string;
  productImages: string[];
  isFeatured: boolean;
}

export interface DistrictDetailNablLab {
  id: number;
  lab_name: string;
  lab_name_hindi: string;
  lab_code: string;
  address: string;
  district: string;
  disciplines: string[];
  contact_number: string;
  email: string;
  status: string;
  product_name: string;
  product_name_hindi: string;
}

export interface DistrictDetailDocumentary {
  id: number;
  title: string;
  thumbnail: string;
  video_url: string;
  description: string;
  language: string;
}

export interface DistrictDetailProjectReport {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
  file_url: string;
}

export interface DistrictDetailView {
  id: number;
  name: string;
  hindi_name: string;
  title: string;
  hindi_title: string;
  short_description: string;
  description: string;
  hindi_description: string;
  thumbnail: string;
  documentaryThumbnail: string;
  slug: string;
  url: string;
  district_product: DistrictDetailProduct[];
  success_stories: DistrictDetailSuccessStory[];
  documentaries: DistrictDetailDocumentary[];
  nabl_labs: DistrictDetailNablLab[];
  project_reports: DistrictDetailProjectReport[];
}

export interface DistrictDetailResponse {
  district: DistrictDetailView;
  districtType: DistrictDetailType[];
}

export interface DistrictScheme {
  department: string;
  scheme_name: string;
  scheme_hyperlink: string;
}

export interface DistrictSchemesData {
  district_name: string;
  state: string;
  connected_schemes: DistrictScheme[];
}
