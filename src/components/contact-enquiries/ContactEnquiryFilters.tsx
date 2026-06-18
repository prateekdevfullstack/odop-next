"use client";

import React from "react";
import DistrictAdminCollapsibleFilters, {
  countActiveFilterFields,
} from "@/components/district-admin/DistrictAdminCollapsibleFilters";
import { FILTER_TICKET_STATUSES } from "@/lib/grievance-ticket";
import type { EnquiryQueryCategoryOption } from "@/types/contact-enquiry";

export type ContactEnquiryFilterValues = {
  q: string;
  mobile_number: string;
  query_category_id: string;
  status: string;
  date_from: string;
  date_to: string;
};

type ContactEnquiryFiltersProps = {
  values: ContactEnquiryFilterValues;
  categories: EnquiryQueryCategoryOption[];
  onChange: (patch: Partial<ContactEnquiryFilterValues>) => void;
  onApply: () => void;
  onClear: () => void;
};

export function ContactEnquiryFilters({
  values,
  categories,
  onChange,
  onApply,
  onClear,
}: ContactEnquiryFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const activeCount = countActiveFilterFields(values);

  return (
    <DistrictAdminCollapsibleFilters activeCount={activeCount}>
      <form onSubmit={handleSubmit}>
        <div className="da-grievance-filters-grid">
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-q">Search</label>
          <input
            id="contact-enquiry-q"
            type="search"
            placeholder="Name, ticket number, email, or mobile"
            value={values.q}
            onChange={(e) => onChange({ q: e.target.value })}
          />
        </div>
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-mobile">Mobile number</label>
          <input
            id="contact-enquiry-mobile"
            type="text"
            placeholder="Enquirer mobile"
            value={values.mobile_number}
            onChange={(e) => onChange({ mobile_number: e.target.value })}
          />
        </div>
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-category">Query category</label>
          <select
            id="contact-enquiry-category"
            value={values.query_category_id}
            onChange={(e) => onChange({ query_category_id: e.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_title}
              </option>
            ))}
          </select>
        </div>
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-status-filter">Status</label>
          <select
            id="contact-enquiry-status-filter"
            value={values.status}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            <option value="">All statuses</option>
            {FILTER_TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-date-from">Date from</label>
          <input
            id="contact-enquiry-date-from"
            type="date"
            value={values.date_from}
            onChange={(e) => onChange({ date_from: e.target.value })}
          />
        </div>
        <div className="grievance-form-field">
          <label htmlFor="contact-enquiry-date-to">Date to</label>
          <input
            id="contact-enquiry-date-to"
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

export const EMPTY_CONTACT_ENQUIRY_FILTERS: ContactEnquiryFilterValues = {
  q: "",
  mobile_number: "",
  query_category_id: "",
  status: "",
  date_from: "",
  date_to: "",
};

export function contactEnquiryFiltersToQuery(values: ContactEnquiryFilterValues) {
  return {
    q: values.q.trim() || undefined,
    mobile_number: values.mobile_number.trim() || undefined,
    query_category_id: values.query_category_id || undefined,
    status: values.status || undefined,
    date_from: values.date_from || undefined,
    date_to: values.date_to || undefined,
  };
}
