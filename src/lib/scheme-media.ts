import { API_CONFIG } from "@/lib/api";
import type { Scheme } from "@/lib/schemes";

/** Accepts a bare 11-char id or common YouTube URL shapes; returns the video id or null. */
export function toYoutubeVideoId(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return m?.[1] ?? null;
}

function firstUrl(...values: unknown[]): string | null {
  for (const v of values) {
    if (typeof v === "string") {
      const t = v.trim();
      if (t) return t;
    }
  }
  return null;
}

/** Prefix relative brochure paths with the public API host when needed. */
export function resolvePublicAssetUrl(url: string): string {
  const u = url.trim();
  if (!u) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");
  return `${base}/${u.replace(/^\//, "")}`;
}

export interface SchemeMediaUrls {
  brief: string | null;
  detailed: string | null;
  brochure: string | null;
}

/**
 * Reads optional media URLs from `heroJson` or loose API fields.
 * Backend can use e.g. heroJson: { brief_video_id, detailed_video_id, brochure_url }.
 */
export function extractSchemeMedia(
  scheme: Scheme & Record<string, unknown>
): SchemeMediaUrls {
  const root = scheme as Record<string, unknown>;
  const hero =
    scheme.heroJson && typeof scheme.heroJson === "object"
      ? (scheme.heroJson as Record<string, unknown>)
      : null;

  const brief =
    toYoutubeVideoId(hero?.brief_video_id) ??
    toYoutubeVideoId(hero?.briefVideoId) ??
    toYoutubeVideoId(hero?.brief_youtube_id) ??
    toYoutubeVideoId(hero?.briefYoutubeId) ??
    toYoutubeVideoId(root.brief_video_id) ??
    toYoutubeVideoId(root.briefVideoId);

  const detailed =
    toYoutubeVideoId(hero?.detailed_video_id) ??
    toYoutubeVideoId(hero?.detailedVideoId) ??
    toYoutubeVideoId(hero?.detailed_youtube_id) ??
    toYoutubeVideoId(hero?.detailedYoutubeId) ??
    toYoutubeVideoId(root.detailed_video_id) ??
    toYoutubeVideoId(root.detailedVideoId);

  const rawBrochure = firstUrl(
    hero?.brochure_url,
    hero?.brochureUrl,
    hero?.brochure_pdf,
    hero?.pdf_url,
    root.brochure_url,
    root.brochureUrl
  );

  const brochure = rawBrochure ? resolvePublicAssetUrl(rawBrochure) : null;

  return { brief, detailed, brochure };
}
