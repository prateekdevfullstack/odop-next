import { clearCfcSession } from "@/lib/cfc/session";
import { clearDistrictAdminSession } from "@/lib/district-admin/session";
import { clearDistrictSupervisorSession } from "@/lib/district-supervisor/session";

/** Clears every portal session so only one user type can be active at a time. */
export function clearAllPortalSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  clearCfcSession();
  clearDistrictAdminSession();
  clearDistrictSupervisorSession();
}
