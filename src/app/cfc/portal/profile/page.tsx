"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { getCfcUser } from "@/lib/cfc/session";
import { cfcProfile } from "@/services/cfc-auth.service";
import { unwrapEntity } from "@/lib/cfc/api";
import type { CfcUser } from "@/types/cfc-auth";

export default function CfcPortalProfilePage() {
  const stored = getCfcUser();
  const [profile, setProfile] = useState<CfcUser | null>(stored);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await cfcProfile();
        const user =
          unwrapEntity<CfcUser>(res.data) ??
          (res.data as { user?: CfcUser })?.user ??
          getCfcUser();
        if (!cancelled) setProfile(user);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : "Failed to load profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="cfc-portal-loading">Loading profile…</div>;
  if (error) {
    return (
      <div className="cfc-portal-panel">
        <p className="cfc-portal-field-error">{error}</p>
      </div>
    );
  }
  if (!profile) return <div className="cfc-portal-empty">No profile data available.</div>;

  return (
    <div className="cfc-portal-page">
      <header className="cfc-portal-page-head">
        <h1>Profile</h1>
        <p>Your CFC portal account details.</p>
      </header>
      <div className="cfc-portal-panel cfc-portal-panel--profile">
        <dl className="cfc-portal-profile-list">
          <div>
            <dt>Name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>CFC</dt>
            <dd>{profile.cfc_name}</dd>
          </div>
          <div>
            <dt>District</dt>
            <dd>{profile.district_name}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{profile.status === 1 ? "Active" : "Inactive"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
