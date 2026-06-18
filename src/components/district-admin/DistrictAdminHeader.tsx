"use client";

import { FaBars } from "react-icons/fa";
import type { DistrictAdminUser } from "@/types/district-admin";

type DistrictAdminHeaderProps = {
  districtName: string;
  user: DistrictAdminUser | null;
  onToggleSidebar: () => void;
};

export default function DistrictAdminHeader({
  districtName,
  user,
  onToggleSidebar,
}: DistrictAdminHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <div>
          <strong style={{ display: "block", color: "var(--text)" }}>District Administrator</strong>
          <span className="micro-copy">{districtName} District</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="profile-menu-toggle">
          <div className="avatar-icon">
            <i className="fas fa-user-shield" aria-hidden />
          </div>
          <div className="profile-info">
            <strong>{user?.name ?? "Administrator"}</strong>
            <span className="micro-copy">{user?.email ?? ""}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
