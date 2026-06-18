/** Convert URL slug (e.g. lucknow, kanpur-nagar) to display district name for API. */
export function districtNameFromSlug(slug: string): string {
  return slug
    .trim()
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function districtSlugFromName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
