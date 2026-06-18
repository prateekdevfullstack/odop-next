"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  cfcPortalActivitiesPath,
  cfcPortalChartsPath,
  cfcPortalEventsPath,
  cfcPortalProfilePath,
} from "@/lib/cfc/routes";
import { getCfcUser } from "@/lib/cfc/session";
import {
  listCfcPortalActivities,
  listCfcPortalCharts,
  listCfcPortalEvents,
} from "@/services/cfc-portal.service";

export default function CfcPortalDashboardPage() {
  const user = getCfcUser();
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [activityCount, setActivityCount] = useState<number | null>(null);
  const [chartCount, setChartCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [events, activities, charts] = await Promise.all([
          listCfcPortalEvents({ page: 1, limit: 1 }),
          listCfcPortalActivities({ page: 1, limit: 1 }),
          listCfcPortalCharts({ page: 1, limit: 1 }),
        ]);
        if (cancelled) return;
        setEventCount(events.meta.total);
        setActivityCount(activities.meta.total);
        setChartCount(charts.meta.total);
      } catch {
        if (!cancelled) {
          setEventCount(0);
          setActivityCount(0);
          setChartCount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="cfc-portal-page cfc-portal-dashboard">
      <header className="cfc-portal-page-head">
        <h1>CFC Dashboard</h1>
        <p>
          Welcome{user?.name ? `, ${user.name}` : ""}. Manage events, activities, and monthly metrics for{" "}
          <strong>{user?.cfc_name ?? "your CFC"}</strong>
          {user?.district_name ? ` (${user.district_name})` : ""}.
        </p>
      </header>

      <section className="cfc-portal-stats" aria-label="Overview">
        <div className="cfc-portal-stat-card">
          <strong>{eventCount ?? "—"}</strong>
          <span>Events</span>
        </div>
        <div className="cfc-portal-stat-card">
          <strong>{activityCount ?? "—"}</strong>
          <span>Activities</span>
        </div>
        <div className="cfc-portal-stat-card">
          <strong>{chartCount ?? "—"}</strong>
          <span>Monthly metrics</span>
        </div>
        <div className="cfc-portal-stat-card">
          <strong>{user?.district_name ?? "—"}</strong>
          <span>District</span>
        </div>
      </section>

      <section className="cfc-portal-panel cfc-portal-panel--actions">
        <h2 className="cfc-portal-panel__title">Quick actions</h2>
        <div className="cfc-portal-quick-actions">
          <Link href={cfcPortalEventsPath()} className="btn btn-primary">
            Manage events
          </Link>
          <Link href={cfcPortalActivitiesPath()} className="btn btn-outline">
            Manage activities
          </Link>
          <Link href={cfcPortalChartsPath()} className="btn btn-outline">
            Manage monthly metrics
          </Link>
          <Link href={cfcPortalProfilePath()} className="btn btn-outline">
            View profile
          </Link>
        </div>
      </section>
    </div>
  );
}
