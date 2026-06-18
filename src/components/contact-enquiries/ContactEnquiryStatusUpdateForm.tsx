"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ALL_TICKET_STATUSES } from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { updateDistrictContactEnquiryStatus } from "@/services/district-admin-contact-enquiry.service";
import type {
  ContactEnquiry,
  ContactEnquiryStatus,
} from "@/types/contact-enquiry";

type ContactEnquiryStatusUpdateFormProps = {
  enquiry: ContactEnquiry;
  onSuccess: (enquiry: ContactEnquiry) => void;
  embedded?: boolean;
};

const CONFIRM_STATUSES: ContactEnquiryStatus[] = ["Rejected", "Closed"];

export function ContactEnquiryStatusUpdateForm({
  enquiry,
  onSuccess,
  embedded = false,
}: ContactEnquiryStatusUpdateFormProps) {
  const [status, setStatus] = useState<ContactEnquiryStatus>(enquiry.status);
  const [adminRemark, setAdminRemark] = useState(enquiry.admin_remark ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (status === "Rejected" && !adminRemark.trim()) {
      setFieldErrors({ admin_remark: "A remark is required when rejecting an enquiry." });
      return;
    }

    if (CONFIRM_STATUSES.includes(status) && status !== enquiry.status) {
      const label = status === "Rejected" ? "reject" : "close";
      const confirmed = window.confirm(
        `Are you sure you want to ${label} enquiry ${enquiry.ticket_number}?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const result = await updateDistrictContactEnquiryStatus(enquiry.id, {
        status,
        admin_remark: adminRemark.trim() || undefined,
      });
      if (!result.data) {
        toast.error("Failed to update enquiry status.");
        return;
      }
      toast.success("Enquiry status updated.");
      onSuccess(result.data);
      setStatus(result.data.status);
      setAdminRemark(result.data.admin_remark ?? "");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const mapped: Record<string, string> = {};
          for (const [key, messages] of Object.entries(err.errors)) {
            mapped[key] = messages.join(" ");
          }
          setFieldErrors(mapped);
        }
        toast.error(err.message);
      } else {
        toast.error("Failed to update enquiry status.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className={
        embedded
          ? "da-grievance-status-form ticket-conversation-status-form"
          : "da-grievance-status-form panel"
      }
      onSubmit={(e) => void handleSubmit(e)}
    >
      {embedded ? (
        <h3 className="ticket-conversation-footer-title">Update status</h3>
      ) : (
        <h2>Update status</h2>
      )}
      <div className="grievance-form-grid">
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-status">Status</label>
          <select
            id="contact-enquiry-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContactEnquiryStatus)}
          >
            {ALL_TICKET_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="grievance-form-field full-span">
          <label htmlFor="contact-enquiry-admin-remark">
            Admin remark
            {status === "Rejected" ? " (required)" : null}
            {status === "Resolved" || status === "Closed" ? " (recommended)" : null}
          </label>
          <textarea
            id="contact-enquiry-admin-remark"
            rows={4}
            maxLength={5000}
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            placeholder="Enter resolution notes, follow-up actions, or rejection grounds…"
          />
          {fieldErrors.admin_remark ? (
            <p className="grievance-field-error">{fieldErrors.admin_remark}</p>
          ) : null}
          {fieldErrors.status ? (
            <p className="grievance-field-error">{fieldErrors.status}</p>
          ) : null}
        </div>
      </div>
      <div className="grievance-form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Updating…" : "Update status"}
        </button>
      </div>
    </form>
  );
}
