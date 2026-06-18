/** Map API validation errors (string or string[] per field) to a single message per field. */
export function apiFieldErrorsToMap(
  errors?: Record<string, string | string[]>
): Record<string, string> {
  if (!errors) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value) && value[0]) {
      out[key] = value.length > 1 ? value.join("; ") : value[0];
    } else if (typeof value === "string" && value) {
      out[key] = value;
    }
  }
  return out;
}
