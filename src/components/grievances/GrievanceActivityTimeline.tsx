"use client";

import {
  ACTION_TYPE_LABELS,
  formatTicketDate,
  getActivityDescription,
  sortActivityLog,
} from "@/lib/grievance-ticket";
import type { ActivityLogItem } from "@/types/grievance-ticket";

type GrievanceActivityTimelineProps = {
  items: ActivityLogItem[];
  loading?: boolean;
};

export function GrievanceActivityTimeline({
  items,
  loading = false,
}: GrievanceActivityTimelineProps) {
  if (loading) {
    return (
      <div className="grievance-timeline-loading">
        <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading activity…
      </div>
    );
  }

  const sorted = sortActivityLog(items);

  if (sorted.length === 0) {
    return (
      <p className="grievance-timeline-empty">No activity recorded yet.</p>
    );
  }

  return (
    <ol className="grievance-timeline" aria-label="Ticket activity">
      {sorted.map((item) => {
        const description = getActivityDescription(item);
        return (
          <li key={item.id} className="grievance-timeline-item">
            <div className="grievance-timeline-marker" aria-hidden="true" />
            <div className="grievance-timeline-body">
              <div className="grievance-timeline-head">
                <strong>{ACTION_TYPE_LABELS[item.action_type]}</strong>
                <time dateTime={item.created_at}>{formatTicketDate(item.created_at)}</time>
              </div>
              {item.created_by_name ? (
                <p className="grievance-timeline-meta">By {item.created_by_name}</p>
              ) : null}
              {description ? (
                <p className="grievance-timeline-remarks">{description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
