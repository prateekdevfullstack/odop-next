"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaTruck,
  FaPalette,
  FaGlobe,
  FaSignOutAlt,
  FaChevronDown,
  FaBoxOpen,
  FaEnvelope,
  FaInbox,
} from "react-icons/fa";
import {
  parseEntityTypeFromPath,
  parseProductCategoryId,
} from "@/lib/district-admin/category-nav";
import {
  districtAdminArtisansPath,
  districtAdminDashboardPath,
  districtAdminUnifiedEnquiriesPath,
  districtAdminSuppliersPath,
  districtAdminExportersPath,
} from "@/lib/district-admin/routes";
import {
  fetchProductCategoryOptions,
  type LookupOption,
} from "@/services/district-admin-lookups.service";

type DistrictAdminSidebarProps = {
  districtSlug: string;
  collapsed: boolean;
  onLogout: () => void;
};

const SIDEBAR_W = 252;
const SIDEBAR_COLLAPSED_W = 72;



const ENTITY_CHILDREN = [
  {
    key: "artisan" as const,
    name: "Artisan",
    icon: <FaPalette />,
    href: (slug: string, categoryId: number) =>
      districtAdminArtisansPath(slug, { productCategoryId: categoryId }),
    match: (pathname: string) => pathname.includes("/artisans"),
  },
  {
    key: "supplier" as const,
    name: "Manufacturer",
    icon: <FaTruck />,
    href: (slug: string, categoryId: number) =>
      districtAdminSuppliersPath(slug, { productCategoryId: categoryId }),
    match: (pathname: string) => pathname.includes("/suppliers"),
  },
  {
    key: "exporter" as const,
    name: "Exporter",
    icon: <FaGlobe />,
    href: (slug: string, categoryId: number) =>
      districtAdminExportersPath(slug, { productCategoryId: categoryId }),
    match: (pathname: string) => pathname.includes("/exporters"),
  },
];

export default function DistrictAdminSidebar({
  districtSlug,
  collapsed,
  onLogout,
}: DistrictAdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryId = parseProductCategoryId(searchParams);
  const activeEntityType = parseEntityTypeFromPath(pathname);

  const [categories, setCategories] = useState<LookupOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const isEnquiriesActive = pathname.includes("/enquiries") || pathname.includes("/contact-us");

  useEffect(() => {
    void (async () => {
      setLoadingCategories(true);
      try {
        const items = await fetchProductCategoryOptions();
        setCategories(items);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeCategoryId) return;
    const id = Number(activeCategoryId);
    if (!Number.isFinite(id) || id <= 0) return;
    setExpandedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [activeCategoryId]);



  const toggleCategory = useCallback((categoryId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const navLinkStyle = useMemo(
    () => ({
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 12,
      padding: "11px 15px",
      borderRadius: 10,
      textDecoration: "none" as const,
      color: "#ffffff",
      background: "rgb(144, 38, 30)",
      borderLeft: "3px solid rgb(248, 190, 1)",
      transition: "all 0.18s ease",
      whiteSpace: "nowrap" as const,
      overflow: "hidden" as const,
      fontWeight: 500,
      width: "100%",
    }),
    []
  );

  const iconStyle = {
    fontSize: "1.05rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "rgb(249, 192, 0)",
  };

  const w = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W;

  return (
    <aside
      className="sidebar"
      style={{
        width: w,
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
        href={districtAdminDashboardPath(districtSlug)}
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

      <nav
        className="sidebar-nav da-category-nav"
        aria-label="District administrator"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: 8,
        }}
      >
        <Link
          href={districtAdminUnifiedEnquiriesPath(districtSlug)}
          className={`da-category-toggle${isEnquiriesActive ? " active" : ""}`}
          title={collapsed ? "Enquiries" : undefined}
          style={{ textDecoration: "none" }}
        >
          <span className="icon" style={iconStyle}>
            <FaEnvelope />
          </span>
          {!collapsed && <span className="da-category-label">Enquiries</span>}
        </Link>
        {loadingCategories ? (
          !collapsed ? (
            <p className="da-sidebar-status">Loading categories…</p>
          ) : null
        ) : categories.length === 0 ? (
          !collapsed ? (
            <p className="da-sidebar-status">No product categories found.</p>
          ) : null
        ) : (
          categories.map((category) => {
            const isExpanded = expandedIds.has(category.id);
            const isCategoryActive = activeCategoryId === String(category.id);

            return (
              <div key={category.id} className="da-category-group">
                <button
                  type="button"
                  className={`da-category-toggle${isCategoryActive ? " active" : ""}${isExpanded ? " is-expanded" : ""}`}
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isExpanded}
                  title={collapsed ? category.name : undefined}
                >
                  <span className="icon" style={iconStyle}>
                    <FaBoxOpen />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="da-category-label">{category.name}</span>
                      <span
                        className={`da-category-chevron${isExpanded ? " is-open" : ""}`}
                        aria-hidden
                      >
                        <FaChevronDown />
                      </span>
                    </>
                  )}
                </button>

                {!collapsed ? (
                  <div
                    className={`da-category-children-wrap${isExpanded ? " is-expanded" : ""}`}
                  >
                    <div className="da-category-children-inner">
                      <div className="da-category-children">
                        {ENTITY_CHILDREN.map((child) => {
                          const href = child.href(districtSlug, category.id);
                          const active =
                            isCategoryActive &&
                            activeEntityType === child.key &&
                            child.match(pathname);

                          return (
                            <Link
                              key={child.key}
                              href={href}
                              className={`nav-link da-category-child${active ? " active" : ""}`}
                            >
                              <span className="icon">{child.icon}</span>
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}


      </nav>

      <div
        className="sidebar-footer"
        style={{
          padding: "16px 0",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <button
          type="button"
          className="nav-link"
          onClick={onLogout}
          style={{
            ...navLinkStyle,
            border: "none",
            cursor: "pointer",
          }}
        >
          <span className="icon" style={iconStyle}>
            <FaSignOutAlt />
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
