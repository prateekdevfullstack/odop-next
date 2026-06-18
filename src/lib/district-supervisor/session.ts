import type { DistrictAdminUser } from "@/types/district-admin";

const TOKEN_KEY = "district_supervisor_token";
const USER_KEY = "district_supervisor_user";
const DISTRICT_KEY = "district_supervisor_district";

export function getDistrictSupervisorToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getDistrictSupervisorUser(): DistrictAdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DistrictAdminUser;
  } catch {
    return null;
  }
}

export function getStoredSupervisorDistrictName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DISTRICT_KEY);
}

export function persistDistrictSupervisorSession(params: {
  token: string;
  user: DistrictAdminUser;
  districtName?: string | null;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, params.token);
  localStorage.setItem(USER_KEY, JSON.stringify(params.user));
  if (params.districtName) {
    localStorage.setItem(DISTRICT_KEY, params.districtName);
  } else {
    localStorage.removeItem(DISTRICT_KEY);
  }
}

export function clearDistrictSupervisorSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(DISTRICT_KEY);
}

export function isDistrictSupervisorRole(roleName?: string | null): boolean {
  if (!roleName?.trim()) return false;
  const role = roleName.toLowerCase().replace(/[\s_-]+/g, "");
  return (
    role === "districtadministratorsupervisor" ||
    role === "districtsupervisor" ||
    role.includes("supervisor")
  );
}
