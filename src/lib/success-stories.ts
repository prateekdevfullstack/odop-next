import { resolvePublicAssetUrl } from "@/lib/scheme-media";

const PLACEHOLDER = "/assets/img/placeholder.jpg";

/** Absolute URL for success-story profile images (matches KB SuccessStoryList). */
export function resolveSuccessStoryProfileImage(path?: string | null): string {
  if (!path?.trim()) return PLACEHOLDER;

  const image = path.trim();
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/assets/")
  ) {
    return image;
  }

  return resolvePublicAssetUrl(image);
}

export type PublicSuccessStory = {
  id: number;
  name: string;
  businessName: string;
  shortDescription?: string;
  fullStory?: string;
  profileImage: string;
  isFeatured?: boolean;
  city?: {
    id: number;
    districtName: string;
    state_id?: number;
    status?: number;
  };
  state?: {
    id: number;
    name: string;
    code?: string;
    status?: number;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function mapCity(value: unknown): PublicSuccessStory["city"] | undefined {
  const city = asRecord(value);
  if (!city || city.districtName == null) return undefined;
  return {
    id: Number(city.id),
    districtName: String(city.districtName),
    state_id: city.state_id != null ? Number(city.state_id) : undefined,
    status: city.status != null ? Number(city.status) : undefined,
  };
}

function mapState(value: unknown): PublicSuccessStory["state"] | undefined {
  const state = asRecord(value);
  if (!state || state.name == null) return undefined;
  return {
    id: Number(state.id),
    name: String(state.name),
    code: state.code != null ? String(state.code) : undefined,
    status: state.status != null ? Number(state.status) : undefined,
  };
}

export function mapPublicSuccessStory(item: unknown): PublicSuccessStory | null {
  const row = asRecord(item);
  if (!row || row.id == null || !row.name) return null;
  if (row.isDeleted === true) return null;

  const profileRaw = row.profileImage;
  const profileImage =
    typeof profileRaw === "string"
      ? resolveSuccessStoryProfileImage(profileRaw)
      : PLACEHOLDER;

  return {
    id: Number(row.id),
    name: String(row.name),
    businessName: String(row.businessName ?? ""),
    shortDescription:
      typeof row.shortDescription === "string" ? row.shortDescription : undefined,
    fullStory: typeof row.fullStory === "string" ? row.fullStory : undefined,
    profileImage,
    isFeatured: Boolean(row.isFeatured),
    city: mapCity(row.city),
    state: mapState(row.state),
  };
}

export function sortPublicSuccessStories(stories: PublicSuccessStory[]): PublicSuccessStory[] {
  return [...stories].sort((a, b) => {
    const featuredDiff = Number(b.isFeatured) - Number(a.isFeatured);
    if (featuredDiff !== 0) return featuredDiff;
    return a.name.localeCompare(b.name);
  });
}
