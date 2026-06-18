"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { addUserGrievanceComment } from "@/services/user-grievance.service";

const MAX_REMARKS_LENGTH = 5000;

type GrievanceCommentFormProps = {
  ticketId: number;
  disabled?: boolean;
  onSuccess: () => void;
};

export function GrievanceCommentForm({
  ticketId,
  disabled = false,
  onSuccess,
}: GrievanceCommentFormProps) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = remarks.trim();
    if (!trimmed) {
      setError("Please enter your comment or additional information.");
      return;
    }
    if (trimmed.length > MAX_REMARKS_LENGTH) {
      setError(`Comment must be at most ${MAX_REMARKS_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await addUserGrievanceComment(ticketId, trimmed);
      toast.success("Your comment has been added.");
      setRemarks("");
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to add comment. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (disabled) {
    return (
      <div className="grievance-comment-readonly panel">
        <p>
          This ticket is closed for further comments.
        </p>
      </div>
    );
  }

  return (
    <form className="grievance-comment-form panel" onSubmit={(e) => void handleSubmit(e)}>
      <h3>Add comment / additional info</h3>
      <p className="panel-meta">
        Share any extra details that may help resolve your ticket.
      </p>
      <div className="grievance-form-field full-span">
        <label htmlFor="grievance-comment">Your message</label>
        <textarea
          id="grievance-comment"
          rows={4}
          maxLength={MAX_REMARKS_LENGTH}
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter additional information (max 5000 characters)"
          disabled={submitting}
        />
        <span className="grievance-char-count">
          {remarks.length}/{MAX_REMARKS_LENGTH}
        </span>
      </div>
      {error ? <p className="grievance-field-error">{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit comment"}
      </button>
    </form>
  );
}
