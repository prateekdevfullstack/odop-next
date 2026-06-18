export function mapApiFieldErrors(
  errors?: Record<string, string[] | string>
): Record<string, string> {
  if (!errors) return {};
  const mapped: Record<string, string> = {};
  for (const [key, messages] of Object.entries(errors)) {
    mapped[key] = Array.isArray(messages) ? messages.join(" ") : String(messages);
  }
  return mapped;
}
