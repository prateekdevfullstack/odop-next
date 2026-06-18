import { API_CONFIG } from "@/lib/api/config";
import { getAuthToken } from "@/services/auth.service";

const API_ORIGIN = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");

export interface FilterOption {
  id: number;
  name: string;
  name_hindi?: string | null;
}

export interface SupplierTypeFilterOption {
  value: string;
  label: string;
}

export interface FilterResponseData {
  districts: FilterOption[];
  supplier_types: SupplierTypeFilterOption[];
  product_categories: FilterOption[];
}

export interface DirectoryFiltersResponse {
  success: boolean;
  message: string;
  data: FilterResponseData;
}

export interface DirectoryItem {
  id: number;
  supplier_type: string;
  name: string;
  mobile_no: string | null;
  email: string | null;
  address: string | null;
  district: string | null;
  product_category: string | null;
  category: string | null;
  is_verified: number | null;
  created_at: string | null;
}

export interface DirectoryMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface DirectoryListResponse {
  success: boolean;
  message: string;
  data: DirectoryItem[];
  meta: DirectoryMeta;
}

export interface DirectoryQueryParameters {
  supplier_type?: "Manufacturers" | "Artisans" | "Exporters";
  district_id?: number;
  product_category_id?: number;
  category_id?: number;
  search?: string;
  is_verified?: number;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "updated_at" | "name";
  sort_order?: "ASC" | "DESC";
}

function buildDirectoryQuery(
  params: Omit<DirectoryQueryParameters, "page" | "limit"> & { page?: number; limit?: number }
): URLSearchParams {
  const query = new URLSearchParams();

  if (params.supplier_type) {
    const value =
      (params.supplier_type as string) === "Manufacturers & Wholesalers"
        ? "Manufacturers"
        : params.supplier_type;
    query.set("supplier_type", value);
  }
  if (params.district_id) query.set("district_id", params.district_id.toString());
  if (params.product_category_id) query.set("product_category_id", params.product_category_id.toString());
  if (params.category_id) query.set("category_id", params.category_id.toString());
  if (params.search) query.set("search", params.search);
  if (params.is_verified !== undefined) query.set("is_verified", params.is_verified.toString());
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);

  return query;
}

export async function getSupplierDirectoryFilters(): Promise<DirectoryFiltersResponse> {
  const response = await fetch(`${API_ORIGIN}/public/suppliers/filters`);
  if (!response.ok) throw new Error(`Failed to fetch filters: ${response.status}`);
  return response.json() as Promise<DirectoryFiltersResponse>;
}

export async function getSupplierDirectory(
  params: DirectoryQueryParameters
): Promise<DirectoryListResponse> {
  const query = buildDirectoryQuery(params);
  const response = await fetch(`${API_ORIGIN}/public/suppliers?${query.toString()}`);
  if (!response.ok) throw new Error(`Failed to fetch suppliers: ${response.status}`);
  return response.json() as Promise<DirectoryListResponse>;
}

export interface ProductCategoryOption {
  id: number;
  name: string;
  name_hindi?: string | null;
}

export async function getProductCategoriesByDistrict(
  districtId: number,
  districtName?: string
): Promise<ProductCategoryOption[]> {
  const query = new URLSearchParams();
  query.set("district_id", districtId.toString());
  if (districtName) query.set("districtName", districtName);
  const response = await fetch(
    `${API_ORIGIN}/api/public/product-categories/dropdown?${query.toString()}`
  );
  if (!response.ok) return [];
  const body = (await response.json()) as unknown;
  let list: unknown[] = [];
  if (Array.isArray(body)) {
    list = body;
  } else if (typeof body === "object" && body !== null) {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data as unknown[];
    else if (
      typeof obj.data === "object" &&
      obj.data !== null &&
      Array.isArray((obj.data as Record<string, unknown>).data)
    ) {
      list = (obj.data as Record<string, unknown>).data as unknown[];
    }
  }
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const id = Number(row.id ?? row.value);
      const name = String(row.name ?? row.label ?? row.title ?? "").trim();
      const nameHindiRaw = row.name_hindi ?? row.nameHindi;
      const name_hindi =
        typeof nameHindiRaw === "string" && nameHindiRaw.trim()
          ? nameHindiRaw.trim()
          : undefined;
      if (!Number.isFinite(id) || id <= 0 || !name) return null;
      const option: ProductCategoryOption = { id, name };
      if (name_hindi) option.name_hindi = name_hindi;
      return option;
    })
    .filter((x): x is ProductCategoryOption => x !== null);
}

export interface SupplierPhoneResponse {
  success: boolean;
  message: string;
  data: {
    mobile_no: string;
  };
}

export async function revealSupplierPhone(supplierId: number): Promise<string> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_ORIGIN}/public/suppliers/${supplierId}/phone`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Failed to reveal phone: ${response.status}`);

  const body = (await response.json()) as SupplierPhoneResponse;
  const mobile = body.data?.mobile_no?.trim();
  if (!mobile) throw new Error("Phone number not available");
  return mobile;
}

export async function downloadSupplierDirectoryPdf(
  params: Omit<DirectoryQueryParameters, "page" | "limit">
): Promise<void> {
  const query = buildDirectoryQuery(params);
  const response = await fetch(
    `${API_ORIGIN}/public/suppliers/export/pdf?${query.toString()}`
  );
  if (!response.ok) throw new Error(`Failed to export PDF: ${response.status}`);

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const contentDisposition = response.headers.get("content-disposition");
  let filename = `supplier-directory-${Date.now()}.pdf`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+?)"/);
    if (match?.[1]) filename = match[1];
  }

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
