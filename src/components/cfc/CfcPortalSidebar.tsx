"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  cfcPortalActivitiesPath,
  cfcPortalChartsPath,
  cfcPortalEventsPath,
  cfcPortalPath,
  cfcPortalProfilePath,
} from "@/lib/cfc/routes";

type CfcPortalSidebarProps = {
  cfcName?: string;
  districtName?: string;
  onLogout: () => void;
};

const NAV = [
  { href: cfcPortalPath(), label: "Dashboard" },
  { href: cfcPortalEventsPath(), label: "Events" },
  { href: cfcPortalActivitiesPath(), label: "Activities" },
  { href: cfcPortalChartsPath(), label: "Monthly Metrics" },
  { href: cfcPortalProfilePath(), label: "Profile" },
] as const;

export default function CfcPortalSidebar({ cfcName, districtName, onLogout }: CfcPortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="cfc-portal-sidebar">
      <div className="cfc-portal-sidebar__brand">
        <strong>CFC Portal</strong>
        {cfcName ? <span>{cfcName}</span> : null}
        {districtName ? <small>{districtName}</small> : null}
      </div>
      <nav className="cfc-portal-sidebar__nav" aria-label="CFC portal">
        {NAV.map((item) => {
          const active =
            item.href === cfcPortalPath()
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "is-active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button type="button" className="cfc-portal-sidebar__logout" onClick={onLogout}>
        Sign out
      </button>
    </aside>
  );
}
