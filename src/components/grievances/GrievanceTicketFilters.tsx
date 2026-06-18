"use client";

import React from "react";
import DistrictAdminCollapsibleFilters, {
  countActiveFilterFields,
} from "@/components/district-admin/DistrictAdminCollapsibleFilters";
import { FILTER_TICKET_STATUSES } from "@/lib/grievance-ticket";
import type { LookupOption } from "@/services/district-admin-lookups.service";

export type GrievanceTicketFilterValues = {
  q: string;
  ticket_number: string;
  mobile_number: string;
  scheme_id: string;
  status: string;
  date_from: string;
  date_to: string;
};

type GrievanceTicketFiltersProps = {
  values: GrievanceTicketFilterValues;
  schemes: LookupOption[];
  showTicketNumber?: boolean;
  showSearch?: boolean;
  showMobile?: boolean;
  showStatus?: boolean;
  onChange: (patch: Partial<GrievanceTicketFilterValues>) => void;
  onApply: () => void;
  onClear: () => void;
};

export function GrievanceTicketFilters({
  values,
  schemes,
  showTicketNumber = true,
  showSearch = true,
  showMobile = true,
  showStatus = true,
  onChange,
  onApply,
  onClear,
}: GrievanceTicketFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const activeCount = countActiveFilterFields(values);

  return (
    <DistrictAdminCollapsibleFilters activeCount={activeCount}>
      <form onSubmit={handleSubmit}>
        <div className="da-grievance-filters-grid">
        {showSearch ? (
          <div className="grievance-form-field">
            <label htmlFor="grievance-q">Search</label>
            <input
              id="grievance-q"
              type="search"
              placeholder="Name, ticket number, or mobile"
              value={values.q}
              onChange={(e) => onChange({ q: e.target.value })}
            />
          </div>
        ) : null}
        {showTicketNumber ? (
          <div className="grievance-form-field">
            <label htmlFor="grievance-ticket-number">Ticket number</label>
            <input
              id="grievance-ticket-number"
              type="text"
              placeholder="Exact ticket number"
              value={values.ticket_number}
              onChange={(e) => onChange({ ticket_number: e.target.value })}
            />
          </div>
        ) : null}
        {showMobile ? (
          <div className="grievance-form-field">
            <label htmlFor="grievance-mobile">Mobile number</label>
            <input
              id="grievance-mobile"
              type="text"
              placeholder="Complainant mobile"
              value={values.mobile_number}
              onChange={(e) => onChange({ mobile_number: e.target.value })}
            />
          </div>
        ) : null}
        <div className="grievance-form-field">
          <label htmlFor="grievance-scheme">Scheme</label>
          <select
            id="grievance-scheme"
            value={values.scheme_id}
            onChange={(e) => onChange({ scheme_id: e.target.value })}
          >
            <option value="">All schemes</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {showStatus ? (
          <div className="grievance-form-field">
            <label htmlFor="grievance-status-filter">Status</label>
            <select
              id="grievance-status-filter"
              value={values.status}
              onChange={(e) => onChange({ status: e.target.value })}
            >
              <option value="">All statuses</option>
              {FILTER_TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="grievance-form-field">
          <label htmlFor="grievance-date-from">Date from</label>
          <input
            id="grievance-date-from"
            type="date"
            value={values.date_from}
            onChange={(e) => onChange({ date_from: e.target.value })}
          />
        </div>
        <div className="grievance-form-field">
          <label htmlFor="grievance-date-to">Date to</label>
          <input
            id="grievance-date-to"
            type="date"
            value={values.date_to}
            onChange={(e) => onChange({ date_to: e.target.value })}
          />
        </div>
      </div>
      <div className="grievance-form-actions">
        <button type="button" className="btn btn-outline" onClick={onClear}>
          Clear filters
        </button>
        <button type="submit" className="btn btn-primary">
          Apply filters
        </button>
      </div>
      </form>
    </DistrictAdminCollapsibleFilters>
  );
}

export const EMPTY_GRIEVANCE_FILTERS: GrievanceTicketFilterValues = {
  q: "",
  ticket_number: "",
  mobile_number: "",
  scheme_id: "",
  status: "",
  date_from: "",
  date_to: "",
};

export function filtersToQuery(values: GrievanceTicketFilterValues) {
  return {
    q: values.q.trim() || undefined,
    ticket_number: values.ticket_number.trim() || undefined,
    mobile_number: values.mobile_number.trim() || undefined,
    scheme_id: values.scheme_id || undefined,
    status: values.status || undefined,
    date_from: values.date_from || undefined,
    date_to: values.date_to || undefined,
  };
}
