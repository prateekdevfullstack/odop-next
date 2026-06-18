export interface CfcMonthlyReportResponse {
  data: CfcMonthlyReport[];
  pagination: Pagination;
}

export interface CfcMonthlyReport {
  id: number;
  district_id: number;
  cfc_id: number;
  year: string;
  month: string;
  beneficiary: string;
  beneficiary_from_out_districts: string;
  income_month_year_wise: string;
  expenses_month_year_wise: string;
  capacity_usage_month_year_wise: string;
  beneficiary_last_month: string;
  total_beneficiary_current_financial_year: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  city: City;
  cfc: Cfc;
}

export interface City {
  id: number;
  districtName: string;
  state_id: number;
}

export interface Cfc {
  id: number;
  name: string;
  city_id: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CfcImage {
  id?: number;
  image?: string;
}

export interface CfcItem {
  id: number;
  city_id: number;
  product_category_id: number;
  name: string;
  name_hindi?: string | null;
  spv_name: string;
  spv_name_hindi?: string | null;
  address: string;
  address_hindi?: string | null;
  contact_number: string;
  intervention: string;
  intervention_hindi?: string | null;
  max_capacity_usage: number;
  project_cost: number;
  facilities_available: string;
  facilities_available_hindi?: string | null;
  income_month_year_wise: string;
  expenses_month_year_wise: string;
  capacity_usage_month_year_wise: string;
  beneficiary_last_month: number;
  total_beneficiary_current_financial_year: number;
  beneficiary_out_of_district: number;
  major_initiatives: string;
  major_initiatives_hindi?: string | null;
  video_url?: string | null;
  thumbnail?: string | null;
  cfc_attachment: string;
  cfc_category: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  city: {
    id: number;
    districtName: string;
    nameHindi?: string | null;
    districtImage: string;
    state_id: number;
    status: number;
    sequence: string;
    state: {
      id: number;
      name: string;
      code: string;
      status: number;
    };
  };
  productCategory: {
    id: number;
    name: string;
    name_hindi?: string | null;
    slug: string;
    status: number;
  };
  cfcImages?: CfcImage[];
  pdf_link?: string;
  slug?: string;
}
