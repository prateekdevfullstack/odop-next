"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaInbox, FaList } from "react-icons/fa";
import {
  districtAdminGrievanceReportsPath,
  districtAdminGrievanceTicketsPath,
  districtAdminGrievancesPath,
} from "@/lib/district-admin/routes";

type GrievanceAdminSubNavProps = {
  districtSlug: string;
};

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Overview",
    icon: <FaInbox />,
    href: (slug: string) => districtAdminGrievancesPath(slug),
    match: (path: string, base: string) =>
      path === base || path === `${base}/`,
  },
  {
    key: "tickets",
    label: "Tickets",
    icon: <FaList />,
    href: (slug: string) => districtAdminGrievanceTicketsPath(slug),
    match: (path: string, base: string) =>
      path.startsWith(`${base}/tickets`) && !path.includes("/reports"),
  },
  {
    key: "reports",
    label: "Reports",
    icon: <FaChartBar />,
    href: (slug: string) => districtAdminGrievanceReportsPath(slug),
    match: (path: string, base: string) => path.startsWith(`${base}/reports`),
  },
] as const;

export function GrievanceAdminSubNav({ districtSlug }: GrievanceAdminSubNavProps) {
  const pathname = usePathname();
  const base = districtAdminGrievancesPath(districtSlug);

  return (
    <nav className="da-grievance-subnav" aria-label="Enquiry sections">
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname, base);
        return (
          <Link
            key={item.key}
            href={item.href(districtSlug)}
            className={`da-grievance-subnav-link${active ? " active" : ""}`}
          >
            <span className="icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
