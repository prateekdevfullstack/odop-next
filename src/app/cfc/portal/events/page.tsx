"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { cfcPortalEventEditPath, cfcPortalEventNewPath } from "@/lib/cfc/routes";
import { resolveCfcUploadUrl } from "@/lib/cfc/media";
import { deleteCfcPortalEvent, listCfcPortalEvents } from "@/services/cfc-portal.service";
import type { CfcEvent } from "@/types/cfc-portal";

const PAGE_SIZE = 10;

export default function CfcPortalEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<CfcEvent[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEvents = async (pageNum: number, searchTerm: string) => {
    setLoading(true);
    try {
      const result = await listCfcPortalEvents({
        page: pageNum,
        limit: PAGE_SIZE,
        search: searchTerm,
      });
      setEvents(result.items);
      setLastPage(Math.max(1, result.meta.last_page));
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents(page, search);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    void loadEvents(1, search);
  };

  const handleDelete = async (event: CfcEvent) => {
    if (!window.confirm(`Delete event "${event.event_name}"?`)) return;
    setDeletingId(event.id);
    try {
      await deleteCfcPortalEvent(event.id);
      toast.success("Event deleted.");
      await loadEvents(page, search);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Events</h1>
        <p>Create and manage CFC events with image uploads.</p>
      </header>

      <div className="cfc-portal-toolbar">
        <form onSubmit={handleSearch} className="cfc-portal-search-form">
          <input
            type="search"
            placeholder="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">
            Search
          </button>
        </form>
        <Link href={cfcPortalEventNewPath()} className="btn btn-primary">
          Add event
        </Link>
      </div>

      <div className="cfc-portal-panel">
        {loading ? (
          <div className="cfc-portal-loading">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="cfc-portal-empty">No events yet. Create your first event.</div>
        ) : (
          <div className="cfc-portal-table-wrap">
            <table className="cfc-portal-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.event_name}</td>
                    <td>{event.event_date}</td>
                    <td>
                      <div className="cfc-portal-thumb-row">
                        {(event.images ?? []).length === 0 ? (
                          <span className="cfc-portal-thumb-empty">—</span>
                        ) : (
                          (event.images ?? []).slice(0, 3).map((img, index, arr) => {
                            const overflow = (event.images?.length ?? 0) - 3;
                            const showMore = index === arr.length - 1 && overflow > 0;
                            return (
                              <div key={img.id} className="cfc-portal-thumb">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={resolveCfcUploadUrl(img.image)} alt="" />
                                {showMore ? (
                                  <span className="cfc-portal-thumb-more" aria-hidden="true">
                                    +{overflow}
                                  </span>
                                ) : null}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="cfc-portal-table-actions">
                        <button
                          type="button"
                          className="cfc-portal-icon-btn"
                          title="Edit"
                          aria-label={`Edit ${event.event_name}`}
                          onClick={() => router.push(cfcPortalEventEditPath(event.id))}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="cfc-portal-icon-btn cfc-portal-icon-btn--danger"
                          title="Delete"
                          aria-label={`Delete ${event.event_name}`}
                          disabled={deletingId === event.id}
                          onClick={() => void handleDelete(event)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {lastPage > 1 ? (
        <div className="cfc-portal-toolbar" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {lastPage}
          </span>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page >= lastPage || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
