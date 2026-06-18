"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  fetchAllEventCategories,
  fetchPublicEvents,
  type EventCategory,
  type PublicEvent,
} from "@/services/events.service";
import {
  fetchPublicDistricts,
  parsePublicDistrictListResponse,
} from "@/services/districts.service";
import "@/styles/upcoming-events.css";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { UpcomingEvents } from "@/components/upcomingEvents/UpcomingEvents";
import { useLanguage } from "@/hooks/useLanguage";
import PageBanner from "@/components/shared/PageBanner";

function formatApiDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizePublicEvents(payload: unknown): PublicEvent[] {
  if (Array.isArray(payload)) {
    return payload as PublicEvent[];
  }

  if (payload && typeof payload === "object") {
    const { rows, data } = payload as { rows?: unknown; data?: unknown };
    if (Array.isArray(rows)) {
      return rows as PublicEvent[];
    }
    if (Array.isArray(data)) {
      return data as PublicEvent[];
    }
  }

  return [];
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
  searchable = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  ariaLabel: string;
  searchable?: boolean;
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

  const filteredOptions =
    searchable && query.trim()
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
      {searchable ? (
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
      ) : (
        <button
          type="button"
          className="event-filter-dropdown-trigger"
          aria-label={ariaLabel}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{selectedLabel || placeholder}</span>
          <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} />
        </button>
      )}
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

