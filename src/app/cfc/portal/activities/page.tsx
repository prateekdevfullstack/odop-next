"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { formatCfcEventDate } from "@/lib/cfc/events";
import {
  cfcPortalActivityDetailPath,
  cfcPortalActivityEditPath,
  cfcPortalActivityNewPath,
} from "@/lib/cfc/routes";
import { deleteCfcPortalActivity, listCfcPortalActivities } from "@/services/cfc-portal.service";
import type { CfcActivity } from "@/types/cfc-activity";

const PAGE_SIZE = 10;

export default function CfcPortalActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<CfcActivity[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadActivities = async (pageNum: number, searchTerm: string) => {
    setLoading(true);
    try {
      const result = await listCfcPortalActivities({
        page: pageNum,
        limit: PAGE_SIZE,
        search: searchTerm,
      });
      setActivities(result.items);
      setLastPage(Math.max(1, result.meta.last_page));
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to load activities.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActivities(page, search);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    void loadActivities(1, search);
  };

  const handleDelete = async (activity: CfcActivity) => {
    if (!window.confirm(`Delete activity "${activity.activity_name}"?`)) return;
    setDeletingId(activity.id);
    try {
      await deleteCfcPortalActivity(activity.id);
      toast.success("Activity deleted.");
      await loadActivities(page, search);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to delete activity.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Activities</h1>
        <p>Record and manage CFC activities by name and date.</p>
      </header>

      <div className="cfc-portal-toolbar">
        <form onSubmit={handleSearch} className="cfc-portal-search-form">
          <input
            type="search"
            placeholder="Search activities"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">
            Search
          </button>
        </form>
        <Link href={cfcPortalActivityNewPath()} className="btn btn-primary">
          Add activity
        </Link>
      </div>

      <div className="cfc-portal-panel cfc-portal-panel--table">
        {loading ? (
          <div className="cfc-portal-loading">Loading activities…</div>
        ) : activities.length === 0 ? (
          <div className="cfc-portal-empty">No activities yet. Create your first activity.</div>
        ) : (
          <div className="cfc-portal-table-wrap">
            <table className="cfc-portal-table">
              <thead>
                <tr>
                  <th className="cfc-portal-table__col-primary">Activity</th>
                  <th className="cfc-portal-table__col-date">Date</th>
                  <th className="cfc-portal-table__col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="cfc-portal-table__col-primary">
                      <span className="cfc-portal-table__name">{activity.activity_name}</span>
                    </td>
                    <td className="cfc-portal-table__col-date">
                      <time className="cfc-portal-date-chip" dateTime={activity.activity_date}>
                        {formatCfcEventDate(activity.activity_date)}
                      </time>
                    </td>
                    <td className="cfc-portal-table__col-actions">
                      <div className="cfc-portal-table-actions">
                        <button
                          type="button"
                          className="cfc-portal-icon-btn"
                          title="View"
                          aria-label={`View ${activity.activity_name}`}
                          onClick={() => router.push(cfcPortalActivityDetailPath(activity.id))}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          className="cfc-portal-icon-btn"
                          title="Edit"
                          aria-label={`Edit ${activity.activity_name}`}
                          onClick={() => router.push(cfcPortalActivityEditPath(activity.id))}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="cfc-portal-icon-btn cfc-portal-icon-btn--danger"
                          title="Delete"
                          aria-label={`Delete ${activity.activity_name}`}
                          disabled={deletingId === activity.id}
                          onClick={() => void handleDelete(activity)}
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
        <div className="cfc-portal-pagination">
          <button
            type="button"
            className="btn btn-outline"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="cfc-portal-pagination__label">
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
