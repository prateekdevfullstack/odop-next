"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrievanceStatusBadge } from "@/components/grievances/GrievanceStatusBadge";
import { formatTicketDate } from "@/lib/grievance-ticket";
import { ApiError } from "@/lib/api/types";
import { listUserGrievanceTickets } from "@/services/user-grievance.service";
import type { GrievanceTicket } from "@/types/grievance-ticket";
import { useLanguage } from "@/components/providers/LanguageProvider";

const PAGE_SIZE = 10;

export default function UserGrievancesPage() {
  const router = useRouter();
  const isHi = useLanguage() === "hi";
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
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
        const result = await listUserGrievanceTickets({ page, limit: PAGE_SIZE });
        if (cancelled) return;
        setTickets(result.items);
        setLastPage(Math.max(1, result.meta.last_page));
        setTotal(result.meta.total);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError
            ? e.message
            : isHi
              ? "आपकी योजना संबंधी पूछताछ लोड करने में विफल।"
              : "Failed to load your scheme related enquiries.";
        setError(msg);
        setTickets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, reloadToken, isHi]);

  const handleRetry = () => {
    setReloadToken((token) => token + 1);
  };

  return (
    <div className="dashboard-content ticket-theme">
      <header className="page-title">
        <span className="eyebrow">{isHi ? "सहायता" : "Support"}</span>
        <h1>{isHi ? "मेरी योजना संबंधी पूछताछ" : "My Scheme Related Enquiries"}</h1>
        <p>
          {isHi
            ? "अपनी योजना संबंधी पूछताछ देखें और उनके समाधान की स्थिति का अनुसरण करें।"
            : "View your scheme related enquiries and follow their resolution status."}
        </p>
      </header>

      {error ? (
        <div className="panel mb-5">
          <p className="grievance-field-error" style={{ marginBottom: 12 }}>
            {error}
          </p>
          <button type="button" className="btn btn-primary" onClick={handleRetry}>
            {isHi ? "पुनः प्रयास करें" : "Try again"}
          </button>
        </div>
      ) : null}

      <div className="grievance-list-wrap">
        {loading ? (
          <div className="grievance-list-loading">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />{" "}
            {isHi ? "टिकट लोड हो रहे हैं…" : "Loading tickets…"}
          </div>
        ) : tickets.length === 0 ? (
          <div className="grievance-list-empty panel">
            <p>{isHi ? "आपके पास अभी तक कोई योजना संबंधी पूछताछ नहीं है।" : "You have no scheme related enquiries yet."}</p>
          </div>
        ) : (
          <>
            <div className="grievance-cards" role="list">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  className="grievance-card panel"
                  role="listitem"
                  onClick={() => router.push(`/user/grievances/${ticket.id}`)}
                >
                  <div className="grievance-card-top">
                    <strong>{ticket.ticket_number}</strong>
                    <GrievanceStatusBadge status={ticket.status} />
                  </div>
                  <dl className="grievance-card-meta">
                    <div>
                      <dt>{isHi ? "योजना" : "Scheme"}</dt>
                      <dd>{ticket.scheme_name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{isHi ? "प्रश्न" : "Query"}</dt>
                      <dd>{ticket.query_title ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{isHi ? "जिला" : "District"}</dt>
                      <dd>{ticket.district_name ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>{isHi ? "निर्मित" : "Created"}</dt>
                      <dd>{formatTicketDate(ticket.created_at)}</dd>
                    </div>
                  </dl>
                </button>
              ))}
            </div>

            <table className="grievance-table user-access-table">
              <thead>
                <tr>
                  <th>{isHi ? "टिकट #" : "Ticket #"}</th>
                  <th>{isHi ? "योजना" : "Scheme"}</th>
                  <th>{isHi ? "प्रश्न" : "Query"}</th>
                  <th>{isHi ? "जिला" : "District"}</th>
                  <th>{isHi ? "स्थिति" : "Status"}</th>
                  <th>{isHi ? "निर्मित" : "Created"}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="grievance-table-row"
                    onClick={() => router.push(`/user/grievances/${ticket.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/user/grievances/${ticket.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <td>
                      <strong>{ticket.ticket_number}</strong>
                    </td>
                    <td>{ticket.scheme_name ?? "—"}</td>
                    <td>{ticket.query_title ?? "—"}</td>
                    <td>{ticket.district_name ?? "—"}</td>
                    <td>
                      <GrievanceStatusBadge status={ticket.status} />
                    </td>
                    <td>{formatTicketDate(ticket.created_at)}</td>
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
                    ? `पृष्ठ ${page} / ${lastPage} (${total} टिकट)`
                    : `Page ${page} of ${lastPage} (${total} tickets)`}
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