export default function UpcomingEventsClient() {
  const lang = useLanguage();
  const isHi = lang === "hi";
  const dateLocale = isHi ? "hi-IN" : "en-GB";

  const headingText = isHi
    ? "प्रदर्शनियों और मेलों की अधिसूचित सूची"
    : "Notified List of Exhibitions and Fairs";
  const browseByCategoryText = isHi ? "श्रेणी के अनुसार ब्राउज़ करें" : "Browse By Category";
  const filterUpdatesText = isHi ? "अपडेट फ़िल्टर करें" : "Filter Updates";
  const filterDescText = isHi
    ? "घरेलू गतिविधि, राष्ट्रीय प्रचार या अंतर्राष्ट्रीय ओडीओपी हाइलाइट्स पर ध्यान केंद्रित करने के लिए एक श्रेणी चुनें।"
    : "Choose a category to focus on domestic activity, national exposure, or international ODOP highlights.";
  const selectMonthYearAria = isHi ? "महीना और वर्ष चुनें" : "Select month and year";
  const selectMonthYearOption = isHi ? "महीना और वर्ष चुनें" : "Select Month & Year";
  const selectDistrictAria = isHi ? "जिला चुनें" : "Select district";
  const selectDistrictOption = isHi ? "जिला चुनें" : "Select District";
  const clearFiltersAria = isHi ? "फ़िल्टर साफ़ करें" : "Clear filters";
  const clearButtonText = isHi ? "साफ़ करें" : "Clear";
  const allCategoryText = isHi ? "सभी" : "All";
  const emptyEventsText = isHi
    ? "इस श्रेणी के लिए कोई कार्यक्रम नहीं मिला।"
    : "No events found for this category.";
  const eventFallbackText = isHi ? "कार्यक्रम" : "Event";
  const dateRangeSeparator = isHi ? "से" : "to";

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiLimit = 5000;
  const pageSize = 10;

  // Filter state
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetchAllEventCategories();
        if (response.success && response.data) {
          if (Array.isArray(response.data.data)) {
            setCategories(response.data.data);
          } else if (Array.isArray(response.data)) {
            setCategories(response.data as unknown as EventCategory[]);
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setEventsLoading(true);
      try {
        const params: {
          page: number;
          limit: number;
          categoryId?: number | string;
          startDate?: string;
          endDate?: string;
          city?: string;
        } = {
          page: 1,
          limit: apiLimit,
        };
        if (activeCategoryId !== null) {
          params.categoryId = activeCategoryId;
        }
        if (selectedDistrict) {
          params.city = selectedDistrict;
        }
        if (selectedMonthYear) {
          const [year, month] = selectedMonthYear.split("-").map(Number);
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          params.startDate = formatApiDate(startDate);
          params.endDate = formatApiDate(endDate);
        }
        const response = await fetchPublicEvents(params);
        if (response.success && response.data) {
          const eventList = normalizePublicEvents(response.data);

          setTotalPages(Math.ceil(eventList.length / pageSize) || 1);
          setEvents(eventList.slice((page - 1) * pageSize, page * pageSize));
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setEventsLoading(false);
      }
    }
    loadEvents();
  }, [activeCategoryId, page, selectedMonthYear, selectedDistrict]);

  const handleCategoryChange = (categoryId: number | string | null) => {
    setActiveCategoryId(categoryId);
    setPage(1);
  };

  const handleFilterClear = () => {
    setSelectedMonthYear("");
    setSelectedDistrict("");
    setPage(1);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatEventDate = (start?: string, end?: string, eventDateType?: string) => {
    if (!start) return "";
    if (eventDateType && eventDateType.toUpperCase() === "MONTH") {
      const dateObj = new Date(start);
      if (isNaN(dateObj.getTime())) return start;
      const monthName = dateObj.toLocaleDateString(dateLocale, { month: "long" }).toUpperCase();
      return `${monthName}-${dateObj.getFullYear()}`;
    }
    const startFormatted = formatDate(start);
    if (!end || start === end) return startFormatted;
    return `${startFormatted} ${dateRangeSeparator} ${formatDate(end)}`;
  };

  const getCategoryBadgeClass = (categoryName?: string) => {
    if (!categoryName) return "default";
    const name = categoryName.toLowerCase();
    if (name.includes("national")) return "national";
    if (name.includes("domestic")) return "domestic";
    if (name.includes("international")) return "international";
    return "default";
  };

  const monthYearOptions: FilterOption[] = (() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const fyStartYear =
      currentMonth >= 3 ? today.getFullYear() : today.getFullYear() - 1;

    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(fyStartYear, 3 + index, 1);

      if (date < new Date(today.getFullYear(), today.getMonth(), 1)) {
        return null;
      }

      return {
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString(dateLocale, {
          month: "long",
          year: "numeric",
        }),
      };
    }).filter((option): option is FilterOption => option !== null);
  })();

  const districtOptions = districts.map((district) => ({
    value: district,
    label: district,
  }));

  return (
    <>
      <PageBanner
        imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New3.png"
        eyebrow={isHi ? "प्रदर्शनियाँ एवं मेले" : "Exhibitions & Fairs"}
        current={isHi ? "आगामी कार्यक्रम" : "Upcoming Events"}
      />

      <div className="upcoming-events-container">
        <header className="upcoming-events-header">
          <div className="resource-capsule-heading-wrap">
            <h1 className="resource-heading-common">{headingText}</h1>
          </div>
          <UpcomingEvents isHi={isHi} />
          <div className="mobile-filter-trigger-container">
            <button
              type="button"
              className="mobile-filter-trigger-btn"
              onClick={() => setIsDrawerOpen(true)}
            >
              <i className="fa-solid fa-filter" />
              <span>{isHi ? "फ़िल्टर और श्रेणियां" : "Filters & Categories"}</span>
            </button>
          </div>
        </header>

        <div className="upcoming-events-grid">
          <aside className="upcoming-events-sidebar">
            <span className="sidebar-category-tag">{browseByCategoryText}</span>
            <h2 className="sidebar-title">{filterUpdatesText}</h2>
            <p className="sidebar-desc">{filterDescText}</p>
            <div className="upcoming-events-filters">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", padding: "16px 0", borderRadius: "8px" }}>
                {/* Month and Year Filter */}
                {/* <select
              value={selectedMonthYear}
              onChange={(e) => {
                setSelectedMonthYear(e.target.value);
                setPage(1);
              }}
              style={{
                flex: "1 1 220px",
                minWidth: "220px",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                backgroundColor: "white",
                fontSize: "14px",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              aria-label="Select month and year"
            >
              <option value="">Select Month & Year</option>
              {Array.from({ length: 12 }, (_, index) => {
                const date = new Date();
                date.setDate(1);
                date.setMonth(date.getMonth() + index);
                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                return (
                  <option key={value} value={value}>
                    {date.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </option>
                );
              })}
            </select> */}
                <FilterDropdown
                  value={selectedMonthYear}
                  onChange={(nextValue) => {
                    setSelectedMonthYear(nextValue);
                    setPage(1);
                  }}
                  options={monthYearOptions}
                  placeholder={selectMonthYearOption}
                  ariaLabel={selectMonthYearAria}
                />
                {/* District Filter */}
                <FilterDropdown
                  value={selectedDistrict}
                  onChange={(nextValue) => {
                    setSelectedDistrict(nextValue);
                    setPage(1);
                  }}
                  options={districtOptions}
                  placeholder={selectDistrictOption}
                  ariaLabel={selectDistrictAria}
                  searchable
                />
                {/* Clear Button */}
                <button
                  onClick={handleFilterClear}
                  style={{
                    height: "40px",
                    padding: "0 24px",
                    backgroundColor: "#0f2749",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
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
            </div>
            <nav className="sidebar-categories-list">
              <BoneyardSkeleton
                name="upcoming-events-categories"
                loading={categoriesLoading}
                fallback={
                  <>
                    <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                    <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                    <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                    <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                  </>
                }
              >
                <button
                  type="button"
                  className={`category-filter-btn${activeCategoryId === null ? " active" : ""}`}
                  onClick={() => handleCategoryChange(null)}
                >
                  {allCategoryText}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    className={`category-filter-btn${activeCategoryId === category.value ? " active" : ""}`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </BoneyardSkeleton>
            </nav>
          </aside>

          <main className="upcoming-events-content">
            <BoneyardSkeleton
              name="upcoming-events-list"
              loading={eventsLoading}
              fallback={
                <div className="upcoming-events-scroll-container">
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                </div>
              }
            >
              {events.length === 0 ? (
                <div className="events-empty">
                  <i className="fa-regular fa-calendar-xmark" />
                  <span>{emptyEventsText}</span>
                </div>
              ) : (
                <>
                  <div className="upcoming-events-scroll-container">
                    {events.map((event) => (
                      <article key={event.id} className="event-list-card">
                        <div className="event-card-header">
                          <span
                            className={`event-category-badge ${getCategoryBadgeClass(
                              event.category?.name
                            )}`}
                          >
                            {event.category?.name || eventFallbackText}
                          </span>
                          <span className="event-card-date">
                            <i className="fa-regular fa-calendar" />
                            {formatEventDate(event.startDate, event.endDate, event.eventDateType)}
                          </span>
                        </div>
                        <h3 className="event-card-title">{event.title}</h3>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="events-pagination">
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                      >
                        <i className="fa-solid fa-chevron-left" />
                      </button>
                      <span className="pagination-info">
                        {isHi ? `पृष्ठ ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
                      </span>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                      >
                        <i className="fa-solid fa-chevron-right" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </BoneyardSkeleton>
          </main>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="filter-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="filter-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <h3 className="filter-drawer-title">
                {isHi ? "फ़िल्टर और श्रेणियां" : "Filters & Categories"}
              </h3>
              <button
                type="button"
                className="filter-drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close filters"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="filter-drawer-body">
              <div className="upcoming-events-filters">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px 0" }}>
                  <FilterDropdown
                    value={selectedMonthYear}
                    onChange={(nextValue) => {
                      setSelectedMonthYear(nextValue);
                      setPage(1);
                      setIsDrawerOpen(false);
                    }}
                    options={monthYearOptions}
                    placeholder={selectMonthYearOption}
                    ariaLabel={selectMonthYearAria}
                  />
                  <FilterDropdown
                    value={selectedDistrict}
                    onChange={(nextValue) => {
                      setSelectedDistrict(nextValue);
                      setPage(1);
                      setIsDrawerOpen(false);
                    }}
                    options={districtOptions}
                    placeholder={selectDistrictOption}
                    ariaLabel={selectDistrictAria}
                    searchable
                  />
                  <button
                    onClick={() => {
                      handleFilterClear();
                      setIsDrawerOpen(false);
                    }}
                    style={{
                      height: "40px",
                      width: "100%",
                      backgroundColor: "#0f2749",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    aria-label={clearFiltersAria}
                  >
                    {clearButtonText}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: "24px", marginBottom: "12px" }}>
                <span className="sidebar-category-tag">{browseByCategoryText}</span>
              </div>
              <nav className="sidebar-categories-list">
                <BoneyardSkeleton
                  name="upcoming-events-categories-mobile"
                  loading={categoriesLoading}
                  fallback={
                    <>
                      <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                      <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                    </>
                  }
                >
                  <button
                    type="button"
                    className={`category-filter-btn${activeCategoryId === null ? " active" : ""}`}
                    onClick={() => {
                      handleCategoryChange(null);
                      setIsDrawerOpen(false);
                    }}
                  >
                    {allCategoryText}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      className={`category-filter-btn${activeCategoryId === category.value ? " active" : ""}`}
                      onClick={() => {
                        handleCategoryChange(category.value);
                        setIsDrawerOpen(false);
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </BoneyardSkeleton>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
