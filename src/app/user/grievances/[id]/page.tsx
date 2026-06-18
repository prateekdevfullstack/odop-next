"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { GrievanceCommentForm } from "@/components/grievances/GrievanceCommentForm";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { TicketConversation } from "@/components/grievances/TicketConversation";
import {
  formatTicketDate,
  isTerminalTicketStatus,
  resolveGrievanceAttachmentUrl,
} from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { getUserGrievanceTicket } from "@/services/user-grievance.service";
import type { GrievanceTicket } from "@/types/grievance-ticket";

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

export default function GrievanceTicketDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [ticket, setTicket] = useState<GrievanceTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const result = await getUserGrievanceTicket(id);
      if (!result.data) {
        setError("Ticket not found.");
        setTicket(null);
        return;
      }
      setTicket(result.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setForbidden(true);
        setError("You do not have permission to view this ticket.");
      } else {
        const msg =
          e instanceof ApiError
            ? e.message
            : "Failed to load ticket details.";
        setError(msg);
      }
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="dashboard-content ticket-theme">
        <div className="grievance-list-loading panel">
          <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading ticket…
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="dashboard-content ticket-theme">
        <div className="panel grievance-error-card">
          <h1>{forbidden ? "Access denied" : "Unable to load ticket"}</h1>
          <p className="grievance-field-error">{error ?? "Ticket not found."}</p>
          <Link href="/user/grievances" className="btn btn-primary">
            Back to my tickets
          </Link>
        </div>
      </div>
    );
  }

  const attachmentUrl = resolveGrievanceAttachmentUrl(ticket.attachment_url);
  const terminal = isTerminalTicketStatus(ticket.status);

  return (
    <div className="dashboard-content grievance-detail ticket-theme">
      <header className="grievance-detail-header">
        <div>
          <Link href="/user/grievances" className="grievance-back-link">
            ← Back to my tickets
          </Link>
          <div className="grievance-detail-title-row">
            <h1>{ticket.ticket_number}</h1>
            <GrievanceStatusBadge status={ticket.status} />
          </div>
          <p className="panel-meta">
            Created {formatTicketDate(ticket.created_at)}
            {ticket.resolved_at
              ? ` · Resolved ${formatTicketDate(ticket.resolved_at)}`
              : null}
          </p>
        </div>
      </header>

      <section className="panel grievance-info-card">
        <h2>Ticket information</h2>
        <dl className="grievance-info-grid">
          <div>
            <dt>Scheme</dt>
            <dd>{displayOrDash(ticket.scheme_name)}</dd>
          </div>
          <div>
            <dt>District</dt>
            <dd>{displayOrDash(ticket.district_name)}</dd>
          </div>
          <div>
            <dt>Scheme query</dt>
            <dd>{displayOrDash(ticket.query_title)}</dd>
          </div>
          <div>
            <dt>Assigned admin</dt>
            <dd>{displayOrDash(ticket.assigned_admin_name)}</dd>
          </div>
          {attachmentUrl ? (
            <div className="full-span">
              <dt>Attachment</dt>
              <dd>
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grievance-attachment-link"
                >
                  View supporting document
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <TicketConversation
        initialMessage={ticket.description}
        createdAt={ticket.created_at}
        fullName={ticket.full_name}
        assignedAdminName={ticket.assigned_admin_name}
        activityLog={ticket.activity_log}
      />

      <GrievanceCommentForm
        ticketId={ticket.id}
        disabled={terminal}
        onSuccess={() => void load()}
      />
    </div>
  );
}
