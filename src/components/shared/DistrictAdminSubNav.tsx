"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FaPalette, FaTruck } from "react-icons/fa";
import {
  districtAdminArtisansPath,
  districtAdminSuppliersPath,
} from "@/lib/district-admin/routes";

export default function DistrictAdminSubNav() {
  const pathname = usePathname();
  const params = useParams();
  const districtSlug = String(params.district ?? "");
  const base = `/${districtSlug}/district`;

  const navLinks = [
    {
      name: "Suppliers",
      href: districtAdminSuppliersPath(districtSlug),
      icon: <FaTruck />,
      match: (p: string) => p.startsWith(`${base}/suppliers`),
    },
    {
      name: "Artisans",
      href: districtAdminArtisansPath(districtSlug),
      icon: <FaPalette />,
      match: (p: string) => p.startsWith(`${base}/artisans`),
    },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white !mb-4">
      <div className="container">
        <div className="flex flex-wrap items-center gap-4 !py-4">
          {navLinks.map((link) => {
            const isActive = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                  isActive
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={isActive ? "text-[var(--primary)]" : "text-gray-400"}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
