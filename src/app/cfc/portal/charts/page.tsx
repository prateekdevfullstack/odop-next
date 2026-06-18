"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { monthLabel } from "@/lib/cfc/constants";
import { cfcPortalChartEditPath, cfcPortalChartNewPath } from "@/lib/cfc/routes";
import { deleteCfcPortalChart, listCfcPortalCharts } from "@/services/cfc-portal.service";
import type { CfcPortalChart } from "@/types/cfc-portal";

const PAGE_SIZE = 10;

export default function CfcPortalChartsPage() {
  const router = useRouter();
  const [charts, setCharts] = useState<CfcPortalChart[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCharts = async (pageNum: number) => {
    setLoading(true);
    try {
      const result = await listCfcPortalCharts({ page: pageNum, limit: PAGE_SIZE });
      setCharts(result.items);
      setLastPage(Math.max(1, result.meta.last_page));
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to load metrics.");
      setCharts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCharts(page);
  }, [page]);

  const handleDelete = async (chart: CfcPortalChart) => {
    if (!window.confirm(`Delete metrics for ${monthLabel(chart.month)} ${chart.year}?`)) return;
    setDeletingId(chart.id);
    try {
      await deleteCfcPortalChart(chart.id);
      toast.success("Metrics deleted.");
      await loadCharts(page);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to delete metrics.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>Monthly metrics</h1>
        <p>Track income, expenses, and capacity usage by month.</p>
      </header>

      <div className="cfc-portal-toolbar">
        <span />
        <Link href={cfcPortalChartNewPath()} className="btn btn-primary">
          Add metrics
        </Link>
      </div>

      <div className="cfc-portal-panel">
        {loading ? (
          <div className="cfc-portal-loading">Loading metrics…</div>
        ) : charts.length === 0 ? (
          <div className="cfc-portal-empty">No monthly metrics yet.</div>
        ) : (
          <div className="cfc-portal-table-wrap">
            <table className="cfc-portal-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Capacity %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {charts.map((chart) => (
                  <tr key={chart.id}>
                    <td>{chart.year}</td>
                    <td>{monthLabel(chart.month)}</td>
                    <td>{chart.income_month_year_wise ?? "—"}</td>
                    <td>{chart.expenses_month_year_wise ?? "—"}</td>
                    <td>{chart.capacity_usage_month_year_wise ?? "—"}</td>
                    <td>
                      <div className="cfc-portal-table-actions">
                        <button
                          type="button"
                          className="cfc-portal-icon-btn"
                          title="Edit"
                          aria-label={`Edit ${monthLabel(chart.month)} ${chart.year}`}
                          onClick={() => router.push(cfcPortalChartEditPath(chart.id))}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="cfc-portal-icon-btn cfc-portal-icon-btn--danger"
                          title="Delete"
                          aria-label={`Delete ${monthLabel(chart.month)} ${chart.year}`}
                          disabled={deletingId === chart.id}
                          onClick={() => void handleDelete(chart)}
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
