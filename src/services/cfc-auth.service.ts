import { ENDPOINTS, httpClient, type RequestOptions } from "@/lib/api";
import { notifyAuthChange } from "@/lib/auth-events";
import { clearCfcSession, persistCfcSession } from "@/lib/cfc/session";
import { clearAllPortalSessions } from "@/lib/session-coordinator";
import type { CfcLoginResponse, CfcProfileResponse, CfcUser } from "@/types/cfc-auth";
import { withCfcAuth } from "@/lib/cfc/api";
import { unwrapEntity } from "@/lib/cfc/api";

export type CfcLoginInput = {
  email: string;
  password: string;
};

function stripToken(user: CfcUser & { token?: string }): CfcUser {
  const { token: _token, ...rest } = user;
  return rest;
}

function parseCfcLoginPayload(payload: unknown): { user: CfcUser; token: string } | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const nested = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : root;
  const userRaw = nested.user;

  if (!userRaw || typeof userRaw !== "object") return null;

  const user = userRaw as CfcUser & { token?: string };
  const token = typeof user.token === "string" ? user.token : typeof nested.token === "string" ? nested.token : null;

  if (!token || !user.id || !user.email) return null;

  return {
    user: stripToken(user),
    token,
  };
}

export async function cfcLogin(data: CfcLoginInput, options?: RequestOptions) {
  return httpClient.post<CfcLoginResponse>(ENDPOINTS.cfc.login, data, {
    skipAuth: true,
    ...options,
  });
}

export async function cfcProfile(options?: RequestOptions) {
  return httpClient.get<CfcProfileResponse>(ENDPOINTS.cfc.profile, withCfcAuth(options));
}

export async function loadCfcProfile(): Promise<CfcUser | null> {
  try {
    const res = await cfcProfile();
    const user = unwrapEntity<CfcUser>(res.data) ?? (res.data as { user?: CfcUser })?.user ?? null;
    if (user) {
      const token = typeof window !== "undefined" ? localStorage.getItem("cfc_token") : null;
      if (token) persistCfcSession(user, token);
    }
    return user;
  } catch {
    return null;
  }
}

export function cfcLogout(): void {
  clearCfcSession();
  notifyAuthChange();
}

export function persistCfcLoginFromResponse(payload: unknown): boolean {
  const parsed = parseCfcLoginPayload(payload);
  if (!parsed) return false;
  clearAllPortalSessions();
  persistCfcSession(parsed.user, parsed.token);
  notifyAuthChange();
  return true;
}
