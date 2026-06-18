import type { CfcUser } from "@/types/cfc-auth";

const TOKEN_KEY = "cfc_token";
const USER_KEY = "cfc_user";

export function getCfcToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCfcUser(): CfcUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CfcUser;
  } catch {
    return null;
  }
}

export function isCfcUserLoggedIn(): boolean {
  return Boolean(getCfcToken());
}

export function persistCfcSession(user: CfcUser, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCfcSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
