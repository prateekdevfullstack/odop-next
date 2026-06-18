import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { notifyAuthChange } from "@/lib/auth-events";
import {
  clearDistrictSupervisorSession,
  persistDistrictSupervisorSession,
} from "@/lib/district-supervisor/session";
import { clearAllPortalSessions } from "@/lib/session-coordinator";
import type { DistrictAdminAuthResponse } from "@/types/district-admin";

export type DistrictSupervisorLoginInput = {
  email: string;
  password: string;
};

export async function districtSupervisorLogin(
  data: DistrictSupervisorLoginInput,
  options?: RequestOptions
) {
  return httpClient.post<DistrictAdminAuthResponse>(
    ENDPOINTS.auth.districtSupervisorLogin,
    data,
    { skipAuth: true, ...options }
  );
}

export function persistSupervisorLoginFromResponse(
  body: DistrictAdminAuthResponse
): boolean {
  if (!body?.success || !body.data?.token || !body.data?.user) {
    return false;
  }
  const user = body.data.user;
  clearAllPortalSessions();
  persistDistrictSupervisorSession({
    token: body.data.token,
    user,
    districtName: user.district_name,
  });
  notifyAuthChange();
  return true;
}

export function districtSupervisorLogout(): void {
  clearDistrictSupervisorSession();
  notifyAuthChange();
}
