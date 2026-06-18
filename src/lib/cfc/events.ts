import { resolveCfcUploadUrl } from "@/lib/cfc/media";
import type { CfcActivity } from "@/types/cfc-activity";
import type { CfcEvent } from "@/types/cfc-portal";

const CFC_EVENT_FALLBACK = "/assets/img/CFC.png";

export function sortCfcEventsDesc(events: CfcEvent[]): CfcEvent[] {
  return [...events].sort((a, b) => {
    const dateB = new Date(b.event_date).getTime();
    const dateA = new Date(a.event_date).getTime();
    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
  });
}

export function sortCfcActivitiesDesc(activities: CfcActivity[]): CfcActivity[] {
  return [...activities].sort((a, b) => {
    const dateB = new Date(b.activity_date).getTime();
    const dateA = new Date(a.activity_date).getTime();
    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
  });
}

export function getEventDescription(event: CfcEvent): string {
  const text = event.description?.trim() || event.event_description?.trim() || "";
  return text;
}

export function getEventCoverImage(event: CfcEvent): string {
  const path = event.images?.[0]?.image;
  const resolved = resolveCfcUploadUrl(path);
  return resolved || CFC_EVENT_FALLBACK;
}

export function formatCfcEventDate(date: string, isHi = false): string {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}
