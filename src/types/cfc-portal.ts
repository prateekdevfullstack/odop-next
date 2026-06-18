export type CfcPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CfcEventImage = {
  id: number;
  image: string;
  createdAt?: string;
};

export type CfcEvent = {
  id: number;
  cfc_id: number;
  event_name: string;
  event_date: string;
  description?: string | null;
  event_description?: string | null;
  cfc?: {
    id: number;
    name: string;
    city_id: number;
    city?: { districtName: string };
  };
  images?: CfcEventImage[];
};

export type CfcPortalChart = {
  id: number;
  cfc_id?: number;
  district_id?: number;
  year: string;
  month: string;
  income_month_year_wise?: string | number | null;
  expenses_month_year_wise?: string | number | null;
  capacity_usage_month_year_wise?: string | number | null;
  status?: boolean;
  cfc?: { id: number; name: string };
  city?: { districtName: string };
};

export type CfcChartFormValues = {
  year: string;
  month: string;
  income_month_year_wise: string;
  expenses_month_year_wise: string;
  capacity_usage_month_year_wise: string;
};

export type CfcEventFormValues = {
  event_name: string;
  event_date: string;
};

export type CfcListParams = {
  page?: number;
  limit?: number;
  city_id?: number | string;
  product_category_id?: number | string;
  cfc_category?: "A" | "B" | "C" | "NA" | string;
  q?: string;
};

export type CfcEventsListParams = {
  cfc_id: number | string;
  page?: number;
  limit?: number;
  search?: string;
};

export type CfcChartsListParams = {
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
  metric?: "capacity" | "expenses" | "income";
};

export type CfcPublicChartsParams = {
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
};
