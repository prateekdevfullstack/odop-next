"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaInbox,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import DistrictAdminCollapsibleFilters from "@/components/district-admin/DistrictAdminCollapsibleFilters";
import LoadingState from "@/components/district-admin/LoadingState";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { formatTicketDate } from "@/lib/grievance-ticket";
import { districtNameFromSlug } from "@/lib/district-admin/format";
import {
  districtAdminGrievanceTicketDetailPath,
  districtAdminContactEnquiryDetailPath,
  districtAdminUnifiedEnquiriesPath,
} from "@/lib/district-admin/routes";
import { useUnifiedEnquiries } from "@/hooks/useUnifiedEnquiries";
import { fetchContactQueryCategoryOptions } from "@/services/district-admin-contact-enquiry.service";
import { fetchOdopSchemeOptions } from "@/services/schemes.service";
import { type LookupOption } from "@/services/district-admin-lookups.service";
import type { EnquiryQueryCategoryOption } from "@/types/contact-enquiry";
import type { UnifiedEnquiryListQuery, UnifiedEnquirySortField, GrievanceStatus } from "@/types/unified-enquiry";

const PAGE_SIZE = 10;

export default function DistrictAdminUnifiedEnquiriesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const districtName = useMemo(() => districtNameFromSlug(districtSlug), [districtSlug]);

  const page = Number(searchParams.get("page") ?? 1);
  const q = searchParams.get("q") ?? "";
  const sourceType = searchParams.get("source_type") ?? "";
  const status = searchParams.get("status") ?? "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";
  const schemeId = searchParams.get("scheme_id") ?? "";
  const queryCategoryId = searchParams.get("query_category_id") ?? "";
  const sortBy = (searchParams.get("sort_by") ?? "created_at") as UnifiedEnquirySortField;
  const sortOrder = (searchParams.get("sort_order") ?? "desc") as "asc" | "desc";

  const [draftQ, setDraftQ] = useState(q);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftDateFrom, setDraftDateFrom] = useState(dateFrom);
  const [draftDateTo, setDraftDateTo] = useState(dateTo);
  const [draftSchemeId, setDraftSchemeId] = useState(schemeId);
  const [draftQueryCategoryId, setDraftQueryCategoryId] = useState(queryCategoryId);
  const [goToPageInput, setGoToPageInput] = useState(String(page));

  const [schemes, setSchemes] = useState<LookupOption[]>([]);
  const [categories, setCategories] = useState<EnquiryQueryCategoryOption[]>([]);

  useEffect(() => {
    setDraftQ(q);
    setDraftStatus(status);
    setDraftDateFrom(dateFrom);
    setDraftDateTo(dateTo);
    setDraftSchemeId(schemeId);
    setDraftQueryCategoryId(queryCategoryId);
    setGoToPageInput(String(page));
  }, [
    q,
    status,
    dateFrom,
    dateTo,
    schemeId,
    queryCategoryId,
    page,
  ]);

  useEffect(() => {
    if (!districtName) return;
    let cancelled = false;
    void (async () => {
      try {
        const [schs, cats] = await Promise.all([
          fetchOdopSchemeOptions({ skipAuth: true }).catch(() => []),
          fetchContactQueryCategoryOptions().catch(() => []),
        ]);
        if (cancelled) return;
        setSchemes(schs);
        setCategories(cats);
      } catch {
        if (cancelled) return;
        toast.error("Failed to load filter options.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [districtName]);

  const activeFiltersQuery = useMemo(() => {
    const queryObj: UnifiedEnquiryListQuery = {};
    if (sourceType) {
      if (sourceType === "scheme_enquiry") {
        queryObj.source_type = "scheme_enquiry";
      } else if (sourceType === "contact_enquiry") {
        queryObj.source_type = "contact_enquiry";
      }
    }
    if (q) queryObj.q = q;
    if (status) queryObj.status = status as GrievanceStatus;
    if (dateFrom) queryObj.date_from = dateFrom;
    if (dateTo) queryObj.date_to = dateTo;

    if (sourceType !== "contact_enquiry") {
      if (schemeId) queryObj.scheme_id = Number(schemeId);
    }
    if (sourceType !== "scheme_enquiry" && sourceType !== "grievance") {
      if (queryCategoryId) queryObj.query_category_id = Number(queryCategoryId);
    }

    queryObj.sort_by = sortBy;
    queryObj.sort_order = sortOrder;
    queryObj.page = page;
    queryObj.limit = PAGE_SIZE;

    return queryObj;
  }, [
    sourceType,
    q,
    status,
    dateFrom,
    dateTo,
    schemeId,
    queryCategoryId,
    sortBy,
    sortOrder,
    page,
  ]);

  const { data: enquiries, loading, pagination } = useUnifiedEnquiries(activeFiltersQuery);

  const syncUrl = (patch: Record<string, string | number>) => {
    const qs = new URLSearchParams();
    const currentParams = {
      source_type: sourceType,
      q,
      status,
      date_from: dateFrom,
      date_to: dateTo,
      scheme_id: schemeId,
      query_category_id: queryCategoryId,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: String(page),
      ...patch,
    };

    for (const [key, val] of Object.entries(currentParams)) {
      if (val !== undefined && val !== null && val !== "" && val !== "1") {
        if (key === "page" && val === "1") continue;
        qs.set(key, String(val));
      }
    }

    const queryStr = qs.toString();
    const basePath = districtAdminUnifiedEnquiriesPath(districtSlug);
    router.replace(queryStr ? `${basePath}?${queryStr}` : basePath);
  };

  const handleSourceTabChange = (newSource: string) => {
    syncUrl({
      source_type: newSource,
      page: 1,
      scheme_id: newSource === "contact_enquiry" ? "" : schemeId,
      query_category_id: (newSource === "scheme_enquiry" || newSource === "grievance") ? "" : queryCategoryId,
    });
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    syncUrl({
      q: draftQ,
      status: draftStatus,
      date_from: draftDateFrom,
      date_to: draftDateTo,
      scheme_id: sourceType === "contact_enquiry" ? "" : draftSchemeId,
      query_category_id: (sourceType === "scheme_enquiry" || sourceType === "grievance") ? "" : draftQueryCategoryId,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setDraftQ("");
    setDraftStatus("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDraftSchemeId("");
    setDraftQueryCategoryId("");

    router.replace(
      sourceType
        ? `${districtAdminUnifiedEnquiriesPath(districtSlug)}?source_type=${sourceType}`
        : districtAdminUnifiedEnquiriesPath(districtSlug)
    );
  };

  const handleSort = (field: UnifiedEnquirySortField) => {
    const nextOrder = sortBy === field && sortOrder === "desc" ? "asc" : "desc";
    syncUrl({
      sort_by: field,
      sort_order: nextOrder,
      page: 1,
    });
  };

  const renderSortIcon = (field: UnifiedEnquirySortField) => {
    if (sortBy !== field) return <FaSort className="da-sort-icon" />;
    return sortOrder === "asc" ? <FaSortUp className="da-sort-icon active" /> : <FaSortDown className="da-sort-icon active" />;
  };

  const getPageItems = () => {
    const totalPages = pagination.totalPages;
    if (totalPages <= 0) return [];
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      if (start > 2) {
        items.push("...");
      }
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      if (end < totalPages - 1) {
        items.push("...");
      }
      items.push(totalPages);
    }
    return items;
  };

  const activeFiltersCount = [
    q,
    status,
    dateFrom,
    dateTo,
    sourceType !== "contact_enquiry" ? schemeId : "",
    (sourceType !== "scheme_enquiry" && sourceType !== "grievance") ? queryCategoryId : "",
  ].filter(Boolean).length;

  return (
    <div className="da-grievance-page da-enquiries-list-page">
      <header className="da-page-head">
        <div>
          <h1>Enquiries</h1>
        </div>
      </header>

      <div className="da-tabs-container" style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
        <button
          type="button"
          onClick={() => handleSourceTabChange("")}
          className={`btn ${sourceType === "" ? "btn-primary" : "btn-outline"}`}
          style={{ borderRadius: 20, padding: "6px 16px" }}
        >
          All Enquiries
        </button>
        <button
          type="button"
          onClick={() => handleSourceTabChange("scheme_enquiry")}
          className={`btn ${sourceType === "scheme_enquiry" ? "btn-primary" : "btn-outline"}`}
          style={{ borderRadius: 20, padding: "6px 16px" }}
        >
          Scheme Enquiries
        </button>
        <button
          type="button"
          onClick={() => handleSourceTabChange("contact_enquiry")}
          className={`btn ${sourceType === "contact_enquiry" ? "btn-primary" : "btn-outline"}`}
          style={{ borderRadius: 20, padding: "6px 16px" }}
        >
          Contact Enquiries
        </button>
      </div>

      <DistrictAdminCollapsibleFilters activeCount={activeFiltersCount}>
        <form onSubmit={handleApplyFilters}>
          <div className="da-grievance-filters-grid">
            <div className="grievance-form-field">
              <label htmlFor="filter-q">Search query</label>
              <input
                id="filter-q"
                type="search"
                placeholder="Search name, message, email..."
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
              />
            </div>

            <div className="grievance-form-field">
              <label htmlFor="filter-status">Status</label>
              <select
                id="filter-status"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="grievance-form-field">
              <label htmlFor="filter-date-from">Date from</label>
              <input
                id="filter-date-from"
                type="date"
                value={draftDateFrom}
                onChange={(e) => setDraftDateFrom(e.target.value)}
              />
            </div>

            <div className="grievance-form-field">
              <label htmlFor="filter-date-to">Date to</label>
              <input
                id="filter-date-to"
                type="date"
                value={draftDateTo}
                onChange={(e) => setDraftDateTo(e.target.value)}
              />
            </div>

            {sourceType !== "contact_enquiry" && (
              <div className="grievance-form-field">
                <label htmlFor="filter-scheme">Scheme</label>
                <select
                  id="filter-scheme"
                  value={draftSchemeId}
                  onChange={(e) => setDraftSchemeId(e.target.value)}
                >
                  <option value="">All schemes</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {sourceType !== "scheme_enquiry" && sourceType !== "grievance" && (
              <div className="grievance-form-field">
                <label htmlFor="filter-query-category">Query category</label>
                <select
                  id="filter-query-category"
                  value={draftQueryCategoryId}
                  onChange={(e) => setDraftQueryCategoryId(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grievance-form-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 15 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
            <button type="submit" className="btn btn-primary">
              Apply filters
            </button>
          </div>
        </form>
      </DistrictAdminCollapsibleFilters>

      <div className="panel da-list-panel" style={{ marginTop: 20 }}>
        {loading ? (
          <LoadingState label="Loading enquiries…" />
        ) : enquiries.length === 0 ? (
          <p className="da-empty-message">No enquiries match your filters.</p>
        ) : (
          <>
            <div className="da-table-scroll">
              <table className="data-table da-grievance-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("ticket_number")} style={{ cursor: "pointer" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                        Ticket ID {renderSortIcon("ticket_number")}
                      </span>
                    </th>
                    <th>Subject</th>
                    <th>Type</th>
                    <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                        Status {renderSortIcon("status")}
                      </span>
                    </th>
                    <th onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                        Created On {renderSortIcon("created_at")}
                      </span>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((item) => {
                    const isScheme = item.source_type === "scheme_enquiry";
                    const detailLink = isScheme
                      ? districtAdminGrievanceTicketDetailPath(districtSlug, item.id)
                      : districtAdminContactEnquiryDetailPath(districtSlug, item.id);

                    return (
                      <tr key={`${item.source_type}-${item.id}`}>
                        <td>
                          <strong>{item.ticket_number}</strong>
                        </td>
                        <td>{item.query_title || item.category_title || "—"}</td>
                        <td>
                          {isScheme ? (
                            <span className="grievance-status-badge grievance-status-progress">Scheme Enquiry</span>
                          ) : (
                            <span className="grievance-status-badge grievance-status-open">Contact Enquiry</span>
                          )}
                        </td>
                        <td>
                          <GrievanceStatusBadge status={item.status} />
                        </td>
                        <td>{formatTicketDate(item.created_at, false)}</td>
                        <td className="table-actions">
                          <Link href={detailLink} className="btn btn-outline">
                            View / Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="da-grievance-mobile-cards">
              {enquiries.map((item) => {
                const isScheme = item.source_type === "scheme_enquiry";
                const detailLink = isScheme
                  ? districtAdminGrievanceTicketDetailPath(districtSlug, item.id)
                  : districtAdminContactEnquiryDetailPath(districtSlug, item.id);

                return (
                  <Link
                    key={`${item.source_type}-${item.id}`}
                    href={detailLink}
                    className="da-grievance-mobile-card panel"
                  >
                    <div className="da-grievance-mobile-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <strong>{item.ticket_number}</strong>
                      <GrievanceStatusBadge status={item.status} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      {isScheme ? (
                        <span className="grievance-status-badge grievance-status-progress">Scheme Enquiry</span>
                      ) : (
                        <span className="grievance-status-badge grievance-status-open">Contact Enquiry</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{item.full_name}</p>
                    <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {isScheme ? (item.scheme_name || item.query_title) : item.category_title}
                    </p>
                    <p className="panel-meta" style={{ margin: 0 }}>{formatTicketDate(item.created_at, false)}</p>
                  </Link>
                );
              })}
            </div>

            {pagination.total > 0 && (
              <div className="da-list-pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, padding: "12px 24px" }}>
                <div className="panel-meta" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of {pagination.total} enquiries
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => syncUrl({ page: Math.max(1, page - 1) })}
                    disabled={page <= 1 || loading}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: page <= 1 ? "#cbd5e1" : "#0f172a",
                      cursor: page <= 1 ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (page > 1) e.currentTarget.style.color = "#475569";
                    }}
                    onMouseLeave={(e) => {
                      if (page > 1) e.currentTarget.style.color = "#0f172a";
                    }}
                  >
                    &lt; Previous
                  </button>

                  {getPageItems().map((item, idx) => {
                    if (item === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          style={{
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                          }}
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = item === page;
                    return (
                      <button
                        key={`page-${item}`}
                        type="button"
                        onClick={() => syncUrl({ page: Number(item) })}
                        disabled={loading}
                        style={{
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 8,
                          border: "none",
                          fontSize: "0.875rem",
                          fontWeight: isCurrent ? 600 : 500,
                          cursor: "pointer",
                          backgroundColor: isCurrent ? "#0f172a" : "transparent",
                          color: isCurrent ? "#ffffff" : "#0f172a",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => syncUrl({ page: Math.min(pagination.totalPages, page + 1) })}
                    disabled={page >= pagination.totalPages || loading}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: page >= pagination.totalPages ? "#cbd5e1" : "#0f172a",
                      cursor: page >= pagination.totalPages ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (page < pagination.totalPages) e.currentTarget.style.color = "#475569";
                    }}
                    onMouseLeave={(e) => {
                      if (page < pagination.totalPages) e.currentTarget.style.color = "#0f172a";
                    }}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
