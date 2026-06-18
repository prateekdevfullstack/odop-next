import { resolvePublicAssetUrl } from "@/lib/scheme-media";
import type {
  ActivityLogItem,
  TicketActionType,
  TicketStatus,
} from "@/types/grievance-ticket";

export const ALL_TICKET_STATUSES: TicketStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
];

/** Statuses shown in list/dashboard filters (excludes Rejected). */
export const FILTER_TICKET_STATUSES: TicketStatus[] = ALL_TICKET_STATUSES.filter(
  (status) => status !== "Rejected"
);

export const TERMINAL_TICKET_STATUSES: TicketStatus[] = [
  "Resolved",
  "Closed",
  "Rejected",
];

export const ATTENTION_TICKET_STATUSES: TicketStatus[] = ["Open", "In Progress"];

export const ACTION_TYPE_LABELS: Record<TicketActionType, string> = {
  created: "Ticket created",
  assigned: "Assigned to district admin",
  status_change: "Status updated",
  comment: "User comment",
};

export const STATUS_BADGE_CLASS: Record<TicketStatus, string> = {
  Open: "grievance-status-open",
  "In Progress": "grievance-status-progress",
  Resolved: "grievance-status-resolved",
  Closed: "grievance-status-closed",
  Rejected: "grievance-status-rejected",
};

export function isTerminalTicketStatus(status: TicketStatus): boolean {
  return TERMINAL_TICKET_STATUSES.includes(status);
}

export function formatTicketDate(
  value: string | null | undefined,
  includeTime: boolean = true
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return date.toLocaleString(undefined, options);
}

export function resolveGrievanceAttachmentUrl(
  path: string | null | undefined
): string | null {
  if (!path?.trim()) return null;
  return resolvePublicAssetUrl(path);
}

export function getActivityDescription(item: ActivityLogItem): string | null {
  if (item.action_type === "status_change" && item.new_status) {
    const from = item.old_status ? ` from ${item.old_status}` : "";
    return `Status changed to ${item.new_status}${from}`;
  }
  if (item.action_type === "assigned" && item.remarks) {
    return item.remarks;
  }
  return item.remarks;
}

export function sortActivityLog(items: ActivityLogItem[]): ActivityLogItem[] {
  return [...items].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}
