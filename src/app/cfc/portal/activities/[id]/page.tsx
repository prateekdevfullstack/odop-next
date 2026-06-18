"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { formatCfcEventDate } from "@/lib/cfc/events";
import { cfcPortalActivitiesPath, cfcPortalActivityEditPath } from "@/lib/cfc/routes";
import { getCfcPortalActivity } from "@/services/cfc-portal.service";
import type { CfcActivity } from "@/types/cfc-activity";

export default function CfcPortalActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");
  const [activity, setActivity] = useState<CfcActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const data = await getCfcPortalActivity(id);
        if (!cancelled) setActivity(data);
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof ApiError ? e.message : "Failed to load activity.");
          router.push(cfcPortalActivitiesPath());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) return <div className="cfc-portal-loading">Loading activity…</div>;
  if (!activity) return null;

  return (
    <div>
      <header className="cfc-portal-page-head">
        <h1>{activity.activity_name}</h1>
        <p>Activity details</p>
      </header>

      <div className="cfc-portal-panel cfc-portal-panel--profile">
        <dl className="cfc-portal-profile-list">
          <div className="cfc-portal-profile-item">
            <dt>Activity name</dt>
            <dd>{activity.activity_name}</dd>
          </div>
          <div className="cfc-portal-profile-item">
            <dt>Activity date</dt>
            <dd>{formatCfcEventDate(activity.activity_date)}</dd>
          </div>
          {activity.cfc?.name ? (
            <div className="cfc-portal-profile-item">
              <dt>CFC</dt>
              <dd>{activity.cfc.name}</dd>
            </div>
          ) : null}
          {activity.cfc?.City?.districtName ? (
            <div className="cfc-portal-profile-item">
              <dt>District</dt>
              <dd>{activity.cfc.City.districtName}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="cfc-portal-form-actions" style={{ marginTop: 16 }}>
        <Link href={cfcPortalActivitiesPath()} className="btn btn-outline">
          Back to list
        </Link>
        <Link href={cfcPortalActivityEditPath(activity.id)} className="btn btn-primary">
          Edit activity
        </Link>
      </div>
    </div>
  );
}
