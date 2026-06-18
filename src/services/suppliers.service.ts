import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import type { ApiResponse } from "@/lib/api/types";

export interface SupplierFilters {
  search?: string;
  district?: string;
  district_id?: number | number[];
  supplier_type?: string | string[];
  category_id?: number | number[];
  product_category_id?: number | number[];
  sort_by?: string;
  sort_order?: string;
}

const SUPPLIER_TYPE_FILTER_VALUES: Record<string, string> = {
  artisan: "Artisans",
  artisans: "Artisans",
  exporter: "Exporters",
  exporters: "Exporters",
  manufacturer: "Manufacturers",
  manufacturers: "Manufacturers",
  wholesaler: "Wholesalers",
  wholesalers: "Wholesalers",
  distributor: "Distributors",
  distributors: "Distributors",
  shopkeeper: "Shopkeepers",
  shopkeepers: "Shopkeepers",
};

function normalizeSupplierTypeFilter(value: string | number): string | number {
  if (typeof value !== "string") return value;
  return SUPPLIER_TYPE_FILTER_VALUES[value.trim().toLowerCase()] ?? value;
}

function appendFilterParam(
  params: URLSearchParams,
  key: string,
  value?: string | number | Array<string | number>,
  normalizeValue?: (value: string | number) => string | number
) {
  if (value == null) return;

  if (Array.isArray(value)) {
    for (const v of value) {
      params.append(key, (normalizeValue ? normalizeValue(v) : v).toString());
    }
    return;
  }

  params.append(key, (normalizeValue ? normalizeValue(value) : value).toString());
}

export async function fetchSuppliers(
  page: number, 
  limit: number, 
  filters?: SupplierFilters,
  options?: RequestOptions
): Promise<ApiResponse<unknown>> {
  let url = ENDPOINTS.suppliers(page, limit);
  if (filters) {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    appendFilterParam(params, "district_id", filters.district_id);
    appendFilterParam(params, "product_category_id", filters.product_category_id);
    appendFilterParam(params, "supplier_type", filters.supplier_type, normalizeSupplierTypeFilter);
    appendFilterParam(params, "sort_by", filters.sort_by);
    appendFilterParam(params, "sort_order", filters.sort_order);

    const queryString = params.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  return httpClient.get(url, options);
}

export async function fetchSupplierFilters(options?: RequestOptions): Promise<ApiResponse<unknown>> {
  return httpClient.get(ENDPOINTS.supplierFilters, options);
}

export async function fetchSupplierById(id: string | number, options?: RequestOptions): Promise<ApiResponse<unknown>> {
  return httpClient.get(ENDPOINTS.supplierDetail(id), options);
}
