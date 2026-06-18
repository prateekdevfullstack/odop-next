"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { GrievanceStatusUpdateForm } from "@/components/grievances/GrievanceStatusUpdateForm";
import { TicketConversation } from "@/components/grievances/TicketConversation";
import LoadingState from "@/components/district-admin/LoadingState";
import {
  formatTicketDate,
  resolveGrievanceAttachmentUrl,
} from "@/lib/grievance-ticket";
import {
  districtAdminUnifiedEnquiriesPath,
} from "@/lib/district-admin/routes";
import { ApiError } from "@/lib/api/types";
import { getDistrictGrievanceTicket } from "@/services/district-admin-grievance.service";
import type { GrievanceTicket } from "@/types/grievance-ticket";

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

export default function DistrictAdminGrievanceTicketDetailPage() {
  const params = useParams();
  const districtSlug = String(params.district ?? "");
  const id = params?.id as string | undefined;

  const [ticket, setTicket] = useState<GrievanceTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setForbidden(false);
    setNotFound(false);
    try {
      const result = await getDistrictGrievanceTicket(id);
      if (!result.data) {
        setNotFound(true);
        setError("Ticket not found.");
        setTicket(null);
        return;
      }
      setTicket(result.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setForbidden(true);
        setError("You don't have access to this ticket.");
      } else if (e instanceof ApiError && e.status === 404) {
        setNotFound(true);
        setError("Ticket not found.");
      } else {
        const msg =
          e instanceof ApiError ? e.message : "Failed to load ticket details.";
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
      <div className="da-grievance-page">
        <LoadingState label="Loading ticket details…" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="da-grievance-page">
        <div className="panel da-grievance-error-card">
          <h1>
            {forbidden ? "Access denied" : notFound ? "Ticket not found" : "Unable to load ticket"}
          </h1>
          <p className="grievance-field-error">{error ?? "Ticket not found."}</p>
          <Link href={districtAdminUnifiedEnquiriesPath(districtSlug)} className="btn btn-primary">
            Back to enquiries
          </Link>
        </div>
      </div>
    );
  }

  const attachmentUrl = resolveGrievanceAttachmentUrl(ticket.attachment_url);

  return (
    <div className="da-grievance-page da-grievance-detail-page">
      <header className="da-grievance-detail-header">
        <Link href={districtAdminUnifiedEnquiriesPath(districtSlug)} className="grievance-back-link">
          ← Back to enquiries
        </Link>
        <div className="grievance-detail-title-row">
          <h1>{ticket.ticket_number}</h1>
          <GrievanceStatusBadge status={ticket.status} />
        </div>
        <p className="panel-meta">
          Created {formatTicketDate(ticket.created_at)}
          {ticket.resolved_at ? ` · Resolved ${formatTicketDate(ticket.resolved_at)}` : null}
        </p>
      </header>

      <div className="da-grievance-detail-layout">
        <div className="da-grievance-detail-main">
          <section className="panel grievance-info-card">
            <h2>Complainant</h2>
            <dl className="grievance-info-grid">
              <div>
                <dt>Full name</dt>
                <dd>{displayOrDash(ticket.full_name)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{displayOrDash(ticket.email)}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{displayOrDash(ticket.mobile_number)}</dd>
              </div>
              <div>
                <dt>District</dt>
                <dd>{displayOrDash(ticket.district_name)}</dd>
              </div>
            </dl>
          </section>

          <TicketConversation
            initialMessage={ticket.description}
            createdAt={ticket.created_at}
            fullName={ticket.full_name}
            assignedAdminName={ticket.assigned_admin_name}
            activityLog={ticket.activity_log}
            footer={
              <GrievanceStatusUpdateForm
                embedded
                ticket={ticket}
                onSuccess={(updated) => setTicket(updated)}
              />
            }
          />
        </div>

        <aside className="da-grievance-detail-aside">
          <section className="panel grievance-info-card">
            <h2>Ticket context</h2>
            <dl className="grievance-info-grid">
              <div>
                <dt>Scheme</dt>
                <dd>{displayOrDash(ticket.scheme_name)}</dd>
              </div>
              <div>
                <dt>Scheme query</dt>
                <dd>{displayOrDash(ticket.query_title)}</dd>
              </div>
              <div>
                <dt>Assigned admin</dt>
                <dd>{displayOrDash(ticket.assigned_admin_name)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatTicketDate(ticket.updated_at)}</dd>
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
        </aside>
      </div>
    </div>
  );
}
