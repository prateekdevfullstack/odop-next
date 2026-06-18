"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ContactEnquiryStatusUpdateForm } from "@/components/contact-enquiries/ContactEnquiryStatusUpdateForm";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { TicketConversation } from "@/components/grievances/TicketConversation";
import LoadingState from "@/components/district-admin/LoadingState";
import { formatTicketDate } from "@/lib/grievance-ticket";
import { districtAdminUnifiedEnquiriesPath } from "@/lib/district-admin/routes";
import { ApiError } from "@/lib/api/types";
import { getDistrictContactEnquiry } from "@/services/district-admin-contact-enquiry.service";
import type { ContactEnquiry } from "@/types/contact-enquiry";

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

export default function DistrictAdminContactEnquiryDetailPage() {
  const params = useParams();
  const districtSlug = String(params.district ?? "");
  const id = params?.id as string | undefined;

  const [enquiry, setEnquiry] = useState<ContactEnquiry | null>(null);
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
      const result = await getDistrictContactEnquiry(id);
      if (!result.data) {
        setNotFound(true);
        setError("Enquiry not found.");
        setEnquiry(null);
        return;
      }
      setEnquiry(result.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setForbidden(true);
        setError("You don't have access to this enquiry.");
      } else if (e instanceof ApiError && e.status === 404) {
        setNotFound(true);
        setError("Enquiry not found.");
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
      <div className="da-grievance-page">
        <LoadingState label="Loading enquiry details…" />
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="da-grievance-page">
        <div className="panel da-grievance-error-card">
          <h1>
            {forbidden ? "Access denied" : notFound ? "Enquiry not found" : "Unable to load enquiry"}
          </h1>
          <p className="grievance-field-error">{error ?? "Enquiry not found."}</p>
          <Link href={districtAdminUnifiedEnquiriesPath(districtSlug)} className="btn btn-primary">
            Back to enquiries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="da-grievance-page da-grievance-detail-page">
      <header className="da-grievance-detail-header">
        <Link
          href={districtAdminUnifiedEnquiriesPath(districtSlug)}
          className="grievance-back-link"
        >
          ← Back to enquiries
        </Link>
        <div className="grievance-detail-title-row">
          <h1>{enquiry.ticket_number}</h1>
          <GrievanceStatusBadge status={enquiry.status} />
        </div>
        <p className="panel-meta">
          Created {formatTicketDate(enquiry.created_at)}
          {enquiry.resolved_at ? ` · Resolved ${formatTicketDate(enquiry.resolved_at)}` : null}
        </p>
      </header>

      <div className="da-grievance-detail-layout">
        <div className="da-grievance-detail-main">
          <section className="panel grievance-info-card">
            <h2>Enquirer details</h2>
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
            </dl>
          </section>

          <TicketConversation
            initialMessage={enquiry.message}
            createdAt={enquiry.created_at}
            fullName={enquiry.full_name}
            assignedAdminName={enquiry.assigned_admin_name}
            activityLog={enquiry.activity_log}
            footer={
              <ContactEnquiryStatusUpdateForm
                embedded
                enquiry={enquiry}
                onSuccess={(updated) => setEnquiry(updated)}
              />
            }
          />
        </div>

        <aside className="da-grievance-detail-aside">
          <section className="panel grievance-info-card">
            <h2>Ticket context</h2>
            <dl className="grievance-info-grid">
              <div>
                <dt>Organization</dt>
                <dd>{displayOrDash(enquiry.organization_name)}</dd>
              </div>
              <div>
                <dt>Query category</dt>
                <dd>{displayOrDash(enquiry.category_title)}</dd>
              </div>
              <div>
                <dt>Assigned admin</dt>
                <dd>{displayOrDash(enquiry.assigned_admin_name)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatTicketDate(enquiry.updated_at)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
