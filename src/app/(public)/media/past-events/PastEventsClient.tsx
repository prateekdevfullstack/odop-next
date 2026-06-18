"use client";

import { useEffect, useId, useRef, useState } from "react";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchPastEvents, type PastEventItem } from "@/services/events.service";
import {
  fetchPublicDistricts,
  parsePublicDistrictListResponse,
} from "@/services/districts.service";
import PageBanner from "@/components/shared/PageBanner";
import "@/styles/upcoming-events.css";
import "@/styles/past-events.css";

type PastEvent = {
  id: number;
  title: string;
  dayRange: string;
  monthYear: string;
  description: string;
  location: string;
  badgeText: string;
};

const PAGE_SIZE = 10;

function parseDateDisplay(
  start?: string,
  end?: string,
  locale = "en-US",
  dateType?: string
): { dayRange: string; monthYear: string } {
  const empty = { dayRange: "", monthYear: "" };
  if (!start) return empty;

  const s = new Date(start);
  if (isNaN(s.getTime())) return { dayRange: start, monthYear: "" };

  if (dateType && dateType.toUpperCase() === "MONTH") {
    const monthName = s.toLocaleDateString(locale, { month: "long" }).toUpperCase();
    return { dayRange: "", monthYear: `${monthName}-${s.getFullYear()}` };
  }

  const sDay = s.getDate().toString().padStart(2, "0");
  const sMonth = s.toLocaleDateString(locale, { month: "short" }).toUpperCase();
  const sYear = s.getFullYear();

  if (!end) {
    return { dayRange: sDay, monthYear: `${sMonth} ${sYear}` };
  }

  const e = new Date(end);
  if (isNaN(e.getTime())) {
    return { dayRange: sDay, monthYear: `${sMonth} ${sYear}` };
  }

  const eDay = e.getDate().toString().padStart(2, "0");
  const eMonth = e.toLocaleDateString(locale, { month: "short" }).toUpperCase();
  const eYear = e.getFullYear();

  if (sMonth === eMonth && sYear === eYear) {
    const range = sDay === eDay ? sDay : `${sDay} - ${eDay}`;
    return { dayRange: range, monthYear: `${sMonth} ${sYear}` };
  }

  return {
    dayRange: `${sDay} - ${eDay}`,
    monthYear: `${sMonth} ${sYear} – ${eMonth} ${eYear}`,
  };
}

function mapToUiEvent(item: PastEventItem, locale: string): PastEvent {
  const { dayRange, monthYear } = parseDateDisplay(
    item.startDate ?? item.date,
    item.endDate,
    locale,
    item.eventDateType as string | undefined
  );
  return {
    id: item.id,
    title: item.title ?? "",
    dayRange,
    monthYear,
    description: item.shortDescription ?? item.description ?? "",
    location: item.city ?? item.venueName ?? (item.location as string | undefined) ?? "",
    badgeText: item.badgeText ?? item.category?.name ?? "",
  };
}

function extractResult(data: unknown): { rows: PastEventItem[]; count: number } {
  if (!data || typeof data !== "object") return { rows: [], count: 0 };
  const d = data as Record<string, unknown>;
  let rows: PastEventItem[] = [];
  let count = 0;

  // Helper: read count or total as number (top-level or nested in pagination)
  const pageCount = (obj: Record<string, unknown>): number | undefined => {
    if (typeof obj.count === "number") return obj.count;
    if (typeof obj.total === "number") return obj.total;
    // Check nested pagination object
    const pagination = obj.pagination as Record<string, unknown> | undefined;
    if (pagination && typeof pagination === "object") {
      if (typeof pagination.total === "number") return pagination.total;
      if (typeof pagination.totalPages === "number") {
        // totalPages * perPage approximates total — use perPage if available
        const perPage = typeof pagination.perPage === "number" ? pagination.perPage
                     : typeof pagination.per_page === "number" ? pagination.per_page
                     : PAGE_SIZE;
        return pagination.totalPages * perPage;
      }
    }
    return undefined;
  };

  if (Array.isArray(d.data)) {
    rows = d.data as PastEventItem[];
    count = pageCount(d) ?? rows.length;
  } else if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.rows)) {
      rows = inner.rows as PastEventItem[];
      count = pageCount(inner) ?? rows.length;
    } else if (Array.isArray(inner.data)) {
      rows = inner.data as PastEventItem[];
      count = pageCount(inner) ?? rows.length;
    }
  } else if (Array.isArray(d.rows)) {
    rows = d.rows as PastEventItem[];
    count = pageCount(d) ?? rows.length;
  }
  return { rows, count };
}

