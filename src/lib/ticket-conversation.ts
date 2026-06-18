import { sortActivityLog } from "@/lib/grievance-ticket";
import type { ActivityLogItem } from "@/types/grievance-ticket";

export type TicketConversationSender = "user" | "admin";

export type TicketConversationMessage = {
  id: string;
  sender: TicketConversationSender;
  senderLabel: string;
  text: string;
  createdAt: string;
};

export type BuildTicketConversationInput = {
  initialMessage: string | null | undefined;
  createdAt: string;
  fullName: string;
  assignedAdminName?: string | null;
  activityLog?: ActivityLogItem[];
};

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function namesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
}

/** Hide system / login actor labels from the conversation UI. */
export function shouldHideConversationActor(name: string | null | undefined): boolean {
  const normalized = normalizeName(name).toLowerCase();
  return normalized === "login" || normalized === "system";
}

function resolveSender(
  item: ActivityLogItem,
  fullName: string,
  assignedAdminName: string | null
): TicketConversationSender {
  const actor = normalizeName(item.created_by_name);

  if (!shouldHideConversationActor(actor)) {
    if (namesMatch(actor, fullName)) return "user";
    if (assignedAdminName && namesMatch(actor, assignedAdminName)) return "admin";
  }

  if (item.action_type === "status_change") return "admin";
  if (item.action_type === "created") return "user";
  if (item.created_by != null) return "admin";
  return "user";
}

function resolveSenderLabel(
  sender: TicketConversationSender,
  item: ActivityLogItem,
  fullName: string,
  assignedAdminName: string | null
): string {
  const actor = normalizeName(item.created_by_name);
  if (!shouldHideConversationActor(actor)) return actor;

  if (sender === "admin") {
    return assignedAdminName || "District admin";
  }
  return fullName || "Enquirer";
}

function activityToText(item: ActivityLogItem): string | null {
  const remarks = normalizeName(item.remarks);
  if (item.action_type === "comment") {
    return remarks || null;
  }
  if (item.action_type === "status_change") {
    if (remarks) return remarks;
    if (item.new_status) {
      const from = item.old_status ? ` from ${item.old_status}` : "";
      return `Status updated to ${item.new_status}${from}`;
    }
    return null;
  }
  if (item.action_type === "created") {
    return remarks || null;
  }
  return null;
}

function shouldIncludeActivity(item: ActivityLogItem): boolean {
  if (item.action_type === "assigned") return false;
  if (shouldHideConversationActor(item.created_by_name) && item.action_type !== "comment" && item.action_type !== "status_change") {
    return false;
  }
  return activityToText(item) != null;
}

export function buildTicketConversationMessages(
  input: BuildTicketConversationInput
): TicketConversationMessage[] {
  const fullName = normalizeName(input.fullName);
  const assignedAdminName = normalizeName(input.assignedAdminName);
  const messages: TicketConversationMessage[] = [];

  const initialText = normalizeName(input.initialMessage);
  if (initialText) {
    messages.push({
      id: "initial",
      sender: "user",
      senderLabel: fullName || "Enquirer",
      text: initialText,
      createdAt: input.createdAt,
    });
  }

  for (const item of sortActivityLog(input.activityLog ?? [])) {
    if (!shouldIncludeActivity(item)) continue;

    const text = activityToText(item);
    if (!text) continue;

    if (item.action_type === "created" && initialText && text === initialText) {
      continue;
    }

    const sender = resolveSender(item, fullName, assignedAdminName);
    messages.push({
      id: `activity-${item.id}`,
      sender,
      senderLabel:
        sender === "user"
          ? fullName || "Enquirer"
          : resolveSenderLabel(sender, item, fullName, assignedAdminName),
      text,
      createdAt: item.created_at,
    });
  }

  return messages;
}
