import { httpClient, ENDPOINTS, type RequestOptions, type PaginatedResponse } from "@/lib/api";
import {
  type ApiResponse,
} from "@/lib/api";
import type {
  CreateSupplierProductDto,
  SupplierProduct,
  ProductCategory,
  SupplierDashboardStats,
} from "@/types/supplier-product";

export type {
  CreateSupplierProductDto,
  SupplierProduct,
  ProductCategory,
  SupplierDashboardStats,
} from "@/types/supplier-product";

export { ProductAvailability, ProductStatus } from "@/types/supplier-product";
export {
  PRODUCT_AVAILABILITY_LABELS,
  PRODUCT_STATUS_LABELS,
  normalizeProductAvailability,
  normalizeProductStatus,
} from "@/types/supplier-product";

export type SupplierProductFiles = {
  thumbnail?: File | null;
  productImages?: File[];
};

function isSupplierProductRecord(v: unknown): v is SupplierProduct {
  return (
    typeof v === "object" &&
    v !== null &&
    "id" in v &&
    typeof (v as { id: unknown }).id === "number" &&
    "product_name" in v &&
    typeof (v as { product_name: unknown }).product_name === "string"
  );
}

/**
 * New/admin APIs often return `{ success, message, data: SupplierProduct }`.
 * `httpClient` assigns the full JSON body to `response.data`, so we unwrap here.
 */
export function unwrapSupplierProductResponse(body: unknown): SupplierProduct | null {
  if (body == null) return null;
  if (isSupplierProductRecord(body)) return body;
  if (typeof body === "object" && body !== null && "data" in body) {
    const inner = (body as { data: unknown }).data;
    if (isSupplierProductRecord(inner)) return inner;
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (isSupplierProductRecord(nested)) return nested;
    }
  }
  return null;
}

function mapProductResponse<T>(res: ApiResponse<unknown>, entity: T): ApiResponse<T> {
  return { ...res, data: entity };
}

function trimOrUndefined(s: string | undefined): string | undefined {
  if (s === undefined) return undefined;
  const t = s.trim();
  return t === "" ? undefined : t;
}

/** Build JSON body matching backend DTO field names. */
export function supplierProductDtoFromForm(
  values: CreateSupplierProductDto | Record<string, unknown>
): CreateSupplierProductDto {
  const v = values as CreateSupplierProductDto;
  return {
    user_id: v.user_id,
    category_id: Number(v.category_id),
    product_name: String(v.product_name ?? "").trim(),
    slug: trimOrUndefined(v.slug as string | undefined),
    sku_code: trimOrUndefined(v.sku_code as string | undefined),
    hsn_code: trimOrUndefined(v.hsn_code as string | undefined),
    description: trimOrUndefined(v.description as string | undefined),
    min_price: v.min_price !== undefined && v.min_price !== null && !Number.isNaN(Number(v.min_price))
      ? Number(v.min_price)
      : undefined,
    max_price: v.max_price !== undefined && v.max_price !== null && !Number.isNaN(Number(v.max_price))
      ? Number(v.max_price)
      : undefined,
    moq:
      v.moq !== undefined && v.moq !== null && String(v.moq) !== "" && !Number.isNaN(Number(v.moq))
        ? Number(v.moq)
        : undefined,
    monthly_capacity: trimOrUndefined(v.monthly_capacity as string | undefined),
    lead_time: trimOrUndefined(v.lead_time as string | undefined),
    availability: v.availability === "" || v.availability === undefined ? undefined : v.availability,
    video_url: trimOrUndefined(v.video_url as string | undefined),
    color_options: trimOrUndefined(v.color_options as string | undefined),
    export_ready:
      v.export_ready === undefined ? undefined : Boolean(v.export_ready),
    search_tags: trimOrUndefined(v.search_tags as string | undefined),
    status: v.status === "" || v.status === undefined ? undefined : v.status,
    thumbnail_image: typeof v.thumbnail_image === "string" ? trimOrUndefined(v.thumbnail_image) : undefined,
    product_images: Array.isArray(v.product_images)
      ? (v.product_images as string[]).filter((x) => typeof x === "string" && x.trim() !== "")
      : undefined,
  };
}

