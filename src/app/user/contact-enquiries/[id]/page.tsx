"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ContactEnquiryCommentForm } from "@/components/contact-enquiries/ContactEnquiryCommentForm";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { TicketConversation } from "@/components/grievances/TicketConversation";
import {
  formatTicketDate,
  isTerminalTicketStatus,
} from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { getUserContactEnquiry } from "@/services/user-contact-enquiry.service";
import type { ContactEnquiry } from "@/types/contact-enquiry";

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

export default function ContactEnquiryDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [enquiry, setEnquiry] = useState<ContactEnquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const result = await getUserContactEnquiry(id);
      if (!result.data) {
        setError("Enquiry not found.");
        setEnquiry(null);
        return;
      }
      setEnquiry(result.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setForbidden(true);
        setError("You do not have permission to view this enquiry.");
      } else {
        const msg =
          e instanceof ApiError ? e.message : "Failed to load enquiry details.";
        setError(msg);
      }
      setEnquiry(null);
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
          <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading enquiry…
        </div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="dashboard-content ticket-theme">
        <div className="panel grievance-error-card">
          <h1>{forbidden ? "Access denied" : "Unable to load enquiry"}</h1>
          <p className="grievance-field-error">{error ?? "Enquiry not found."}</p>
          <Link href="/user/contact-enquiries" className="btn btn-primary">
            Back to my enquiries
          </Link>
        </div>
      </div>
    );
  }

  const terminal = isTerminalTicketStatus(enquiry.status);

  return (
    <div className="dashboard-content grievance-detail ticket-theme">
      <header className="grievance-detail-header">
        <div>
          <Link href="/user/contact-enquiries" className="grievance-back-link">
            ← Back to my enquiries
          </Link>
          <div className="grievance-detail-title-row">
            <h1>{enquiry.ticket_number}</h1>
            <GrievanceStatusBadge status={enquiry.status} />
          </div>
          <p className="panel-meta">
            Created {formatTicketDate(enquiry.created_at)}
            {enquiry.resolved_at
              ? ` · Resolved ${formatTicketDate(enquiry.resolved_at)}`
              : null}
          </p>
        </div>
      </header>

      <section className="panel grievance-info-card">
        <h2>Enquiry information</h2>
        <dl className="grievance-info-grid">
          <div>
            <dt>Full name</dt>
            <dd>{displayOrDash(enquiry.full_name)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{displayOrDash(enquiry.email)}</dd>
          </div>
          <div>
            <dt>Mobile</dt>
            <dd>{displayOrDash(enquiry.mobile_number)}</dd>
          </div>
          <div>
            <dt>District</dt>
            <dd>{displayOrDash(enquiry.district_name)}</dd>
          </div>
          <div>
            <dt>Query type</dt>
            <dd>{displayOrDash(enquiry.category_title)}</dd>
          </div>
          <div>
            <dt>Organization</dt>
            <dd>{displayOrDash(enquiry.organization_name)}</dd>
          </div>
          <div>
            <dt>Assigned admin</dt>
            <dd>{displayOrDash(enquiry.assigned_admin_name)}</dd>
          </div>
        </dl>
      </section>

      <TicketConversation
        initialMessage={enquiry.message}
        createdAt={enquiry.created_at}
        fullName={enquiry.full_name}
        assignedAdminName={enquiry.assigned_admin_name}
        activityLog={enquiry.activity_log}
      />

      <ContactEnquiryCommentForm
        enquiryId={enquiry.id}
        disabled={terminal}
        onSuccess={() => void load()}
      />
    </div>
  );
}
