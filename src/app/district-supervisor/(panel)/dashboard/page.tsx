"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/types";
import { districtSupervisorDistrictPath } from "@/lib/district-supervisor/routes";
import {
  fetchDistrictProfileSummary,
  type DistrictProfileSummaryData,
} from "@/services/district-admin-supervisor.service";
import { getPublicDistrictCards } from "@/services/districts.service";
import {
  FaChevronDown,
  FaGlobe,
  FaIndustry,
  FaLandmark,
  FaPalette,
  FaSearch,
  FaSignInAlt,
  FaUsers,
} from "react-icons/fa";

const EMPTY_SUMMARY: DistrictProfileSummaryData = {
  totalArtisans: 0,
  totalExporters: 0,
  totalManufacturers: 0,
  data: [],
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

const DISTRICT_ICON_TONES = ["red", "green", "purple", "amber", "pink", "cyan"];

type DistrictOption = {
  id: number;
  name: string;
};

export default function DistrictSupervisorDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DistrictProfileSummaryData>(EMPTY_SUMMARY);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDistrictListLoading, setIsDistrictListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedDistricts = useRef(false);
  const districtDropdownRef = useRef<HTMLDivElement | null>(null);

  const totalProfiles = useMemo(
    () =>
      summary.totalArtisans +
      summary.totalExporters +
      summary.totalManufacturers,
    [summary.totalArtisans, summary.totalExporters, summary.totalManufacturers]
  );

  const loadSummary = useCallback(async (districtId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDistrictProfileSummary(districtId || undefined);
      const nextSummary = response.data.data ?? EMPTY_SUMMARY;
      setSummary(nextSummary);
    } catch (err) {
      setSummary(EMPTY_SUMMARY);
      if (err instanceof ApiError || err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to load profile summary.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDistricts = useCallback(async () => {
    if (hasLoadedDistricts.current) return;
    setIsDistrictListLoading(true);
    try {
      const response = await getPublicDistrictCards({
        limit: 100,
        sort_by: "district_name",
        sort_order: "asc",
      });
      setDistricts(
        response.items.map((district) => ({
          id: district.id,
          name: district.districtName,
        }))
      );
      hasLoadedDistricts.current = true;
    } catch {
      setDistricts([]);
    } finally {
      setIsDistrictListLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadSummary(selectedDistrictId);
    });
  }, [loadSummary, selectedDistrictId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDistricts();
    });
  }, [loadDistricts]);

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

  const selectedDistrictName = useMemo(() => {
    if (!selectedDistrictId) return "All districts";
    return (
      districts.find((district) => String(district.id) === selectedDistrictId)
        ?.name ?? "All districts"
    );
  }, [districts, selectedDistrictId]);

  const visibleDistrictData = useMemo(() => {
    if (selectedDistrictId) return summary.data;
    return summary.data.slice(0, 5);
  }, [selectedDistrictId, summary.data]);

  const shouldShowViewAllCard =
    !selectedDistrictId && summary.data.length > 5;

  const totalCards = [
    {
      label: "ODOP Registered Artisans",
      value: summary.totalArtisans,
      icon: <FaPalette />,
      tone: "green",
    },
    {
      label: "ODOP Registered Exporters",
      value: summary.totalExporters,
      icon: <FaGlobe />,
      tone: "blue",
    },
    {
      label: "ODOP Registered Manufacturers",
      value: summary.totalManufacturers,
      icon: <FaIndustry />,
      tone: "orange",
    },
  ];

  return (
    <div className="ds-dashboard">
      <section className="ds-total-grid" aria-label="Profile totals">
        {totalCards.map((card) => (
          <article className="ds-total-card" key={card.label}>
            <span className={`ds-dashboard-card__icon ds-tone-${card.tone}`} aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <p>{card.label}</p>
              <strong>{formatCount(card.value)}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="ds-filter-bar" aria-label="District filters">
        <span id="ds-district-filter-label">Filter by District</span>
        <div className="ds-select" ref={districtDropdownRef}>
          <button
            type="button"
            className="ds-select__button"
            aria-labelledby="ds-district-filter-label"
            aria-expanded={isDistrictDropdownOpen}
            onClick={() => setIsDistrictDropdownOpen((open) => !open)}
            disabled={isDistrictListLoading}
          >
            <FaSearch className="ds-select__search-icon" aria-hidden="true" />
            <span>{isDistrictListLoading ? "Loading..." : selectedDistrictName}</span>
            <FaChevronDown aria-hidden="true" />
          </button>

          {isDistrictDropdownOpen ? (
            <div className="ds-select__menu" role="listbox">
              <button
                type="button"
                className="ds-select__option"
                onClick={() => {
                  setSelectedDistrictId("");
                  setIsDistrictDropdownOpen(false);
                }}
              >
                All districts
              </button>
              {districts.length > 0 ? (
                districts.map((district) => (
                  <button
                    type="button"
                    className="ds-select__option"
                    key={district.id}
                    onClick={() => {
                      setSelectedDistrictId(String(district.id));
                      setIsDistrictDropdownOpen(false);
                    }}
                  >
                    {district.name}
                  </button>
                ))
              ) : (
                <span className="ds-select__empty">No data.</span>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {error ? <p className="ds-dashboard-alert">{error}</p> : null}

      <section className="ds-overview-panel" aria-labelledby="ds-overview-title">
        <h2 id="ds-overview-title">District Overview</h2>
        <div className="ds-dashboard-grid" aria-label="District profile summaries">
        {isLoading ? (
          <p className="ds-dashboard-status">Loading...</p>
        ) : summary.data.length > 0 ? (
          <>
            {visibleDistrictData.map((district, index) => (
              <article
                className={`ds-dashboard-card ds-district-card ds-tone-${
                  DISTRICT_ICON_TONES[index % DISTRICT_ICON_TONES.length]
                }`}
                key={district.districtId}
              >
                <div className="ds-district-card__header">
                  <span
                    className={`ds-district-icon ds-tone-${
                      DISTRICT_ICON_TONES[index % DISTRICT_ICON_TONES.length]
                    }`}
                    aria-hidden="true"
                  >
                    <FaLandmark />
                  </span>
                  <div style={{ top: "10px" }}>
                    <strong>{district.district}</strong>
                  </div>
                </div>
                <div className="ds-district-card__metrics">
                  {[
                    { label: "Registered Artisans", value: district.totalArtisans, icon: <FaUsers /> },
                    { label: "Registered Exporters", value: district.totalExporters, icon: <FaGlobe /> },
                    { label: "Registered Manufacturers", value: district.totalManufacturers, icon: <FaIndustry /> },
                    { label: "Artisan Data Accessed", value: district.artisanPhoneAccessLogCount, icon: <FaSignInAlt /> },
                    { label: "Exporter Data Accessed", value: district.exporterPhoneAccessLogCount, icon: <FaSignInAlt /> },
                    { label: "Manufacturer Data Accessed", value: district.manufacturerPhoneAccessLogCount, icon: <FaSignInAlt /> },
                  ].map((metric) => (
                    <div className="ds-district-metric" key={metric.label}>
                      <div className="ds-district-metric__top">
                        <p className="ds-district-metric__label">{metric.label}</p>
                        <span className="ds-district-metric__icon" aria-hidden="true">
                          {metric.icon}
                        </span>
                      </div>
                      <strong className="ds-district-metric__value">
                        {formatCount(metric.value ?? 0)}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {shouldShowViewAllCard ? (
              <button
                type="button"
                className="ds-dashboard-card ds-district-card ds-view-all-card"
                onClick={() => router.push(districtSupervisorDistrictPath())}
              >
                Explore more
              </button>
            ) : null}
          </>
        ) : (
          <p className="ds-dashboard-status">No data.</p>
        )}
        </div>
      </section>
    </div>
  );
}
