"use client";

import { useState } from "react";
import type { CfcActivityFormData } from "@/types/cfc-activity";

type CfcActivityFormProps = {
  initial?: Partial<CfcActivityFormData>;
  onSubmit: (values: CfcActivityFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  fieldErrors?: Record<string, string>;
  isSubmitting?: boolean;
};

export default function CfcActivityForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save activity",
  fieldErrors = {},
  isSubmitting = false,
}: CfcActivityFormProps) {
  const [activityName, setActivityName] = useState(initial?.activity_name ?? "");
  const [activityDate, setActivityDate] = useState(initial?.activity_date ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      activity_name: activityName.trim(),
      activity_date: activityDate,
    });
  };

  return (
    <form className="cfc-portal-form" onSubmit={handleSubmit} noValidate>
      <div className="cfc-portal-field">
        <label htmlFor="cfc-activity-name">Activity name</label>
        <input
          id="cfc-activity-name"
          type="text"
          maxLength={255}
          placeholder="e.g. Artisan Training Session"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.activity_name ? (
          <p className="cfc-portal-field-error">{fieldErrors.activity_name}</p>
        ) : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-activity-date">Activity date</label>
        <input
          id="cfc-activity-date"
          type="date"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.activity_date ? (
          <p className="cfc-portal-field-error">{fieldErrors.activity_date}</p>
        ) : null}
      </div>

      <div className="cfc-portal-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
