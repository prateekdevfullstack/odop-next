"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DistrictAdminSidebar from "@/components/district-admin/DistrictAdminSidebar";
import LoadingState from "@/components/district-admin/LoadingState";
import { districtAdminLoginPath } from "@/lib/district-admin/routes";
import {
  getDistrictAdminToken,
  getDistrictAdminUser,
  getStoredDistrictSlug,
  isDistrictAdminRole,
  clearDistrictAdminSession,
} from "@/lib/district-admin/session";

import { FaBars, FaTimes } from "react-icons/fa";

function getAdminInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function DistrictAdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const districtSlug = String(params.district ?? "");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [adminName, setAdminName] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");

  const checkedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (checkedSlug.current === districtSlug) return;
    checkedSlug.current = districtSlug;

    const token = getDistrictAdminToken();
    const storedUser = getDistrictAdminUser();
    const storedSlug = getStoredDistrictSlug();

    if (!token || !storedUser) {
      router.replace(districtAdminLoginPath(districtSlug));
      setIsLoading(false);
      return;
    }

    if (storedSlug && storedSlug.toLowerCase() !== districtSlug.toLowerCase()) {
      clearDistrictAdminSession();
      router.replace(districtAdminLoginPath(districtSlug));
      setIsLoading(false);
      return;
    }

    if (!isDistrictAdminRole(storedUser.role_name)) {
      clearDistrictAdminSession();
      router.replace(districtAdminLoginPath(districtSlug));
      setIsLoading(false);
      return;
    }

    setAdminName(storedUser.name ?? "");
    setAdminEmail(storedUser.email ?? "");
    setIsAuthorized(true);
    setIsLoading(false);
  }, [districtSlug, router]);

  const handleLogout = () => {
    clearDistrictAdminSession();
    router.replace(districtAdminLoginPath(districtSlug));
  };

  const sidebarW = collapsed ? 72 : 252;

  return (
    <div
      className={`da-shell${collapsed ? " da-collapsed" : ""} bg-bg-light`}
      style={{ display: "flex", minHeight: "100vh" }}
    >
      <Suspense fallback={null}>
        <DistrictAdminSidebar
          districtSlug={districtSlug}
          collapsed={collapsed}
          onLogout={handleLogout}
        />
      </Suspense>

      <div
        className="da-main-col"
        style={{
          flex: 1,
          marginLeft: sidebarW,
          transition: "margin-left 0.28s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          height: "100vh",
        }}
      >
        <header className="da-topbar">
          <div className="da-topbar-left">
            <button
              type="button"
              className="da-toggle-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FaBars /> : <FaTimes />}
            </button>
            <div className="da-breadcrumb">
            </div>
          </div>

          <div className="da-topbar-right">
            <div className="da-admin-info" aria-label="Signed in administrator">
              <span className="da-admin-avatar" aria-hidden="true">
                {getAdminInitials(adminName || "Administrator")}
              </span>
              <div className="da-admin-meta">
                <strong>{adminName || "Administrator"}</strong>
                <span>{adminEmail || "District Administrator"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="da-content">
          {isLoading ? (
            <LoadingState label="Verifying district administrator access…" />
          ) : isAuthorized ? (
            <Suspense fallback={<LoadingState label="Loading page…" />}>{children}</Suspense>
          ) : null}
        </main>
      </div>
    </div>
  );
}
