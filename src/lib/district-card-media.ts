import { resolvePublicAssetUrl } from "@/lib/scheme-media";

export const DISTRICT_CARD_PLACEHOLDER = "/assets/img/placeholder.jpg";

export function resolveDistrictCardImage(path?: string | null): string {
  const value = path?.trim();
  if (!value) return DISTRICT_CARD_PLACEHOLDER;
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/assets/")
  ) {
    return value;
  }
  return resolvePublicAssetUrl(value);
}
