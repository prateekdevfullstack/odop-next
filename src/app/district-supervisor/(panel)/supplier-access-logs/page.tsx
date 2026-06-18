"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { ENDPOINTS, httpClient } from "@/lib/api";
import { getDistrictSupervisorToken } from "@/lib/district-supervisor/session";
import { getSupervisorAccessedSuppliers } from "@/services/district-admin-supervisor.service";
import type { PhoneAccessLogEntry } from "@/types/user-access";
import {
  FaPhone,
  FaUser,
  FaBuilding,
  FaTag,
  FaClock,
  FaSyncAlt,
  FaEnvelope,
  FaMobileAlt,
  FaHistory,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";

function formatAccessDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayOrDash(value: string | null | undefined): string {
  if (value == null) return "\u2014";
  const trimmed = String(value).trim();
  return trimmed === "" ? "\u2014" : trimmed;
}

function getEnterpriseName(entry: PhoneAccessLogEntry): string {
  const profile = entry.supplier_profile?.profile;
  if (!profile) return "\u2014";
  if (entry.supplier_profile?.supplier_type === "artisan") {
    return displayOrDash(profile.enterprise_name);
  }
  return displayOrDash(profile.export_company_name) || displayOrDash(profile.office_address);
}

function getOwnerOrContact(entry: PhoneAccessLogEntry): string {
  const profile = entry.supplier_profile?.profile;
  if (!profile) return "\u2014";
  if (entry.supplier_profile?.supplier_type === "exporter") {
    return displayOrDash(profile.owner_director_name);
  }
  return displayOrDash(profile.contact_person);
}

interface DistrictOption {
  id: number;
  name: string;
}

export default function SupervisorSupplierAccessLogsPage() {
  const [logs, setLogs] = useState<PhoneAccessLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedDistricts = useRef(false);

  /* ── Load districts for the filter dropdown ── */
  const loadDistricts = useCallback(async () => {
    if (hasLoadedDistricts.current) return;
    setDistrictsLoading(true);
    try {
      const token = getDistrictSupervisorToken();
      const response = await httpClient.get<unknown>(
        ENDPOINTS.publicDistricts.list,
        {
          skipAuth: true,
          params: {
            page: 1,
            limit: 100,
            sort_by: "district_name",
            sort_order: "asc",
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = response.data as {
        data?: Array<{ id: number; districtName: string }>;
      };
      if (Array.isArray(data?.data)) {
        setDistrictOptions(
          data.data.map((d) => ({ id: d.id, name: d.districtName }))
        );
      }
      hasLoadedDistricts.current = true;
    } catch {
      setDistrictOptions([]);
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  /* ── Close district dropdown on outside click ── */
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDistrictDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  /* ── Load access logs ── */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSupervisorAccessedSuppliers({
        district_id: selectedDistrictId || undefined,
        page: currentPage,
      });
      setLogs(result.logs);
      setTotalCount(result.meta.total);
      setCurrentPage(result.meta.current_page);
      setLastPage(result.meta.last_page);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : "Failed to load supplier access logs.";
      setError(msg);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDistrictId, currentPage]);

  /* ── Initial loads ── */
  useEffect(() => {
    queueMicrotask(() => {
      void loadDistricts();
    });
  }, [loadDistricts]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  /* ── District name resolver for table display ── */
  const districtNames = useMemo(() => {
    const map: Record<number, string> = {};
    for (const d of districtOptions) {
      map[d.id] = d.name;
    }
    return map;
  }, [districtOptions]);

  const resolveDistrict = useCallback(
    (districtId: number | null) => {
      if (districtId == null) return "\u2014";
      return districtNames[districtId] ?? `District #${districtId}`;
    },
    [districtNames]
  );

  /* ── Unique users count ── */
  const userLogins = useMemo(() => {
    const unique = new Map<
      number,
      { name: string; email: string; mobile: string }
    >();
    for (const log of logs) {
      const user = log.accessedByUser;
      if (user && !unique.has(user.id)) {
        unique.set(user.id, {
          name: user.name,
          email: user.email,
          mobile: user.mobile_no,
        });
      }
    }
    return Array.from(unique.values());
  }, [logs]);

  /* ── Filtered logs for search ── */
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const user = log.accessedByUser;
      const profile = log.supplier_profile?.profile;
      const searchable = [
        user?.name,
        user?.email,
        user?.mobile_no,
        getEnterpriseName({ supplier_profile: log.supplier_profile } as PhoneAccessLogEntry),
        profile?.owner_director_name,
        profile?.contact_person,
        profile?.enterprise_name,
        profile?.export_company_name,
        profile?.office_address,
        log.supplier_profile?.supplier_type,
      ];
      return searchable.some(
        (val) => val && val.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery]);

  const selectedDistrictName = useMemo(() => {
    if (!selectedDistrictId) return "All districts";
    const found = districtOptions.find(
      (d) => String(d.id) === selectedDistrictId
    );
    return found?.name ?? "All districts";
  }, [selectedDistrictId, districtOptions]);

  /* ── Pagination handlers ── */
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > lastPage) return;
      setCurrentPage(page);
    },
    [lastPage]
  );

  /* ── District filter handler ── */
  const handleDistrictChange = useCallback(
    (districtId: string) => {
      setSelectedDistrictId(districtId);
      setCurrentPage(1);
    },
    []
  );

  return (
    <div className="ds-supplier-access-logs">
      <header className="ds-page-header">
        <h1>Supplier Access Logs</h1>
        <p className="ds-page-subtitle">
          Track which users have viewed supplier phone numbers from the
          directory.
        </p>
      </header>
      {/* ── Stats row ── */}
      <div className="ds-stats-row">
        <div className="ds-stat-card">
          <span className="ds-stat-card__label">
            <FaHistory aria-hidden="true" /> Total Access Logs
          </span>
          <span className="ds-stat-card__value">
            {loading ? "--" : totalCount}
          </span>
        </div>
      </div>
      {/* ── Filters bar ── */}
      <div className="ds-filters-bar">
        {/* District filter */}
        <div className="ds-filter-group">
          <FaFilter aria-hidden="true" className="ds-filter-icon" />
          <span className="ds-filter-label">District</span>
          <div className="ds-select ds-select--sm" ref={districtDropdownRef}>
            <button
              type="button"
              className="ds-select__button"
              aria-expanded={isDistrictDropdownOpen}
              onClick={() => setIsDistrictDropdownOpen((open) => !open)}
              disabled={districtsLoading}
            >
              <span>
                {districtsLoading ? "Loading..." : selectedDistrictName}
              </span>
              <FaChevronDown
                aria-hidden="true"
                style={{
                  fontSize: 10,
                  transition: "transform 0.2s ease",
                  transform: isDistrictDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {isDistrictDropdownOpen && (
              <div className="ds-select__menu" role="listbox">
                <button
                  type="button"
                  className="ds-select__option"
                  onClick={() => {
                    handleDistrictChange("");
                    setIsDistrictDropdownOpen(false);
                  }}
                >
                  All districts
                </button>
                {districtOptions.map((district) => (
                  <button
                    type="button"
                    className="ds-select__option"
                    key={district.id}
                    onClick={() => {
                      handleDistrictChange(String(district.id));
                      setIsDistrictDropdownOpen(false);
                    }}
                  >
                    {district.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="ds-search-group">
          <FaSearch aria-hidden="true" className="ds-search-icon" />
          <input
            type="text"
            className="ds-search-input"
            placeholder="Search by enterprise, user, email, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {/* ── Table ── */}
      <div className="ds-table-wrap">
        {loading ? (
          <div className="ds-loading">
            Loading access
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="ds-empty">

            <p>
              {searchQuery.trim()
                ? "No access logs match your search."
                : "No supplier phone numbers have been accessed yet."}
            </p>
            <p className="ds-empty__hint">
              {searchQuery.trim()
                ? "Try adjusting your search or filter."
                : "Logs will appear here once users view supplier contact details."}
            </p>
          </div>
        ) : (
          <table className="ds-table">
            <thead>
              <tr>
                <th>
                  Type
                </th>
                <th>
                  Enterprise
                </th>
                <th>Owner / Contact</th>
                <th>
                  District
                </th>
                <th>
                  Accessed By
                </th>
                <th>
                  Accessed Email
                </th>
                <th>
                  Accessed Mobile
                </th>
                <th>
                  Accessed On
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span
                      className={`ds-badge ds-badge--${log.supplier_profile?.supplier_type || "unknown"}`}
                    >
                      {log.supplier_profile?.supplier_type || "\u2014"}
                    </span>
                  </td>
                  <td>{getEnterpriseName(log)}</td>
                  <td>{getOwnerOrContact(log)}</td>
                  <td>
                    {resolveDistrict(
                      log.supplier_profile?.profile?.district_id ?? null
                    )}
                  </td>
                  <td className="ds-cell-highlight">
                    {displayOrDash(log.accessedByUser?.name)}
                  </td>
                  <td>{displayOrDash(log.accessedByUser?.email)}</td>
                  <td>
                    {log.accessedByUser?.mobile_no ? (
                      <a
                        href={`tel:${log.accessedByUser.mobile_no}`}
                        className="ds-phone-link"
                      >
                        {log.accessedByUser.mobile_no}
                      </a>
                    ) : (
                      "\u2014"
                    )}
                  </td>
                  <td>{formatAccessDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {lastPage > 1 && !(searchQuery.trim() && filteredLogs.length === 0) && (
        <div className="ds-pagination">
          <button
            type="button"
            className="ds-page-btn"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <FaChevronLeft aria-hidden="true" /> Prev
          </button>

          <span className="ds-pagination__info">
            Page {currentPage} of {lastPage}
            <span className="ds-pagination__total"> ({totalCount} total)</span>
          </span>

          <button
            type="button"
            className="ds-page-btn"
            disabled={currentPage >= lastPage}
            onClick={() => goToPage(currentPage + 1)}
            aria-label="Next page"
          >
            Next <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