function appendDtoToFormData(fd: FormData, dto: CreateSupplierProductDto | UpdateSupplierProductDto): void {
  const entries: [string, string | number | boolean][] = [];

  if (dto.user_id !== undefined && dto.user_id !== null) {
    entries.push(["user_id", dto.user_id]);
  }
  if (dto.category_id !== undefined && dto.category_id !== null) {
    entries.push(["category_id", dto.category_id]);
  }
  if (dto.product_name != null && dto.product_name !== "") {
    entries.push(["product_name", dto.product_name]);
  }
  if (dto.slug != null && dto.slug !== "") entries.push(["slug", dto.slug]);
  if (dto.sku_code != null && dto.sku_code !== "") entries.push(["sku_code", dto.sku_code]);
  if (dto.hsn_code != null && dto.hsn_code !== "") entries.push(["hsn_code", dto.hsn_code]);
  if (dto.description != null && dto.description !== "") entries.push(["description", dto.description]);
  if (dto.min_price !== undefined) entries.push(["min_price", dto.min_price]);
  if (dto.max_price !== undefined) entries.push(["max_price", dto.max_price]);
  if (dto.moq !== undefined) entries.push(["moq", dto.moq]);
  if (dto.monthly_capacity !== undefined) entries.push(["monthly_capacity", dto.monthly_capacity]);
  if (dto.lead_time !== undefined) entries.push(["lead_time", dto.lead_time]);
  if (dto.availability !== undefined) entries.push(["availability", String(dto.availability)]);
  if (dto.video_url != null && dto.video_url !== "") entries.push(["video_url", dto.video_url]);
  if (dto.color_options != null && dto.color_options !== "") entries.push(["color_options", dto.color_options]);
  entries.push(["export_ready", dto.export_ready === true ? "true" : "false"]);
  if (dto.search_tags != null && dto.search_tags !== "") entries.push(["search_tags", dto.search_tags]);
  if (dto.status !== undefined) entries.push(["status", String(dto.status)]);

  if (typeof dto.thumbnail_image === "string" && dto.thumbnail_image) {
    entries.push(["thumbnail_image", dto.thumbnail_image]);
  }
  for (const url of dto.product_images ?? []) {
    if (url) fd.append("product_images", url);
  }

  for (const [k, val] of entries) {
    fd.append(k, String(val));
  }
}

export interface Category {
  id: number;
  name: string;
}
export interface SupplierProfile {
  id: number;
  user_id: number;
  enterprise_name?: string;
  address?: string;
  registered_address?: string;
  district?: string;
  district_id?: number;
  product_category_id: number | null;
  gst_number: string | null;
  udyam_registration: string | null;
  website: string | null;
  proprietor_director_name?: string | null;
  pan_number?: string | null;
  bulk_order?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    mobile_no: string;
    role_id: number;
  };
  districtMaster: {
    id: number;
    districtName: string;
    state_id: number;
    status: number;
  } | null;
  productCategory: {
    id: number;
    name?: string;
  } | null;
}

export type SupplierProfilePayload =
  | SupplierProfile
  | {
      success?: boolean;
      message?: string;
      data?: SupplierProfile;
    };

export type UpdateSupplierProfileDto = Partial<{
  enterprise_name: string;
  registered_address: string;
  product_category_id: number | null;
  gst_number: string | null;
  udyam_registration: string | null;
  website: string | null;
  proprietor_director_name: string | null;
  pan_number: string | null;
  bulk_order: string | null;
  district_id: number | null;
}>;

function withSupplierAuth(options?: RequestOptions): RequestOptions {
  if (typeof window === "undefined") {
    return options ?? {};
  }

  const token = localStorage.getItem("auth_token");

  return {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && !options?.headers?.Authorization
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  };
}

export type UpdateSupplierProductDto = Partial<CreateSupplierProductDto>;

export interface QuerySupplierProductDto {
  search?: string;
  category_id?: number;
  status?: string;
  approval_status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export function buildSupplierProductFormData(
  dto: CreateSupplierProductDto | UpdateSupplierProductDto,
  files: SupplierProductFiles
): FormData {
  const fd = new FormData();
  const textDto: UpdateSupplierProductDto = { ...dto };
  if (files.thumbnail) {
    delete textDto.thumbnail_image;
  }
  appendDtoToFormData(fd, textDto);
  if (files.thumbnail) {
    fd.append("thumbnail_image", files.thumbnail);
  }
  for (const file of files.productImages ?? []) {
    fd.append("product_images", file);
  }
  return fd;
}

function hasBinaryUploads(files?: SupplierProductFiles): boolean {
  if (!files) return false;
  if (files.thumbnail) return true;
  return Boolean(files.productImages && files.productImages.length > 0);
}

function requestOptionsWithoutFiles(
  options?: RequestOptions & { files?: SupplierProductFiles }
): RequestOptions | undefined {
  if (!options) return undefined;
  const next: RequestOptions & { files?: SupplierProductFiles } = { ...options };
  delete next.files;
  return next;
}

export async function createProduct(
  data: CreateSupplierProductDto,
  options?: RequestOptions & { files?: SupplierProductFiles }
) {
  const dto = supplierProductDtoFromForm(data);
  const files = options?.files;
  const rest = requestOptionsWithoutFiles(options);
  if (hasBinaryUploads(files)) {
    const fd = buildSupplierProductFormData(dto, files ?? {});
    const res = await httpClient.post<unknown>(ENDPOINTS.supplierProducts.base, fd, rest);
    const product = unwrapSupplierProductResponse(res.data);
    return mapProductResponse(res, product);
  }
  const res = await httpClient.post<unknown>(ENDPOINTS.supplierProducts.base, dto, rest);
  const product = unwrapSupplierProductResponse(res.data);
  return mapProductResponse(res, product);
}

export async function getProducts(query?: QuerySupplierProductDto, options?: RequestOptions) {
  return httpClient.get<PaginatedResponse<SupplierProduct> | SupplierProduct[]>(ENDPOINTS.supplierProducts.base, {
    ...options,
    ...(query && { params: query as Record<string, string | number | boolean | null | undefined> }),
  });
}

function statNum(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return fallback;
}

function statStrOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? null : t;
  }
  return null;
}

