import type { RequestOptions } from "@/lib/api";
import { getCfcToken } from "@/lib/cfc/session";

export { unwrapEntity, unwrapList } from "@/services/district-admin-api";

export function withCfcAuth(options?: RequestOptions): RequestOptions {
  const token = getCfcToken();
  return {
    ...options,
    headers: {
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}
