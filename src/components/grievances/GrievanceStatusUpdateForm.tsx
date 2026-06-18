"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ALL_TICKET_STATUSES } from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { updateDistrictGrievanceStatus } from "@/services/district-admin-grievance.service";
import type { GrievanceTicket, TicketStatus } from "@/types/grievance-ticket";

type GrievanceStatusUpdateFormProps = {
  ticket: GrievanceTicket;
  onSuccess: (ticket: GrievanceTicket) => void;
  embedded?: boolean;
};

const CONFIRM_STATUSES: TicketStatus[] = ["Rejected", "Closed"];

export function GrievanceStatusUpdateForm({
  ticket,
  onSuccess,
  embedded = false,
}: GrievanceStatusUpdateFormProps) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [adminRemark, setAdminRemark] = useState(ticket.admin_remark ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (status === "Rejected" && !adminRemark.trim()) {
      setFieldErrors({ admin_remark: "A remark is required when rejecting a ticket." });
      return;
    }

    if (CONFIRM_STATUSES.includes(status) && status !== ticket.status) {
      const label = status === "Rejected" ? "reject" : "close";
      const confirmed = window.confirm(
        `Are you sure you want to ${label} ticket ${ticket.ticket_number}?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const result = await updateDistrictGrievanceStatus(ticket.id, {
        status,
        admin_remark: adminRemark.trim() || undefined,
      });
      if (!result.data) {
        toast.error("Failed to update ticket status.");
        return;
      }
      toast.success("Ticket status updated.");
      onSuccess(result.data);
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
        toast.error("Failed to update ticket status.");
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
          <label htmlFor="grievance-status">Status</label>
          <select
            id="grievance-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
          >
            {ALL_TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="grievance-form-field full-span">
          <label htmlFor="grievance-admin-remark">
            Admin remark
            {status === "Rejected" ? " (required)" : null}
            {status === "Resolved" || status === "Closed" ? " (recommended)" : null}
          </label>
          <textarea
            id="grievance-admin-remark"
            rows={4}
            maxLength={5000}
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            placeholder="Enter resolution notes, process actions, or rejection grounds…"
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
