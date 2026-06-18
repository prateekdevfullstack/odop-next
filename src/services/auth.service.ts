import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { notifyAuthChange } from "@/lib/auth-events";
import { clearAllPortalSessions } from "@/lib/session-coordinator";

/** Same shape as supplier login and supplier register API responses. */
export type SupplierAuthPayload = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      mobile_no: string;
      role_id: number;
      role_name: string;
    };
    token: string;
  };
};


export function persistSupplierSession(payload: SupplierAuthPayload): boolean {
  if (typeof window === "undefined" || !payload?.success || !payload.data?.token) {
    return false;
  }
  clearAllPortalSessions();
  localStorage.setItem("auth_token", payload.data.token);
  localStorage.setItem("user", JSON.stringify(payload.data.user));
  notifyAuthChange();
  return true;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function isUserLoggedIn(): boolean {
  return Boolean(getAuthToken());
}

export type StoredUser = SupplierAuthPayload["data"]["user"];

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

/** Merge partial fields into the stored user and notify listeners (e.g. Navbar). */
export function updateStoredUser(partial: Partial<StoredUser>): StoredUser | null {
  if (typeof window === "undefined") return null;
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...partial };
  localStorage.setItem("user", JSON.stringify(next));
  notifyAuthChange();
  return next;
}

export function isPortalUser(): boolean {
  const user = getStoredUser();
  if (!user) return false;
  const role = user.role_name?.toLowerCase();
  return role === "user" || role === "buyer";
}

export async function login(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.login, data, { skipAuth: true, ...options });
}

export async function supplierLogin(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.supplierLogin, data, { skipAuth: true, ...options });
}

export async function supplierRegistration(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.supplierRegister, data, options);
}

export async function register(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.register, data, options);
}

export async function userLogin(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.userLogin, data, { skipAuth: true, ...options });
}

export async function userRegister(data: Record<string, unknown>, options?: RequestOptions) {
  return httpClient.post(ENDPOINTS.auth.userRegister, data, { skipAuth: true, ...options });
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    notifyAuthChange();
  }
}
