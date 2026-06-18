"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getSupplierDirectoryFilters,
  getSupplierDirectory,
  getProductCategoriesByDistrict,
  downloadSupplierDirectoryPdf,
  revealSupplierPhone,
  type DirectoryItem,
  type DirectoryQueryParameters,
  type ProductCategoryOption,
  type FilterOption,
} from "@/services/supplier-directory.service";
import LoginModal from "@/components/ui/LoginModal";
import { isUserLoggedIn } from "@/services/auth.service";
import { useLanguage } from "@/hooks/useLanguage";
import { resolveProductCategoryLabel } from "@/lib/locale";
import { localizeDistrictName, localizeCategoryName } from "@/lib/odop-translations";
import { SearchableDropdown } from "./SupplierFilterBar";

const ACCENT = "#8a231c";
const EXPAND_COLLAPSE_MS = 360;
const CAT_PAGE_SIZE = 12;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const CATEGORY_ICON_MAP: Array<[RegExp, string, string]> = [
  [/leather|footwear|shoe|boot|chap/i, "fas fa-shoe-prints", "#e67e22"],
  [/textile|fabric|cloth|silk|saree|weav/i, "fas fa-tshirt", "#3498db"],
  [/food|petha|sweet|agri|grain|rice|wheat/i, "fas fa-seedling", "#27ae60"],
  [/marble|stone|craft|handicraft|engrav/i, "fas fa-gem", "#8e44ad"],
  [/metal|iron|steel|brass|copper/i, "fas fa-cog", "#7f8c8d"],
  [/wood|furniture|carpentry/i, "fas fa-tree", "#8b5e3c"],
  [/glass|ceramic|pottery|clay/i, "fas fa-flask", "#16a085"],
  [/jewel|gold|silver|ornament/i, "fas fa-ring", "#f39c12"],
  [/paper|book|print/i, "fas fa-book", "#2980b9"],
  [/carpet|rug|mat/i, "fas fa-layer-group", "#d35400"],
  [/bamboo|cane|basket/i, "fas fa-leaf", "#2ecc71"],
  [/toy|sport|game/i, "fas fa-gamepad", "#e74c3c"],
  [/electr|wire|cable/i, "fas fa-bolt", "#f1c40f"],
];

const SUPPLIER_TYPE_HI: Record<string, string> = {
  Manufacturers: "निर्माता",
  Artisans: "शिल्पकार",
  Exporters: "निर्यातक",
  Manufacturer: "निर्माता",
  Artisan: "शिल्पकार",
  Exporter: "निर्यातक",
};

function localizeSupplierType(value: string | null | undefined, isHi: boolean): string {
  if (!value) return isHi ? "शिल्पकार" : "Artisan";
  return isHi ? (SUPPLIER_TYPE_HI[value] ?? value) : value;
}

function getCategoryIconInfo(name: string): { icon: string; color: string } {
  for (const [pattern, icon, color] of CATEGORY_ICON_MAP) {
    if (pattern.test(name)) return { icon, color };
  }
  return { icon: "fas fa-store", color: ACCENT };
}

function normalizeSupplierTypeValue(
  value: string
): "Manufacturers" | "Artisans" | "Exporters" | null {
  const n = value.trim().toLowerCase();
  if (n === "artisan" || n === "artisans") return "Artisans";
  if (n === "exporter" || n === "exporters") return "Exporters";
  if (n === "manufacturer" || n === "manufacturers" || n === "manufacturers & wholesalers")
    return "Manufacturers";
  return null;
}

