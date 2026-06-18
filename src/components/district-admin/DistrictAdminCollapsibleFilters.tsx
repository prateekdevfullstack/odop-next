"use client";

import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

type DistrictAdminCollapsibleFiltersProps = {
  title?: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function countActiveFilterFields(values: Record<string, string>): number {
  return Object.values(values).filter((value) => value.trim() !== "").length;
}

export default function DistrictAdminCollapsibleFilters({
  title = "Filters",
  activeCount = 0,
  defaultOpen = false,
  children,
}: DistrictAdminCollapsibleFiltersProps) {
  const [open, setOpen] = useState(defaultOpen || activeCount > 0);

  return (
    <div className={`da-grievance-filters panel${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="da-grievance-filters-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="da-grievance-filters-toggle-label">
          <FaFilter className="da-grievance-filters-toggle-icon" aria-hidden />
          {title}
          {activeCount > 0 ? (
            <span className="da-grievance-filters-badge">{activeCount}</span>
          ) : null}
        </span>
        <FaChevronDown className="da-grievance-filters-chevron" aria-hidden />
      </button>
      {open ? <div className="da-grievance-filters-body">{children}</div> : null}
    </div>
  );
}
