"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LoadingState from "@/components/district-admin/LoadingState";
import {
  districtSupervisorDashboardPath,
  districtSupervisorDistrictPath,
  districtSupervisorLoginPath,
  districtSupervisorSupplierAccessLogsPath,
} from "@/lib/district-supervisor/routes";
import {
  clearDistrictSupervisorSession,
  getDistrictSupervisorToken,
  getDistrictSupervisorUser,
  isDistrictSupervisorRole,
} from "@/lib/district-supervisor/session";
import { FaBars, FaHistory, FaMapMarkedAlt, FaSignOutAlt, FaTachometerAlt, FaTimes } from "react-icons/fa";

function getSupervisorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function DistrictSupervisorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");

  const checkedSession = useRef(false);

  const sendToLogin = useCallback(() => {
    router.replace(districtSupervisorLoginPath());
    queueMicrotask(() => setIsLoading(false));
  }, [router]);

  const authorizeSupervisor = useCallback((name: string, email: string) => {
    queueMicrotask(() => {
      setSupervisorName(name);
      setSupervisorEmail(email);
      setIsAuthorized(true);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (checkedSession.current) return;
    checkedSession.current = true;

    const token = getDistrictSupervisorToken();
    const storedUser = getDistrictSupervisorUser();

    if (!token || !storedUser) {
      sendToLogin();
      return;
    }

    if (!isDistrictSupervisorRole(storedUser.role_name)) {
      clearDistrictSupervisorSession();
      sendToLogin();
      return;
    }

    authorizeSupervisor(storedUser.name ?? "", storedUser.email ?? "");
  }, [authorizeSupervisor, sendToLogin]);

  const handleLogout = () => {
    clearDistrictSupervisorSession();
    router.replace(districtSupervisorLoginPath());
  };

  const sidebarW = collapsed ? 72 : 252;

  return (
    <div
      className={`da-shell ds-shell${collapsed ? " da-collapsed" : ""} bg-bg-light`}
      style={{ display: "flex", minHeight: "100vh" }}
    >
      <aside
        className="sidebar"
        style={{
          width: sidebarW,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "linear-gradient(180deg, #8A231C 0%, #2B0301 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px 10px 0",
          transition: "width 0.28s ease",
          zIndex: 50,
          overflowX: "hidden",
        }}
      >
        <Link
          href={districtSupervisorDashboardPath()}
          className="sidebar-logo"
          style={{ display: "block", marginBottom: 30, padding: "0 10px" }}
        >
          <Image
            src="/assets/img/logo.png"
            alt="ODOP"
            width={140}
            height={50}
            style={{
              maxWidth: collapsed ? 40 : 140,
              transition: "max-width 0.28s ease",
              height: "auto",
            }}
          />
        </Link>

        <nav className="sidebar-nav" aria-label="District administrator supervisor">
          <Link
            href={districtSupervisorDashboardPath()}
            className={`nav-link${pathname === districtSupervisorDashboardPath() ? " active" : ""}`}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <span className="icon">
              <FaTachometerAlt />
            </span>
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link
            href={districtSupervisorDistrictPath()}
            className={`nav-link${pathname === districtSupervisorDistrictPath() ? " active" : ""}`}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <span className="icon">
              <FaMapMarkedAlt />
            </span>
            {!collapsed && <span>District</span>}
          </Link>

          <Link
            href={districtSupervisorSupplierAccessLogsPath()}
            className={`nav-link${pathname === districtSupervisorSupplierAccessLogsPath() ? " active" : ""}`}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <span className="icon">
              <FaHistory />
            </span>
            {!collapsed && <span>Supplier Access Logs</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="nav-link" onClick={handleLogout}>
            <span className="icon">
              <FaSignOutAlt />
            </span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

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
          </div>

          <div className="da-topbar-right">
            <div className="da-admin-info" aria-label="Signed in supervisor">
              <span className="da-admin-avatar" aria-hidden="true">
                {getSupervisorInitials(supervisorName || "Supervisor")}
              </span>
              <div className="da-admin-meta">
                <strong>{supervisorName || "Supervisor"}</strong>
                <span>{supervisorEmail || "District Administrator Supervisor"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="da-content">
          {isLoading ? (
            <LoadingState label="Verifying supervisor access..." />
          ) : isAuthorized ? (
            <Suspense fallback={<LoadingState label="Loading dashboard..." />}>
              {children}
            </Suspense>
          ) : null}
        </main>
      </div>
    </div>
  );
}
