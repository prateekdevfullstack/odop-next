"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export interface SupplierTypeOption {
  value: string;
  label: string;
}

export interface DistrictOption {
  id: number;
  name: string;
}

export interface ProductCategoryOption {
  id: number;
  name: string;
  name_hindi?: string | null;
}

export interface SupplierFilterState {
  supplierType: string | null;
  districtId: number | null;
  productCategoryId: number | null;
}

/* ─── Searchable combobox dropdown ─────────────────────────────────────── */
interface SearchableDropdownProps {
  placeholder: string;
  options: Array<{ id: number; name: string }>;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function SearchableDropdown({ placeholder, options, selectedId, onSelect }: SearchableDropdownProps) {
  const isHi = useLanguage() === "hi";
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = options.find((o) => o.id === selectedId) ?? null;

  // Keep display value in sync when selection changes from outside or panel closes
  useEffect(() => {
    if (!isOpen) setInputValue(selectedOption?.name ?? "");
  }, [selectedId, isOpen, selectedOption]);

  // Close on outside click and restore displayed name
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setInputValue(selectedOption?.name ?? "");
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [selectedOption]);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val === "") {
      debounceRef.current = setTimeout(() => onSelect(null), 300);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setInputValue("");
  };

  const handleSelect = (id: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSelect(id);
    setIsOpen(false);
    setInputValue(options.find((o) => o.id === id)?.name ?? "");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSelect(null);
    setInputValue("");
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const isSelected = selectedId !== null;

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "block" }}>
      {/* Combobox trigger */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "10px",
          border: `1.5px solid ${isSelected ? "var(--primary, #1B3C72)" : "var(--border, #e2e8f0)"}`,
          background: isSelected ? "rgba(27,60,114,0.05)" : "#fff",
          cursor: "text",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color .15s",
        }}
      >
        <i className="fas fa-search" style={{ fontSize: "0.76rem", color: "var(--text-muted, #94a3b8)", flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "0.85rem",
            color: isSelected ? "var(--primary, #1B3C72)" : "var(--text-dark, #0f172a)",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
        {isSelected ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "18px", height: "18px", borderRadius: "50%",
              border: "none", background: "none", cursor: "pointer",
              color: "var(--text-muted, #94a3b8)", padding: 0, flexShrink: 0,
              fontSize: "0.72rem",
            }}
          >
            <i className="fas fa-times" />
          </button>
        ) : (
          <i className="fas fa-chevron-down" style={{ fontSize: "0.68rem", color: "var(--text-muted, #94a3b8)", flexShrink: 0, pointerEvents: "none" }} />
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 400,
            background: "#fff",
            border: "1.5px solid var(--border, #e2e8f0)",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(15,23,42,0.13)",
            minWidth: "230px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              padding: "6px 0",
            }}
          >
            {filteredOptions.length === 0 ? (
              <div style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
                {isHi ? "कोई परिणाम नहीं मिला" : "No results found"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 16px",
                    border: "none",
                    background: option.id === selectedId ? "rgba(27,60,114,0.05)" : "transparent",
                    fontSize: "0.85rem",
                    color: option.id === selectedId ? "var(--primary, #1B3C72)" : "var(--text-body, #334155)",
                    fontWeight: option.id === selectedId ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    gap: "8px",
                  }}
                >
                  <span>{option.name}</span>
                  {option.id === selectedId && (
                    <i className="fas fa-check" style={{ fontSize: "0.72rem", color: "var(--primary, #1B3C72)", flexShrink: 0 }} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main filter bar ───────────────────────────────────────────────────── */
interface SupplierFilterBarProps {
  supplierTypes: SupplierTypeOption[];
  districts: DistrictOption[];
  productCategories: ProductCategoryOption[];
  value: SupplierFilterState;
  onChange: (filters: SupplierFilterState) => void;
}

export default function SupplierFilterBar({
  supplierTypes,
  districts,
  productCategories,
  value,
  onChange,
}: SupplierFilterBarProps) {
  const hasActiveFilters =
    value.supplierType !== null || value.districtId !== null || value.productCategoryId !== null;

  const update = useCallback(
    (partial: Partial<SupplierFilterState>) => onChange({ ...value, ...partial }),
    [value, onChange]
  );

  const clearAll = () => onChange({ supplierType: null, districtId: null, productCategoryId: null });

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--border-light, #e2e8f0)",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              border: "none",
              borderRadius: "6px",
              background: "none",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted, #64748b)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <i className="fas fa-times-circle" />
            Clear All
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* ── 1. Supplier Type chips (hidden when no types provided) ── */}
        {supplierTypes.length > 0 && (
          <>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: "var(--text-muted, #94a3b8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "8px",
                }}
              >
                Type
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {supplierTypes.map((type) => {
                  const active = value.supplierType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update({ supplierType: active ? null : type.value })}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "10px",
                        border: `1.5px solid ${active ? "var(--primary, #1B3C72)" : "var(--border, #e2e8f0)"}`,
                        background: active ? "var(--primary, #1B3C72)" : "#fff",
                        color: active ? "#fff" : "var(--text-muted, #64748b)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                        transition: "all .15s",
                      }}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ height: "1px", background: "var(--border-light, #e2e8f0)" }} />
          </>
        )}

        {/* ── 2. District ── */}
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.73rem",
              fontWeight: 700,
              color: "var(--text-muted, #94a3b8)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            District
          </span>
          <SearchableDropdown
            placeholder="All Districts"
            options={districts}
            selectedId={value.districtId}
            onSelect={(id) => update({ districtId: id })}
          />
        </div>

        {/* ── 3. Product Category (hidden when no categories provided) ── */}
        {productCategories.length > 0 && (
          <>
            <div style={{ height: "1px", background: "var(--border-light, #e2e8f0)" }} />
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: "var(--text-muted, #94a3b8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "8px",
                }}
              >
                Category
              </span>
              <SearchableDropdown
                placeholder="All Categories"
                options={productCategories}
                selectedId={value.productCategoryId}
                onSelect={(id) => update({ productCategoryId: id })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
