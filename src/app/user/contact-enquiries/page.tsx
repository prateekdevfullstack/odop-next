"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { formatTicketDate } from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { listUserContactEnquiries } from "@/services/user-contact-enquiry.service";
import type { ContactEnquiry } from "@/types/contact-enquiry";
import { useLanguage } from "@/components/providers/LanguageProvider";

const PAGE_SIZE = 10;

export default function UserContactEnquiriesPage() {
  const router = useRouter();
  const isHi = useLanguage() === "hi";
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listUserContactEnquiries({ page, limit: PAGE_SIZE });
        if (cancelled) return;
        setEnquiries(result.items);
        setLastPage(Math.max(1, result.meta.last_page));
        setTotal(result.meta.total);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError
            ? e.message
            : isHi
              ? "आपकी संपर्क पूछताछ लोड करने में विफल।"
              : "Failed to load your contact enquiries.";
        setError(msg);
        setEnquiries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, reloadToken, isHi]);

  return (
    <div className="dashboard-content ticket-theme">
      <header className="page-title">
        <span className="eyebrow">{isHi ? "सहायता" : "Support"}</span>
        <h1>{isHi ? "मेरी संपर्क पूछताछ" : "My Contact Enquiries"}</h1>
        <p>
          {isHi
            ? "अपनी संपर्क पूछताछ देखें और उनके समाधान की स्थिति का अनुसरण करें।"
            : "View your contact enquiries and follow their resolution status."}
        </p>
      </header>

      {error ? (
        <div className="panel mb-5">
          <p className="grievance-field-error" style={{ marginBottom: 12 }}>
            {error}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setReloadToken((token) => token + 1)}
          >
            {isHi ? "पुनः प्रयास करें" : "Try again"}
          </button>
        </div>
      ) : null}

      <div className="grievance-list-wrap">
        {loading ? (
          <div className="grievance-list-loading">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />{" "}
            {isHi ? "पूछताछ लोड हो रही हैं…" : "Loading enquiries…"}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="grievance-list-empty panel">
            <p>{isHi ? "आपके पास अभी तक कोई संपर्क पूछताछ नहीं है।" : "You have no contact enquiries yet."}</p>
          </div>
        ) : (
          <>
            <div className="grievance-cards" role="list">
              {enquiries.map((enquiry) => (
                <button
                  key={enquiry.id}
                  type="button"
                  className="grievance-card panel"
                  role="listitem"
                  onClick={() => router.push(`/user/contact-enquiries/${enquiry.id}`)}
                >
                  <div className="grievance-card-top">
                    <strong>{enquiry.ticket_number}</strong>
                    <GrievanceStatusBadge status={enquiry.status} />
                  </div>
                  <dl className="grievance-card-meta">
                    <div>
                      <dt>{isHi ? "श्रेणी" : "Category"}</dt>
                      <dd>{enquiry.category_title ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{isHi ? "जिला" : "District"}</dt>
                      <dd>{enquiry.district_name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{isHi ? "निर्मित" : "Created"}</dt>
                      <dd>{formatTicketDate(enquiry.created_at)}</dd>
                    </div>
                  </dl>
                </button>
              ))}
            </div>

            <table className="grievance-table user-access-table">
              <thead>
                <tr>
                  <th>{isHi ? "टिकट #" : "Ticket #"}</th>
                  <th>{isHi ? "श्रेणी" : "Category"}</th>
                  <th>{isHi ? "जिला" : "District"}</th>
                  <th>{isHi ? "स्थिति" : "Status"}</th>
                  <th>{isHi ? "निर्मित" : "Created"}</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="grievance-table-row"
                    onClick={() => router.push(`/user/contact-enquiries/${enquiry.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/user/contact-enquiries/${enquiry.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <td>
                      <strong>{enquiry.ticket_number}</strong>
                    </td>
                    <td>{enquiry.category_title ?? "—"}</td>
                    <td>{enquiry.district_name ?? "—"}</td>
                    <td>
                      <GrievanceStatusBadge status={enquiry.status} />
                    </td>
                    <td>{formatTicketDate(enquiry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lastPage > 1 ? (
              <div className="grievance-pagination">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {isHi ? "पिछला" : "Previous"}
                </button>
                <span className="panel-meta">
                  {isHi
                    ? `पृष्ठ ${page} / ${lastPage} (${total} पूछताछ)`
                    : `Page ${page} of ${lastPage} (${total} enquiries)`}
                </span>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={page >= lastPage || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {isHi ? "अगला" : "Next"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
