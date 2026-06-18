import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { notifyAuthChange } from "@/lib/auth-events";
import {
  persistDistrictAdminSession,
  clearDistrictAdminSession,
} from "@/lib/district-admin/session";
import { clearAllPortalSessions } from "@/lib/session-coordinator";
import type { DistrictAdminAuthResponse } from "@/types/district-admin";

export type DistrictAdminLoginInput = {
  email: string;
  password: string;
  district_name: string;
};

export async function districtAdminLogin(
  data: DistrictAdminLoginInput,
  options?: RequestOptions
) {
  return httpClient.post<DistrictAdminAuthResponse>(
    ENDPOINTS.auth.districtAdminLogin,
    data,
    { skipAuth: true, ...options }
  );
}

export function persistLoginFromResponse(
  body: DistrictAdminAuthResponse,
  districtName: string,
  districtSlug: string
): boolean {
  if (!body?.success || !body.data?.token || !body.data?.user) {
    return false;
  }
  clearAllPortalSessions();
  persistDistrictAdminSession({
    token: body.data.token,
    user: body.data.user,
    districtName,
    districtSlug,
  });
  notifyAuthChange();
  return true;
}

export function districtAdminLogout(): void {
  clearDistrictAdminSession();
  notifyAuthChange();
}
