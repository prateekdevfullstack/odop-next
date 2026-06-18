"use client";

import type { TicketStatus } from "@/types/grievance-ticket";
import { STATUS_BADGE_CLASS } from "@/lib/grievance-ticket";

type GrievanceStatusBadgeProps = {
  status: TicketStatus;
  className?: string;
};

export function GrievanceStatusBadge({ status, className = "" }: GrievanceStatusBadgeProps) {
  const badgeClass = STATUS_BADGE_CLASS[status] ?? "grievance-status-closed";
  return (
    <span className={`grievance-status-badge ${badgeClass} ${className}`.trim()}>
      {status}
    </span>
  );
}