function parseUrlPositiveInt(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatDate(dateStr: string | null | undefined): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Animated expand wrapper ────────────────────────────────────────────── */
function ExpandWrapper({ isExpanded, children }: { isExpanded: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(isExpanded);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setMounted(true);
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXPAND_COLLAPSE_MS);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  if (!mounted) return null;

  return (
    <div style={{ display: "grid", gridTemplateRows: visible ? "1fr" : "0fr", transition: `grid-template-rows ${EXPAND_COLLAPSE_MS}ms cubic-bezier(0.34,1.15,0.64,1)` }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>{children}</div>
    </div>
  );
}

/* ─── Column header row (shown once per expanded card) ──────────────────── */
function SupplierTableHeader() {
  const isHi = useLanguage() === "hi";
  return (
    <div
      className="supplier-directory-grid-row"
      style={{
        display: "grid",
        gridTemplateColumns: "44px 180px 1fr 1fr 1fr 120px",
        alignItems: "center",
        gap: "12px",
        padding: "8px 20px",
        background: "var(--bg-subtle, #f8fafc)",
        borderBottom: "1px solid var(--border-light, #e2e8f0)",
      }}
    >
      <div />
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{isHi ? "नाम" : "Name"}</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{isHi ? "मोबाइल" : "Mobile"}</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{isHi ? "ईमेल" : "Email"}</span>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{isHi ? "पता" : "Address"}</span>
      <div />
    </div>
  );
}

/* ─── Supplier detail panel ──────────────────────────────────────────────── */
interface DetailPanelConfig {
  districtId: number;
  districtName: string;
  productCategoryId: number;
  productCategoryName: string;
}

function SupplierDetailPanel({
  config,
  supplierType,
  onCountLoaded,
  onLastUpdated,
}: {
  config: DetailPanelConfig;
  supplierType: "Manufacturers" | "Artisans" | "Exporters" | null;
  onCountLoaded: (count: number) => void;
  onLastUpdated: (date: string) => void;
}) {
  const isHi = useLanguage() === "hi";
  const [suppliers, setSuppliers] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState<Record<number, string>>({});
  const [phoneLoadingId, setPhoneLoadingId] = useState<number | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingPhoneSupplierId, setPendingPhoneSupplierId] = useState<number | null>(null);
  const PAGE_LIMIT = 10;

  const onCountLoadedRef = useRef(onCountLoaded);
  const onLastUpdatedRef = useRef(onLastUpdated);
  useEffect(() => { onCountLoadedRef.current = onCountLoaded; });
  useEffect(() => { onLastUpdatedRef.current = onLastUpdated; });

  useEffect(() => {
    setRevealedPhones({});
    setPhoneLoadingId(null);
    setPendingPhoneSupplierId(null);
  }, [currentPage, config.districtId, config.productCategoryId, supplierType]);

  const fetchSupplierPhone = async (supplierId: number) => {
    if (revealedPhones[supplierId] || phoneLoadingId === supplierId) return;
    setPhoneLoadingId(supplierId);
    try {
      const mobile = await revealSupplierPhone(supplierId);
      setRevealedPhones((prev) => ({ ...prev, [supplierId]: mobile }));
    } catch { /* keep button */ } finally { setPhoneLoadingId(null); }
  };

  const handleRevealPhone = (supplierId: number) => {
    if (revealedPhones[supplierId] || phoneLoadingId === supplierId) return;
    if (!isUserLoggedIn()) { setPendingPhoneSupplierId(supplierId); setLoginModalOpen(true); return; }
    void fetchSupplierPhone(supplierId);
  };

  const handleLoginSuccess = () => {
    if (pendingPhoneSupplierId == null) return;
    const id = pendingPhoneSupplierId;
    setPendingPhoneSupplierId(null);
    void fetchSupplierPhone(id);
  };

  useEffect(() => {
    const params: DirectoryQueryParameters = {
      page: currentPage, limit: PAGE_LIMIT,
      district_id: config.districtId,
      product_category_id: config.productCategoryId,
    };
    if (supplierType) params.supplier_type = supplierType;
    setLoading(true);
    getSupplierDirectory(params)
      .then((res) => {
        const items = (res.data ?? []).map((item) => ({ ...item, mobile_no: null }));
        setSuppliers(items);
        setTotalPages(res.meta?.last_page ?? 1);
        const total = res.meta?.total ?? 0;
        setTotalSuppliers(total);
        onCountLoadedRef.current(total);
        onLastUpdatedRef.current(formatDate(items[0]?.created_at));
      })
      .catch(() => {
        setSuppliers([]); setTotalPages(1); setTotalSuppliers(0);
        onCountLoadedRef.current(0);
        onLastUpdatedRef.current(formatDate(null));
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, config.districtId, config.productCategoryId, supplierType]);

  const handleExportPdf = async () => {
    setPdfLoading(true);
    const params: Omit<DirectoryQueryParameters, "page" | "limit"> = {
      district_id: config.districtId, product_category_id: config.productCategoryId,
    };
    if (supplierType) params.supplier_type = supplierType;
    try { await downloadSupplierDirectoryPdf(params); } catch { /* silent */ }
    finally { setPdfLoading(false); }
  };

  const startRow = Math.min((currentPage - 1) * PAGE_LIMIT + 1, totalSuppliers);
  const endRow = Math.min(currentPage * PAGE_LIMIT, totalSuppliers);

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) {
      pages.push(<button key="first" type="button" className="page-item" onClick={() => setCurrentPage(1)}>1</button>);
      if (start > 2) pages.push(<span key="el-s" className="page-ellipsis">...</span>);
    }
    for (let p = start; p <= end; p++) {
      pages.push(<button key={`p-${p}`} type="button" className={`page-item${currentPage === p ? " active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="el-e" className="page-ellipsis">...</span>);
      pages.push(<button key="last" type="button" className="page-item" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>);
    }
    return pages;
  };

  /* shared cell style */
  const cellStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "6px",
    fontSize: "0.82rem", color: "#334155", minWidth: 0, overflow: "hidden",
  };
  const iconStyle: React.CSSProperties = { color: "#94a3b8", fontSize: "0.75rem", flexShrink: 0 };

  return (
    <>
      <div className="supplier-directory-table-scroll" style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
      <div style={{ minWidth: 920 }}>
      {/* Column headers */}
      <SupplierTableHeader />

      {/* Rows */}
      {loading ? (
        <div className="supplier-directory-grid-row" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#94a3b8", fontSize: "0.875rem" }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }} /> {isHi ? "आपूर्तिकर्ता लोड हो रहे हैं…" : "Loading suppliers…"}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="supplier-directory-grid-row" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", color: "#94a3b8", fontSize: "0.875rem", textAlign: "center" }}>
          <i className="fas fa-store-slash" style={{ fontSize: "1.5rem", marginBottom: "8px" }} />
          {isHi ? "कोई आपूर्तिकर्ता नहीं मिला।" : "No suppliers found."}
        </div>
      ) : (
        suppliers.map((s, idx) => (
          <div
            key={`s-${s.id}-${idx}`}
            className="supplier-directory-grid-row"
            style={{
              display: "grid",
              gridTemplateColumns: "44px 180px 1fr 1fr 1fr 120px",
              alignItems: "center",
              gap: "12px",
              padding: "13px 20px",
              borderBottom: "1px solid var(--border-light, #e2e8f0)",
              transition: "background .12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Avatar */}
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.95rem", flexShrink: 0 }}>
              <i className="fas fa-user" />
            </div>

            {/* Identity */}
            <div style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.name || "—"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {localizeSupplierType(s.supplier_type, isHi)} • {localizeDistrictName(s.district, isHi) || config.districtName}
              </span>
            </div>

            {/* Mobile */}
            <div style={cellStyle}>
              <i className="fas fa-phone" style={iconStyle} />
              {revealedPhones[s.id] ? (
                <a href={`tel:${revealedPhones[s.id]}`} className="supplier-mobile-link" style={{ fontSize: "0.82rem" }}>
                  {revealedPhones[s.id]}
                </a>
              ) : phoneLoadingId === s.id ? (
                <span className="supplier-mobile-loading">
                  <i className="fas fa-spinner fa-spin" /> {isHi ? "लोड हो रहा है…" : "Loading…"}
                </span>
              ) : (
                <button type="button" className="supplier-view-mobile-btn" onClick={() => handleRevealPhone(s.id)} style={{ fontSize: "0.82rem" }}>
                  {isHi ? "मोबाइल देखें" : "View Mobile"}
                </button>
              )}
            </div>

            {/* Email */}
            <div style={cellStyle}>
              <i className="fas fa-envelope" style={iconStyle} />
              {s.email ? (
                <a href={`mailto:${s.email}`} style={{ color: "#1B3C72", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.82rem" }}>
                  {s.email}
                </a>
              ) : <span style={{ color: "#94a3b8" }}>—</span>}
            </div>

            {/* Address */}
            <div style={cellStyle}>
              <i className="fas fa-map-marker-alt" style={iconStyle} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.82rem" }}>
                {s.address || "—"}
              </span>
            </div>
          </div>
        ))
      )}
      </div>
      </div>

      {/* Footer: PDF + pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: "12px" }}>
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={pdfLoading}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "7px 16px", borderRadius: "8px",
            border: `1.5px solid ${ACCENT}`, background: "transparent",
            color: ACCENT, fontSize: "0.82rem", fontWeight: 600,
            cursor: pdfLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: pdfLoading ? 0.6 : 1,
          }}
        >
          <i className={pdfLoading ? "fas fa-spinner fa-spin" : "fas fa-file-pdf"} />
          {pdfLoading ? (isHi ? "निर्यात हो रहा है…" : "Exporting…") : (isHi ? "आपूर्तिकर्ता सूची डाउनलोड करें (पीडीएफ)" : "Download Supplier List (PDF)")}
        </button>

        {!loading && suppliers.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
              {isHi ? <>कुल <strong>{totalSuppliers}</strong> में से <strong>{startRow}–{endRow}</strong> दिखा रहे हैं</> : <>Showing <strong>{startRow}–{endRow}</strong> of <strong>{totalSuppliers}</strong> suppliers</>}
            </p>
            {totalPages > 1 && (
              <div className="pagination">
                <button type="button" className={`page-item${currentPage === 1 ? " disabled" : ""}`} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left" />
                </button>
                {renderPageNumbers()}
                <button type="button" className={`page-item${currentPage === totalPages ? " disabled" : ""}`} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={() => { setLoginModalOpen(false); setPendingPhoneSupplierId(null); }}
        onAuthSuccess={handleLoginSuccess}
      />
    </>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function SuppliersClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLanguage();
  const isHi = lang === "hi";

  const urlDistrictId = parseUrlPositiveInt(searchParams.get("district_id"));
  const urlProductCategoryId = parseUrlPositiveInt(searchParams.get("product_category_id"));
  const urlSupplierType = normalizeSupplierTypeValue(searchParams.get("supplier_type") ?? "");

  const [districts, setDistricts] = useState<FilterOption[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(urlDistrictId);
  const selectedManufacturerType = urlSupplierType;
  const [productCategories, setProductCategories] = useState<ProductCategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({});
  const [categoryLastUpdated, setCategoryLastUpdated] = useState<Record<number, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [catPage, setCatPage] = useState(1);
  const prevDistrictIdRef = useRef<number | null>(selectedDistrictId);

  useEffect(() => {
    getSupplierDirectoryFilters()
      .then((res) => setDistricts(res.data.districts ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedDistrictId(urlDistrictId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlDistrictId]);

  useEffect(() => {
    if (prevDistrictIdRef.current !== selectedDistrictId) {
      setExpandedCategoryId(null);
      setCategoryCounts({});
      setCategoryLastUpdated({});
      prevDistrictIdRef.current = selectedDistrictId;
    }
    if (selectedDistrictId == null) { setProductCategories([]); return; }
    const name = districts.find((d) => d.id === selectedDistrictId)?.name;
    setCategoriesLoading(true);
    getProductCategoriesByDistrict(selectedDistrictId, name)
      .then((cats) => setProductCategories(cats))
      .catch(() => setProductCategories([]))
      .finally(() => setCategoriesLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrictId, districts]);

  useEffect(() => {
    if (urlProductCategoryId == null || productCategories.length === 0) return;
    if (productCategories.some((cat) => cat.id === urlProductCategoryId))
      setExpandedCategoryId(urlProductCategoryId);
  }, [urlProductCategoryId, productCategories]);

  const updateUrl = useCallback((districtId: number | null, categoryId: number | null, type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (districtId != null) params.set("district_id", String(districtId));
    else { params.delete("district_id"); params.delete("product_category_id"); }
    if (categoryId != null) params.set("product_category_id", String(categoryId));
    else params.delete("product_category_id");
    if (type) params.set("supplier_type", type);
    else params.delete("supplier_type");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleReset = () => {
    setSelectedDistrictId(null);
    setExpandedCategoryId(null); setCategoryCounts({}); setCategoryLastUpdated({});
    setCatPage(1);
    router.replace(pathname, { scroll: false });
  };
  const handleExportAllPdf = async () => {
    setPdfLoading(true);
    const params: Omit<DirectoryQueryParameters, "page" | "limit"> = {};
    if (selectedManufacturerType) params.supplier_type = selectedManufacturerType;
    if (selectedDistrictId != null) params.district_id = selectedDistrictId;
    try { await downloadSupplierDirectoryPdf(params); } catch { /* silent */ }
    finally { setPdfLoading(false); }
  };

  const filteredCategories = productCategories;

  const totalCatPages = Math.max(1, Math.ceil(filteredCategories.length / CAT_PAGE_SIZE));
  const pagedCategories = filteredCategories.slice((catPage - 1) * CAT_PAGE_SIZE, catPage * CAT_PAGE_SIZE);
  const totalLoadedSuppliers = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);
  const districtName = (isHi ? selectedDistrict?.name_hindi : selectedDistrict?.name)
    || localizeDistrictName(selectedDistrict?.name, isHi);

  /* ─── Shared styles ──────────────────────────────────────────────────── */
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem", fontWeight: 600, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.04em",
  };

  return (
    <section className="section-sm supplier-directory-section">
      <div className="container">

        {/* ── Page Heading ─────────────────────────────────────────────────── */}
        <div className="cfc-capsule-heading-wrap">
          <h1 className="resource-heading-common">{isHi ? "आपूर्तिकर्ता निर्देशिका" : "Supplier Directory"}</h1>
        </div>

        {/* ── District filter bar ──────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px", boxShadow: "0 1px 6px rgba(15,23,42,0.04)", flexWrap: "wrap" }}>

          {/* District */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 180px", minWidth: "160px" }}>
            <label style={labelStyle}>{isHi ? "जनपद" : "District"}</label>
            <div style={{ maxWidth: "300px" }}>
              <SearchableDropdown
                placeholder={isHi ? "जनपद चुनें…" : "Select District…"}
                options={isHi ? districts.map((d) => ({ id: d.id, name: d.name_hindi || localizeDistrictName(d.name, true) })) : districts}
                selectedId={selectedDistrictId}
                onSelect={(val) => {
                  setSelectedDistrictId(val); setExpandedCategoryId(null); setCatPage(1);
                  updateUrl(val, null, urlSupplierType || null);
                }}
              />
            </div>
          </div>

          {/* Reset */}
          <button type="button" onClick={handleReset}
            style={{ alignSelf: "flex-end", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#334155", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            <i className="fas fa-redo" /> {isHi ? "रीसेट" : "Reset"}
          </button>
        </div>

        {/* ── Results summary ────────────────────────────────────────────── */}
        {selectedDistrictId != null && !categoriesLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontSize: "0.875rem", color: "#334155", padding: "8px 0 14px", flexWrap: "wrap" }}>
            <span>{isHi ? <><strong style={{ color: ACCENT }}>{districtName}</strong> के परिणाम दिखा रहे हैं</> : <>Showing results for <strong style={{ color: ACCENT }}>{districtName}</strong></>}</span>
            <span style={{ color: "#64748b", fontSize: "0.82rem" }}>
              {isHi
                ? `${filteredCategories.length} उत्पाद मिले${totalLoadedSuppliers > 0 ? ` • ${totalLoadedSuppliers} आपूर्तिकर्ता` : ""}`
                : `${filteredCategories.length} product${filteredCategories.length !== 1 ? "s" : ""} found${totalLoadedSuppliers > 0 ? ` • ${totalLoadedSuppliers} supplier${totalLoadedSuppliers !== 1 ? "s" : ""}` : ""}`}
            </span>
          </div>
        )}

        {/* ── Content area ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "32px" }}>
          {selectedDistrictId == null ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 48px", textAlign: "center", color: "#94a3b8", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px" }}>
              <i className="fas fa-map-marker-alt" style={{ fontSize: "2rem", color: "var(--primary, #1B3C72)", opacity: 0.4, marginBottom: "12px" }} />
              <span style={{ display: "block", fontWeight: 600, color: "#334155", marginBottom: "4px", fontSize: "0.95rem" }}>{isHi ? "जनपद चुनें" : "Select a District"}</span>
              <span>{isHi ? "उत्पाद श्रेणियाँ देखने के लिए ऊपर फ़िल्टर से एक जनपद चुनें।" : "Choose a district from the filter above to view product categories."}</span>
            </div>
          ) : categoriesLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", color: "#94a3b8", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px" }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }} /> {isHi ? "श्रेणियाँ लोड हो रही हैं…" : "Loading categories…"}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", textAlign: "center", color: "#94a3b8", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px" }}>
              <i className="fas fa-folder-open" style={{ fontSize: "1.5rem", marginBottom: "8px" }} />
              {isHi ? "कोई उत्पाद श्रेणी नहीं मिली।" : "No product categories found."}
            </div>
          ) : (
            <>
              {pagedCategories.map((cat) => {
                const isExpanded = expandedCategoryId === cat.id;
                const resolvedLabel = resolveProductCategoryLabel(cat, isHi);
                const categoryLabel = isHi && resolvedLabel === cat.name
                  ? localizeCategoryName(cat.name, true)
                  : resolvedLabel;
                const { icon, color } = getCategoryIconInfo(categoryLabel);
                const supplierCount = categoryCounts[cat.id];
                const lastUpdated = categoryLastUpdated[cat.id];

                return (
                  <div key={`cat-${cat.id}`} style={{ background: "#fff", border: `1.5px solid ${isExpanded ? "rgba(138,35,28,0.22)" : "#e2e8f0"}`, borderRadius: "14px", overflow: "hidden", boxShadow: isExpanded ? "0 4px 16px rgba(15,23,42,0.07)" : "none", transition: "box-shadow .2s, border-color .2s" }}>

                    {/* Card header */}
                    <button
                      type="button"
                      onClick={() => setExpandedCategoryId((prev) => prev === cat.id ? null : cat.id)}
                      className="supplier-cat-header"
                      style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                    >
                      {/* Icon */}
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                        <i className={icon} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: "1 1 auto", minWidth: 0, textAlign: "left" }}>
                        <span style={{ display: "block", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{categoryLabel}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          {selectedManufacturerType && (
                            <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(27,60,114,0.08)", color: "#1B3C72" }}>{localizeSupplierType(selectedManufacturerType, isHi)}</span>
                          )}
                          {districtName && (
                            <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: "#f1f5f9", color: "#334155" }}>{districtName}</span>
                          )}
                          {supplierCount != null && (
                            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>• {supplierCount} {isHi ? "आपूर्तिकर्ता" : `Supplier${supplierCount !== 1 ? "s" : ""}`}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: date + chevron */}
                      <div className="supplier-cat-meta" style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                        {lastUpdated && <span style={{ fontSize: "0.78rem", color: "#64748b", whiteSpace: "nowrap" }}>{isHi ? "अंतिम अद्यतन" : "Last updated"}: {lastUpdated}</span>}
                        <i className="fas fa-chevron-down" style={{ fontSize: "0.82rem", color: "#94a3b8", transition: "transform 0.3s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                      </div>
                    </button>

                    {/* Expanded supplier panel */}
                    <ExpandWrapper isExpanded={isExpanded && selectedDistrictId != null}>
                      {selectedDistrictId != null && (
                        <SupplierDetailPanel
                          config={{ districtId: selectedDistrictId, districtName, productCategoryId: cat.id, productCategoryName: categoryLabel }}
                          supplierType={selectedManufacturerType}
                          onCountLoaded={(count) => setCategoryCounts((prev) => ({ ...prev, [cat.id]: count }))}
                          onLastUpdated={(date) => setCategoryLastUpdated((prev) => ({ ...prev, [cat.id]: date }))}
                        />
                      )}
                    </ExpandWrapper>
                  </div>
                );
              })}

              {/* Category pagination */}
              {totalCatPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px 4px", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    {isHi
                      ? `कुल ${filteredCategories.length} उत्पादों में से ${(catPage - 1) * CAT_PAGE_SIZE + 1} से ${Math.min(catPage * CAT_PAGE_SIZE, filteredCategories.length)} दिखा रहे हैं`
                      : `Showing ${(catPage - 1) * CAT_PAGE_SIZE + 1} to ${Math.min(catPage * CAT_PAGE_SIZE, filteredCategories.length)} of ${filteredCategories.length} products`}
                  </span>
                  <div className="pagination">
                    <button type="button" className={`page-item${catPage === 1 ? " disabled" : ""}`} onClick={() => setCatPage((p) => Math.max(1, p - 1))} disabled={catPage === 1}>
                      <i className="fas fa-chevron-left" />
                    </button>
                    {Array.from({ length: totalCatPages }, (_, i) => i + 1).map((p) => (
                      <button key={`cp-${p}`} type="button" className={`page-item${catPage === p ? " active" : ""}`} onClick={() => setCatPage(p)}>{p}</button>
                    ))}
                    <button type="button" className={`page-item${catPage === totalCatPages ? " disabled" : ""}`} onClick={() => setCatPage((p) => Math.min(totalCatPages, p + 1))} disabled={catPage === totalCatPages}>
                      <i className="fas fa-chevron-right" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
