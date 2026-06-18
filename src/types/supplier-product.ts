/** Mirrors backend ProductAvailability where applicable. */
export enum ProductAvailability {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  SEASONAL = 'Seasonal',
  MADE_TO_ORDER = "made_to_order",
}

/** Mirrors backend ProductStatus where applicable. */
export enum ProductStatus {
  DRAFT = "Draft",
  INACTIVE = "Inactive",
  ACTIVE = "Active",
}

export const PRODUCT_AVAILABILITY_LABELS: Record<ProductAvailability, string> = {
  [ProductAvailability.IN_STOCK]: "In stock",
  [ProductAvailability.OUT_OF_STOCK]: "Out of stock",
  [ProductAvailability.SEASONAL]: "Seasonal",
  [ProductAvailability.MADE_TO_ORDER]: "Made to order",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: "Draft",
  [ProductStatus.INACTIVE]: "Inactive",
  [ProductStatus.ACTIVE]: "Active",
};

/** Payload fields aligned with backend create DTO (JSON / multipart text parts). */
export interface CreateSupplierProductDto {
  user_id?: number;
  category_id: number;
  product_name: string;
  slug?: string;
  sku_code?: string;
  hsn_code?: string;
  description?: string;
  min_price?: number;
  max_price?: number;
  moq?: number;
  monthly_capacity?: string;
  lead_time?: string;
  availability?: ProductAvailability | string;
  video_url?: string;
  color_options?: string;
  export_ready?: boolean;
  search_tags?: string;
  status?: ProductStatus | string;
  /** Existing media URL(s) when not uploading new files (JSON or multipart string). */
  thumbnail_image?: string;
  product_images?: string[];
}

export type UpdateSupplierProductDto = Partial<CreateSupplierProductDto>;

export interface SupplierProduct extends CreateSupplierProductDto {
  id: number;
  approval_status: string;
  category?: {
    id: number;
    name: string;
  };
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  label: string;
  value: number;
}

export interface QuerySupplierProductDto {
  search?: string;
  category_id?: number;
  status?: string;
  approval_status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

/** GET `/api/supplier/supplier-products/dashboard/stats` — `data` payload. */
export interface SupplierDashboardProfileStrength {
  percentage: number;
}

export interface SupplierDashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  district_name: string | null;
  category_name: string | null;
  product_category_name: string | null;
  profile_strength: SupplierDashboardProfileStrength;
}

/** Map legacy or alternate API strings to ProductAvailability for forms. */
export function normalizeProductAvailability(
  raw?: string | null
): ProductAvailability | undefined {
  if (raw == null || raw === "") return undefined;
  if (Object.values(ProductAvailability).includes(raw as ProductAvailability)) {
    return raw as ProductAvailability;
  }
  const key = String(raw).trim().toLowerCase().replace(/\s+/g, "_");
  const legacy: Record<string, ProductAvailability> = {
    in_stock: ProductAvailability.IN_STOCK,
    "in-stock": ProductAvailability.IN_STOCK,
    out_of_stock: ProductAvailability.OUT_OF_STOCK,
    "out-of-stock": ProductAvailability.OUT_OF_STOCK,
    low_stock: ProductAvailability.SEASONAL,
    made_to_order: ProductAvailability.MADE_TO_ORDER,
    "made-to-order": ProductAvailability.MADE_TO_ORDER,
  };
  return legacy[key];
}

/** Map legacy or alternate API strings to ProductStatus for forms. */
export function normalizeProductStatus(raw?: string | null): ProductStatus | undefined {
  if (raw == null || raw === "") return undefined;
  if (Object.values(ProductStatus).includes(raw as ProductStatus)) {
    return raw as ProductStatus;
  }
  const key = String(raw).trim().toLowerCase();
  const legacy: Record<string, ProductStatus> = {
    draft: ProductStatus.DRAFT,
  };
  return legacy[key];
}
