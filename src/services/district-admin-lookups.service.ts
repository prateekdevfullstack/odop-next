import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { withDistrictAdminAuth } from "./district-admin-api";
import { districtNameFromSlug } from "@/lib/district-admin/format";
import { getStoredDistrictName } from "@/lib/district-admin/session";

export type LookupOption = { id: number; name: string };

export function normalizeOptions(body: unknown): LookupOption[] {
  if (body == null) return [];
  let list: unknown[] = [];
  if (Array.isArray(body)) list = body;
  else if (typeof body === "object" && body !== null) {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data;
    else if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) list = inner.data;
    }
  }
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const id = Number(row.id ?? row.value);
      const name = String(row.name ?? row.title ?? row.label ?? "").trim();
      if (!Number.isFinite(id) || id <= 0 || !name) return null;
      return { id, name };
    })
    .filter((x): x is LookupOption => x !== null);
}

/** GET /api/public/product-categories/dropdown — items use `{ value, label }`. */
export async function fetchProductCategoryOptions(options?: RequestOptions) {
  let districtName: string | undefined = undefined;
  if (options?.params && typeof options.params.districtName === "string") {
    districtName = options.params.districtName;
  } else if (typeof window !== "undefined") {
    const stored = getStoredDistrictName();
    if (stored) {
      districtName = stored;
    } else {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts.length > 0) {
        districtName = districtNameFromSlug(parts[0]);
      }
    }
  }
  const res = await httpClient.get<unknown>(ENDPOINTS.public.categoriesDropdown, {
    ...options,
    params: {
      ...options?.params,
      ...(districtName ? { districtName } : {}),
    },
  });
  return normalizeOptions(res.data);
}

export async function fetchCraftSpecializationOptions(
  productCategoryId: string | number,
  options?: RequestOptions
): Promise<LookupOption[]> {
  const res = await httpClient.get<unknown>(ENDPOINTS.public.craftSpecialization, {
    ...options,
    params: { product_category_id: productCategoryId },
  });
  const body = res.data as Record<string, unknown> | null;
  if (!body) return [];
  let list: unknown[] = [];
  if (Array.isArray(body)) list = body;
  else if (Array.isArray(body.data)) list = body.data as unknown[];
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const id = Number(row.id ?? row.value);
      const name = String(
        row.name ?? row.specialization_name ?? row.title ?? row.label ?? ""
      ).trim();
      if (!Number.isFinite(id) || id <= 0 || !name) return null;
      return { id, name };
    })
    .filter((x): x is LookupOption => x !== null);
}

export async function fetchCategoryOptions(options?: RequestOptions) {
  const res = await httpClient.get<unknown>(ENDPOINTS.public.categories, {
    ...withDistrictAdminAuth(options),
    params: { page: 1, limit: 100 },
  });
  return normalizeOptions(res.data);
}
