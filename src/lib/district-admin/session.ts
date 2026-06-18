import type { DistrictAdminUser } from "@/types/district-admin";

const TOKEN_KEY = "district_admin_token";
const USER_KEY = "district_admin_user";
const DISTRICT_KEY = "district_admin_district";
const DISTRICT_SLUG_KEY = "district_admin_district_slug";

export function getDistrictAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getDistrictAdminUser(): DistrictAdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DistrictAdminUser;
  } catch {
    return null;
  }
}

export function getStoredDistrictName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DISTRICT_KEY);
}

export function getStoredDistrictSlug(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DISTRICT_SLUG_KEY);
}

export function persistDistrictAdminSession(params: {
  token: string;
  user: DistrictAdminUser;
  districtName: string;
  districtSlug: string;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, params.token);
  localStorage.setItem(USER_KEY, JSON.stringify(params.user));
  localStorage.setItem(DISTRICT_KEY, params.districtName);
  localStorage.setItem(DISTRICT_SLUG_KEY, params.districtSlug);
}

export function clearDistrictAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(DISTRICT_KEY);
  localStorage.removeItem(DISTRICT_SLUG_KEY);
}

export function isDistrictAdminRole(roleName?: string | null): boolean {
  if (!roleName?.trim()) return false;
  const role = roleName.toLowerCase().replace(/[\s_-]+/g, "");
  if (
    role === "districtadministrator" ||
    role === "districtadmin" ||
    role === "districtadministratorrole"
  ) {
    return true;
  }
  return role.includes("district") && role.includes("admin");
}