type FilterOption = {
  value: string;
  label: string;
};

function FilterDropdown({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuId = useId();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = query.trim()
    ? options.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  const select = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="event-filter-dropdown" ref={dropdownRef}>
      <div className="event-filter-dropdown-trigger">
        <input
          type="text"
          className="event-filter-dropdown-input"
          aria-label={ariaLabel}
          aria-expanded={open}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={menuId}
          placeholder={placeholder}
          value={open ? query : selectedLabel || ""}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
        />
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
      </div>
      {open && (
        <div className="event-filter-dropdown-menu" role="listbox" id={menuId}>
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`event-filter-dropdown-option${value === option.value ? " selected" : ""}`}
              onClick={() => select(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="event-filter-dropdown-empty">No matches</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PastEventsClient() {
  const lang = useLanguage();
  const isHi = lang === "hi";
  const dateLocale = isHi ? "hi-IN" : "en-US";

  const [events, setEvents] = useState<PastEvent[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [{ page, loading }, setPageState] = useState({ page: 1, loading: true });
  const [city, setCity] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);

  const headingText = isHi ? "ओडीओपी पूर्व कार्यक्रम संग्रह" : "Past ODOP Events Archive";
  const emptyMessage = city
    ? isHi
      ? `"${city}" के लिए कोई पूर्व कार्यक्रम नहीं मिला।`
      : `No past events found for "${city}".`
    : isHi
      ? "कोई पूर्व कार्यक्रम नहीं मिला।"
      : "No past events found.";
  const previousPageAria = isHi ? "पिछला पृष्ठ" : "Previous page";
  const nextPageAria = isHi ? "अगला पृष्ठ" : "Next page";
  const selectDistrictAria = isHi ? "जिला चुनें" : "Select district";
  const selectDistrictOption = isHi ? "जिला चुनें" : "Select District";
  const clearFiltersAria = isHi ? "फ़िल्टर साफ़ करें" : "Clear filters";
  const clearButtonText = isHi ? "साफ़ करें" : "Clear";

  const goToPage = (next: number) => setPageState({ page: next, loading: true });

  // Load all districts for the filter dropdown.
  useEffect(() => {
    async function loadDistricts() {
      try {
        const response = await fetchPublicDistricts({
          page: 1,
          limit: 100,
          sort_by: "district_name",
          sort_order: "asc",
        });
        const { items } = parsePublicDistrictListResponse(response.data);
        const names = items
          .map((item) => item.districtName?.trim())
          .filter((name): name is string => Boolean(name))
          .sort((a, b) => a.localeCompare(b));
        setDistricts(Array.from(new Set(names)));
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    }
    loadDistricts();
  }, []);

  const districtOptions = districts.map((district) => ({
    value: district,
    label: district,
  }));

  // Apply the chosen district as the `city` filter → triggers events API call.
  const applyCity = (value: string) => {
    setCity(value);
    setPageState({ page: 1, loading: true });
  };

  useEffect(() => {
    let cancelled = false;
    fetchPastEvents({ page, limit: PAGE_SIZE, latestPast: true, ...(city ? { city } : {}) })
      .then((res) => {
        if (cancelled) return;
        const { rows, count } = extractResult(res.data);
        setEvents(rows.map((item) => mapToUiEvent(item, dateLocale)));
        setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)));
      })
      .catch(() => { if (!cancelled) setEvents([]); })
      .finally(() => { if (!cancelled) setPageState((s) => ({ ...s, loading: false })); });
    return () => { cancelled = true; };
  }, [page, city, dateLocale]);

  const timelineFallback = (
    <div className="timeline-wrap">
      <div className="timeline-line" />
      {[80, 65, 90, 55, 75, 70].map((titleW, i) => (
        <div key={i} className="timeline-row">
          <div className="timeline-date-col">
            <div className="timeline-date-box">
              <div className="skeleton-line" style={{ width: 36, height: 16, margin: "0 auto" }} />
              <div className="skeleton-line" style={{ width: 56, height: 11, margin: "0 auto" }} />
            </div>
          </div>
          <div className="timeline-spine-col">
            <div className="timeline-dot" />
          </div>
          <div className="timeline-content-col">
            <div className="timeline-card">
              <div className="skeleton-line" style={{ width: `${titleW}%`, height: 15, marginBottom: 8 }} />
              <div className="skeleton-line" style={{ width: "95%", height: 13, marginBottom: 4 }} />
              <div className="skeleton-line" style={{ width: "80%", height: 13, marginBottom: 10 }} />
              <div className="skeleton-line" style={{ width: 72, height: 20, borderRadius: 20 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <PageBanner
        imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New3.png"
        eyebrow={isHi ? "प्रदर्शनियाँ एवं मेले" : "Exhibitions & Fairs"}
        current={isHi ? "पूर्व कार्यक्रम" : "Past Events"}
        className="mt-0 mt-sm-0"
      />

      <main className="main-content event-page past-event-page">
        <section className="section event-main-section" style={{ paddingBottom: "2.5rem" }}>
          <div className="container">
            <div className="resource-capsule-heading-wrap">
              <h1 className="resource-heading-common">{headingText}</h1>
            </div>

            <div className="event-filter-row">
              <div className="event-filter-control">
                <FilterDropdown
                  value={city}
                  onChange={applyCity}
                  options={districtOptions}
                  placeholder={selectDistrictOption}
                  ariaLabel={selectDistrictAria}
                />
              </div>
              <button
                type="button"
                onClick={() => applyCity("")}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  backgroundColor: "#0f2749",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f2749")}
                aria-label={clearFiltersAria}
              >
                {clearButtonText}
              </button>
            </div>

            <BoneyardSkeleton name="past-events" loading={loading} fallback={timelineFallback}>
            <div className="timeline-wrap">
              {events.length > 0 && <div className="timeline-line" />}

              {events.length === 0 && !loading && (
                <p className="timeline-empty">{emptyMessage}</p>
              )}

              {events.map((event) => (
                <div key={event.id} className="timeline-row">
                  <div className="timeline-date-col">
                    <div className="timeline-date-box">
                      {event.dayRange && (
                        <span className="timeline-day-range">{event.dayRange}</span>
                      )}
                      {event.monthYear && (
                        <span className="timeline-month-year">{event.monthYear}</span>
                      )}
                    </div>
                  </div>

                  <div className="timeline-spine-col">
                    <div className="timeline-dot" />
                  </div>

                  <div className="timeline-content-col">
                    <div className="timeline-card">
                      <div className="timeline-card-header">
                        <h3 className="timeline-title">
                          <span className="timeline-title-text">{event.title}</span>
                          {event.location && (
                            <span className="timeline-location">
                              <i className="fas fa-location-dot timeline-location-icon" />
                              {event.location}
                            </span>
                          )}
                        </h3>
                      </div>
                      {event.description && (
                        <p className="timeline-desc">{event.description}</p>
                      )}
                      {event.badgeText && (
                        <span className="timeline-badge">{event.badgeText}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </BoneyardSkeleton>

            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className={`page-item ${page <= 1 ? "disabled" : ""}`}
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  aria-label={previousPageAria}
                >
                  <i className="fas fa-chevron-left" />
                </button>

                {(() => {
                  const pageWindow = Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2);
                  const showFirst = !pageWindow.includes(1);
                  const showFirstEllipsis = !pageWindow.includes(2) && !pageWindow.includes(1);
                  const showLastEllipsis = !pageWindow.includes(totalPages - 1) && !pageWindow.includes(totalPages);
                  const showLast = !pageWindow.includes(totalPages);
                  return (
                    <>
                      {showFirst && (
                        <button
                          type="button"
                          className={`page-item ${page === 1 ? "active" : ""}`}
                          onClick={() => goToPage(1)}
                        >
                          1
                        </button>
                      )}
                      {showFirstEllipsis && (
                        <span className="page-item" style={{ pointerEvents: "none", opacity: 0.5 }}>…</span>
                      )}
                      {pageWindow.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`page-item ${p === page ? "active" : ""}`}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                      {showLastEllipsis && (
                        <span className="page-item" style={{ pointerEvents: "none", opacity: 0.5 }}>…</span>
                      )}
                      {showLast && (
                        <button
                          type="button"
                          className={`page-item ${page === totalPages ? "active" : ""}`}
                          onClick={() => goToPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      )}
                    </>
                  );
                })()}

                <button
                  type="button"
                  className={`page-item ${page >= totalPages ? "disabled" : ""}`}
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  aria-label={nextPageAria}
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}


