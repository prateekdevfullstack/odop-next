import { API_CONFIG } from "@/lib/api/config";

export function resolveCfcUploadUrl(path?: string | null): string {
  if (!path?.trim()) return "";
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}
