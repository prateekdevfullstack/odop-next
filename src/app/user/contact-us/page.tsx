"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { mapApiFieldErrors } from "@/lib/api-field-errors";
import { getStoredUser } from "@/services/auth.service";
import {
  fetchPublicDistricts,
  parsePublicDistrictListResponse,
} from "@/services/districts.service";
import {
  listEnquiryQueryCategories,
  submitContactEnquiry,
} from "@/services/user-contact-enquiry.service";
import type { EnquiryQueryCategoryOption } from "@/types/contact-enquiry";
import type { PublicDistrict } from "@/lib/api/districts.types";

const MAX_MESSAGE_LENGTH = 5000;

type FormState = {
  full_name: string;
  mobile_number: string;
  email: string;
  district_id: string;
  query_category_id: string;
  organization_name: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  full_name: "",
  mobile_number: "",
  email: "",
  district_id: "",
  query_category_id: "",
  organization_name: "",
  message: "",
};

export default function ContactUsPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [districts, setDistricts] = useState<PublicDistrict[]>([]);
  const [categories, setCategories] = useState<EnquiryQueryCategoryOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: user.name?.trim() || prev.full_name,
        email: user.email?.trim() || prev.email,
        mobile_number: user.mobile_no?.trim() || prev.mobile_number,
      }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoadingLookups(true);
      try {
        const [districtRes, categoryList] = await Promise.all([
          fetchPublicDistricts({ page: 1, limit: 200, sort_by: "district_name", sort_order: "asc" }),
          listEnquiryQueryCategories(),
        ]);
        if (cancelled) return;
        const parsed = parsePublicDistrictListResponse(districtRes.data);
        setDistricts(parsed.items);
        setCategories(categoryList);
      } catch {
        if (!cancelled) {
          setDistricts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoadingLookups(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedDistricts = useMemo(
    () =>
      [...districts].sort((a, b) =>
        a.districtName.localeCompare(b.districtName, undefined, { sensitivity: "base" })
      ),
    [districts]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (formError) setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const districtId = Number(form.district_id);
    const queryCategoryId = form.query_category_id
      ? Number(form.query_category_id)
      : undefined;

    setSubmitting(true);
    try {
      const result = await submitContactEnquiry({
        full_name: form.full_name.trim(),
        mobile_number: form.mobile_number.trim(),
        email: form.email.trim(),
        district_id: districtId,
        query_category_id: queryCategoryId,
        organization_name: form.organization_name.trim() || undefined,
        message: form.message.trim(),
      });

      if (!result.data) {
        setFormError("Enquiry submitted but no ticket details were returned.");
        return;
      }

      toast.success(
        `Enquiry submitted. Ticket ${result.data.ticket_number} (${result.data.status}).`
      );
      router.push(`/user/contact-enquiries/${result.data.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(mapApiFieldErrors(err.errors as Record<string, string[] | string>));
        }
        setFormError(err.message);
        toast.error(err.message);
      } else {
        const message = "Failed to submit enquiry. Please try again.";
        setFormError(message);
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <span className="eyebrow">Support</span>
        <h1>Contact Us</h1>
        <p>
          Submit an official enquiry to the ODOP team. Your request will be routed to the
          district administrator for your selected district.
        </p>
      </header>

      <div className="panel mb-5">
        <Link href="/user/contact-enquiries" className="btn btn-outline">
          View my enquiries
        </Link>
      </div>

      <form className="panel grievance-form-card" onSubmit={(e) => void handleSubmit(e)} noValidate>
        <h2 style={{ marginTop: 0 }}>Submit an enquiry</h2>

        {formError ? (
          <p className="grievance-field-error" style={{ marginBottom: 16 }}>
            {formError}
          </p>
        ) : null}

        <div className="grievance-form-grid">
          <div className="grievance-form-field">
            <label htmlFor="contact-full-name">
              Full name <span className="required">*</span>
            </label>
            <input
              id="contact-full-name"
              type="text"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              placeholder="Enter your full name"
              disabled={submitting}
              maxLength={255}
            />
            {fieldErrors.full_name ? (
              <p className="grievance-field-error">{fieldErrors.full_name}</p>
            ) : null}
          </div>

          <div className="grievance-form-field">
            <label htmlFor="contact-mobile">
              Mobile number <span className="required">*</span>
            </label>
            <input
              id="contact-mobile"
              type="tel"
              value={form.mobile_number}
              onChange={(e) => updateField("mobile_number", e.target.value)}
              placeholder="10-digit mobile number"
              disabled={submitting}
              maxLength={10}
            />
            {fieldErrors.mobile_number ? (
              <p className="grievance-field-error">{fieldErrors.mobile_number}</p>
            ) : null}
          </div>

          <div className="grievance-form-field">
            <label htmlFor="contact-email">
              Email <span className="required">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="name@example.com"
              disabled={submitting}
              maxLength={255}
            />
            {fieldErrors.email ? (
              <p className="grievance-field-error">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="grievance-form-field">
            <label htmlFor="contact-district">
              District <span className="required">*</span>
            </label>
            <select
              id="contact-district"
              value={form.district_id}
              onChange={(e) => updateField("district_id", e.target.value)}
              disabled={submitting || loadingLookups}
            >
              <option value="">
                {loadingLookups ? "Loading districts…" : "-- Select district --"}
              </option>
              {sortedDistricts.map((district) => (
                <option key={district.id} value={String(district.id)}>
                  {district.districtName}
                </option>
              ))}
            </select>
            {fieldErrors.district_id ? (
              <p className="grievance-field-error">{fieldErrors.district_id}</p>
            ) : null}
          </div>

          <div className="grievance-form-field">
            <label htmlFor="contact-category">Query type (optional)</label>
            <select
              id="contact-category"
              value={form.query_category_id}
              onChange={(e) => updateField("query_category_id", e.target.value)}
              disabled={submitting || loadingLookups}
            >
              <option value="">
                {loadingLookups ? "Loading categories…" : "-- Select query type --"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.category_title}
                </option>
              ))}
            </select>
            {fieldErrors.query_category_id ? (
              <p className="grievance-field-error">{fieldErrors.query_category_id}</p>
            ) : null}
          </div>

          <div className="grievance-form-field">
            <label htmlFor="contact-organization">Organization / business name</label>
            <input
              id="contact-organization"
              type="text"
              value={form.organization_name}
              onChange={(e) => updateField("organization_name", e.target.value)}
              placeholder="Optional"
              disabled={submitting}
              maxLength={255}
            />
            {fieldErrors.organization_name ? (
              <p className="grievance-field-error">{fieldErrors.organization_name}</p>
            ) : null}
          </div>

          <div className="grievance-form-field full-span">
            <label htmlFor="contact-message">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Describe your query or requirement in detail"
              disabled={submitting}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <span className="grievance-char-count">
              {form.message.length}/{MAX_MESSAGE_LENGTH}
            </span>
            {fieldErrors.message ? (
              <p className="grievance-field-error">{fieldErrors.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grievance-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting || loadingLookups}>
            {submitting ? "Submitting…" : "Submit enquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
