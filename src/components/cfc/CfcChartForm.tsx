"use client";

import { useState } from "react";
import { MONTH_OPTIONS } from "@/lib/cfc/constants";
import type { CfcChartFormValues } from "@/types/cfc-portal";

type CfcChartFormProps = {
  initial?: Partial<CfcChartFormValues>;
  onSubmit: (values: CfcChartFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  fieldErrors?: Record<string, string>;
  isSubmitting?: boolean;
};

export default function CfcChartForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Metrics",
  fieldErrors = {},
  isSubmitting = false,
}: CfcChartFormProps) {
  const [year, setYear] = useState(initial?.year ?? "");
  const [month, setMonth] = useState(initial?.month ?? "");
  const [income, setIncome] = useState(initial?.income_month_year_wise ?? "");
  const [expenses, setExpenses] = useState(initial?.expenses_month_year_wise ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity_usage_month_year_wise ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      year: year.trim(),
      month,
      income_month_year_wise: income,
      expenses_month_year_wise: expenses,
      capacity_usage_month_year_wise: capacity,
    });
  };

  return (
    <form className="cfc-portal-form" onSubmit={handleSubmit} noValidate>
      <div className="cfc-portal-field">
        <label htmlFor="cfc-chart-year">Financial year</label>
        <input
          id="cfc-chart-year"
          type="text"
          placeholder="e.g. 2025-26"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.year ? <p className="cfc-portal-field-error">{fieldErrors.year}</p> : null}
        {fieldErrors.year_month ? <p className="cfc-portal-field-error">{fieldErrors.year_month}</p> : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-chart-month">Month</label>
        <select
          id="cfc-chart-month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={isSubmitting}
          required
        >
          <option value="">Select month</option>
          {MONTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldErrors.month ? <p className="cfc-portal-field-error">{fieldErrors.month}</p> : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-chart-income">Income (monthly)</label>
        <input
          id="cfc-chart-income"
          type="number"
          min={0}
          step="any"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          disabled={isSubmitting}
        />
        {fieldErrors.income_month_year_wise ? (
          <p className="cfc-portal-field-error">{fieldErrors.income_month_year_wise}</p>
        ) : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-chart-expenses">Expenses (monthly)</label>
        <input
          id="cfc-chart-expenses"
          type="number"
          min={0}
          step="any"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          disabled={isSubmitting}
        />
        {fieldErrors.expenses_month_year_wise ? (
          <p className="cfc-portal-field-error">{fieldErrors.expenses_month_year_wise}</p>
        ) : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-chart-capacity">Capacity usage (%)</label>
        <input
          id="cfc-chart-capacity"
          type="number"
          min={0}
          max={100}
          step="any"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          disabled={isSubmitting}
        />
        {fieldErrors.capacity_usage_month_year_wise ? (
          <p className="cfc-portal-field-error">{fieldErrors.capacity_usage_month_year_wise}</p>
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
