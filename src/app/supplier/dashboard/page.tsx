"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { getProductStats } from "@/services/supplier-product.service";
import type { SupplierDashboardStats } from "@/types/supplier-product";

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "—";
  const t = String(value).trim();
  return t === "" ? "—" : t;
}

function profileStrengthHint(percentage: number): string {
  if (percentage >= 80) return "Strong profile";
  if (percentage >= 50) return "Good progress";
  if (percentage > 0) return "Complete your details";
  return "Add profile information";
}

function profileStrengthClass(percentage: number): string {
  if (percentage >= 80) return "status-success";
  if (percentage >= 40) return "status-info";
  if (percentage > 0) return "status-warning";
  return "status-warning";
}

export default function SupplierDashboardPage() {
  const [stats, setStats] = useState<SupplierDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductStats();
      if (res.data == null) {
        setError("Dashboard data could not be read.");
        setStats(null);
        return;
      }
      setStats(res.data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load dashboard statistics.";
      setError(msg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pct = stats?.profile_strength?.percentage ?? 0;

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <span className="eyebrow">Supplier Operations Overview</span>
        <h1>Supplier Dashboard</h1>
        <p>Monitor your product submissions, approval status, and profile completeness.</p>
      </header>

      {error ? (
        <div className="panel mb-5" style={{ borderColor: "var(--line)" }}>
          <p className="panel-meta text-secondary" style={{ marginBottom: 12 }}>
            {error}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="panel kpi-card">
          <span className="panel-meta">Total products</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : stats?.total ?? 0}</strong>
          </div>
          <span className="kpi-change status-info">All submissions</span>
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Pending review</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : stats?.pending ?? 0}</strong>
          </div>
          <span className="kpi-change status-warning">Awaiting decision</span>
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Approved</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : stats?.approved ?? 0}</strong>
          </div>
          <span className="kpi-change status-success">Live in catalogue</span>
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Rejected</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : stats?.rejected ?? 0}</strong>
          </div>
          <span className="kpi-change">Not approved</span>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="panel kpi-card">
          <span className="panel-meta">District</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : displayOrDash(stats?.district_name ?? null)}</strong>
          </div>
     
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Category</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : displayOrDash(stats?.category_name ?? null)}</strong>
          </div>
          
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Product category</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : displayOrDash(stats?.product_category_name ?? null)}</strong>
          </div>
          
        </div>
        <div className="panel kpi-card">
          <span className="panel-meta">Profile strength</span>
          <div className="kpi-value">
            <strong>{loading ? "—" : `${pct}%`}</strong>
          </div>
          <span className={`kpi-change ${profileStrengthClass(pct)}`}>{loading ? "…" : profileStrengthHint(pct)}</span>
           <div style={{ marginTop: 14 }}>
            <div
              style={{
                height: 10,
                background: "#eee",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                className="bg-primary"
                style={{
                  width: loading ? "0%" : `${pct}%`,
                  height: "100%",
                  transition: "width 0.35s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