/**
 * Parses dashboard stats from `httpClient` body (either `{ data: {...} }` or the inner object).
 */
export function parseSupplierDashboardStats(body: unknown): SupplierDashboardStats | null {
  let inner: unknown = body;
  if (typeof inner === "object" && inner !== null && "data" in inner) {
    inner = (inner as { data: unknown }).data;
  }
  if (inner === null || inner === undefined) return null;
  if (typeof inner !== "object") return null;
  const o = inner as Record<string, unknown>;
  const ps = o.profile_strength;
  let pct = 0;
  if (typeof ps === "object" && ps !== null && "percentage" in ps) {
    pct = statNum((ps as { percentage: unknown }).percentage, 0);
  }
  return {
    total: statNum(o.total),
    pending: statNum(o.pending),
    approved: statNum(o.approved),
    rejected: statNum(o.rejected),
    district_name: statStrOrNull(o.district_name),
    category_name: statStrOrNull(o.category_name),
    product_category_name: statStrOrNull(o.product_category_name),
    profile_strength: { percentage: Math.min(100, Math.max(0, pct)) },
  };
}

export async function getProductStats(options?: RequestOptions): Promise<ApiResponse<SupplierDashboardStats | null>> {
  const res = await httpClient.get<unknown>(ENDPOINTS.supplierProducts.stats, options);
  const stats = parseSupplierDashboardStats(res.data);
  return { ...res, data: stats };
}

export async function getProductById(id: number | string, options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.supplierProducts.adminDetail(id), options);
  const product = unwrapSupplierProductResponse(res.data);
  return mapProductResponse(res, product);
}

export async function updateProduct(
  id: number | string,
  data: UpdateSupplierProductDto,
  options?: RequestOptions & { files?: SupplierProductFiles }
) {
  const dto = supplierProductDtoFromForm(data as CreateSupplierProductDto);
  const files = options?.files;
  const rest = requestOptionsWithoutFiles(options);
  if (hasBinaryUploads(files)) {
    const fd = buildSupplierProductFormData(dto, files ?? {});
    const res = await httpClient.put<unknown>(ENDPOINTS.supplierProducts.adminDetail(id), fd, rest);
    const product = unwrapSupplierProductResponse(res.data);
    return mapProductResponse(res, product);
  }
  const res = await httpClient.put<unknown>(ENDPOINTS.supplierProducts.adminDetail(id), dto, rest);
  const product = unwrapSupplierProductResponse(res.data);
  return mapProductResponse(res, product);
}

export async function deleteProduct(id: number | string, options?: RequestOptions) {
  return httpClient.delete<unknown>(ENDPOINTS.supplierProducts.adminDetail(id), options);
}

export async function getProductCategories(options?: RequestOptions) {
  return httpClient.get<{ data: ProductCategory[] } | ProductCategory[]>(
    ENDPOINTS.public.categoriesDropdown,
    options
  );
}

export async function getcategories(options?: RequestOptions) {
  return httpClient.get<{ data: Category[] } | Category[]>(ENDPOINTS.public.categories, options);
}

export async function getSupplierProfile(options?: RequestOptions) {
  return httpClient.get<SupplierProfilePayload>(
    ENDPOINTS.supplierProducts.profile,
    withSupplierAuth(options)
  );
} 
export async function updateSupplierProfile(data: UpdateSupplierProfileDto | FormData, options?: RequestOptions) {
  return httpClient.put<SupplierProfilePayload>(
    ENDPOINTS.supplierProducts.profileUpdate,
    data,
    withSupplierAuth(options)
  );
} 
