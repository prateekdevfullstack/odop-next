import type { RequestOptions } from "@/lib/api";
import { getDistrictAdminToken } from "@/lib/district-admin/session";

export function withDistrictAdminAuth(options?: RequestOptions): RequestOptions {
  const token = getDistrictAdminToken();
  return {
    ...options,
    headers: {
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export function unwrapEntity<T>(body: unknown): T | null {
  if (body == null) return null;
  if (typeof body === "object" && body !== null && "id" in body) {
    return body as T;
  }
  if (typeof body === "object" && body !== null && "data" in body) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === "object" && "id" in inner) {
      return inner as T;
    }
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (nested && typeof nested === "object" && "id" in nested) {
        return nested as T;
      }
    }
  }
  return null;
}

export function unwrapList<T>(body: unknown): {
  items: T[];
  meta: {
    total: number;
    last_page: number;
    per_page: number;
    current_page: number;
  };
} {
  const emptyMeta = { total: 0, last_page: 1, per_page: 10, current_page: 1 };

  if (body == null) {
    return { items: [], meta: emptyMeta };
  }

  if (Array.isArray(body)) {
    return { items: body as T[], meta: { ...emptyMeta, total: body.length } };
  }

  if (typeof body === "object" && body !== null) {
    const obj = body as Record<string, unknown>;

    if (Array.isArray(obj.data)) {
      const meta = (obj.meta ?? obj.pagination) as Record<string, unknown> | undefined;
      return {
        items: obj.data as T[],
        meta: {
          total: Number(meta?.total ?? obj.data.length),
          last_page: Number(meta?.last_page ?? meta?.lastPage ?? meta?.totalPages ?? 1),
          per_page: Number(meta?.per_page ?? meta?.perPage ?? 10),
          current_page: Number(meta?.current_page ?? meta?.currentPage ?? 1),
        },
      };
    }

    if (obj.data && typeof obj.data === "object" && obj.data !== null) {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) {
        const meta = (inner.meta ?? inner.pagination) as Record<string, unknown> | undefined;
        return {
          items: inner.data as T[],
          meta: {
            total: Number(meta?.total ?? inner.data.length),
            last_page: Number(meta?.last_page ?? meta?.lastPage ?? meta?.totalPages ?? 1),
            per_page: Number(meta?.per_page ?? meta?.perPage ?? 10),
            current_page: Number(meta?.current_page ?? meta?.currentPage ?? 1),
          },
        };
      }
    }
  }

  return { items: [], meta: emptyMeta };
}
