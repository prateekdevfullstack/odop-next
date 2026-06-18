"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api/types";
import { getSupplierDirectoryFilters } from "@/services/supplier-directory.service";
import { getAccessedSuppliers } from "@/services/user.service";
import type { AccessedSupplierLog } from "@/types/user-access";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

export default function UserDashboardPage() {
  const isHi = useLanguage() === "hi";
  const [logs, setLogs] = useState<AccessedSupplierLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districtNames, setDistrictNames] = useState<Record<number, string>>({});
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});

  const loadLookups = useCallback(async () => {
    try {
      const filters = await getSupplierDirectoryFilters();
      const districts: Record<number, string> = {};
      const categories: Record<number, string> = {};
      for (const item of filters.data?.districts ?? []) {
        districts[item.id] = item.name;
      }
      for (const item of filters.data?.product_categories ?? []) {
        categories[item.id] = item.name;
      }
      setDistrictNames(districts);
      setCategoryNames(categories);
    } catch {
      // Non-blocking: IDs still shown if lookup fails
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccessedSuppliers();
      setLogs(data);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : isHi
            ? "एक्सेस किए गए आपूर्तिकर्ताओं को लोड करने में विफल।"
            : "Failed to load accessed suppliers.";
      setError(msg);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [isHi]);

  useEffect(() => {
    void loadLookups();
    void load();
  }, [load, loadLookups]);

  const resolveDistrict = useCallback(
    (districtId: number | null) => {
      if (districtId == null) return "—";
      return districtNames[districtId] ?? `District #${districtId}`;
    },
    [districtNames]
  );

  const resolveCategory = useCallback(
    (categoryId: number | null) => {
      if (categoryId == null) return "—";
      return categoryNames[categoryId] ?? `Category #${categoryId}`;
    },
    [categoryNames]
  );

  const totalCount = useMemo(() => logs.length, [logs]);

  return (
    <div className="dashboard-content ticket-theme">
      <header className="page-title">
        <span className="eyebrow">{isHi ? "मेरा खाता" : "My Account"}</span>
        <h1>{isHi ? "उपयोगकर्ता डैशबोर्ड" : "User Dashboard"}</h1>
        <p>
          {isHi
            ? "आपूर्तिकर्ता निर्देशिका से जिन आपूर्तिकर्ताओं के संपर्क नंबर आपने देखे हैं, वे आपके संदर्भ के लिए यहाँ सूचीबद्ध हैं।"
            : "Suppliers whose contact numbers you have viewed from the supplier directory are listed here for your reference."}
        </p>
      </header>

      <div className="panel mb-5">
        <h2 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "var(--secondary)" }}>
          {isHi ? "योजना संबंधी पूछताछ" : "Scheme Related Enquiries"}
        </h2>
        <p className="panel-meta" style={{ marginBottom: 14 }}>
          {isHi
            ? "आपके द्वारा दर्ज की गई योजना संबंधी पूछताछ की स्थिति देखें और ट्रैक करें।"
            : "View and track the status of scheme related enquiries you have submitted."}
        </p>
        <Link href="/user/grievances" className="btn btn-primary">
          {isHi ? "मेरी योजना संबंधी पूछताछ" : "My Scheme Related Enquiries"}
        </Link>
      </div>

      <div className="panel mb-5">
        <h2 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "var(--secondary)" }}>
          {isHi ? "संपर्क पूछताछ" : "Contact enquiries"}
        </h2>
        <p className="panel-meta" style={{ marginBottom: 14 }}>
          {isHi
            ? "आपके द्वारा की गई संपर्क पूछताछ की स्थिति देखें और ट्रैक करें।"
            : "View and track the status of contact enquiries you have submitted."}
        </p>
        <Link href="/user/contact-enquiries" className="btn btn-primary">
          {isHi ? "मेरी संपर्क पूछताछ" : "My Contact Enquiries"}
        </Link>
      </div>

      {error ? (
        <div className="panel mb-5">
          <p className="panel-meta" style={{ marginBottom: 12, color: "#b91c1c" }}>
            {error}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void load()}>
            {isHi ? "पुनः प्रयास करें" : "Try again"}
          </button>
        </div>
      ) : null}

      <div className="panel mb-5">
        <span className="panel-meta">
          {isHi ? "कुल एक्सेस किए गए आपूर्तिकर्ता" : "Total accessed suppliers"}
        </span>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--secondary)", marginTop: 6 }}>
          {loading ? "—" : totalCount}
        </div>
      </div>

      <div className="user-access-table-wrap">
        {loading ? (
          <div className="user-access-loading">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />{" "}
            {isHi
              ? "एक्सेस किए गए आपूर्तिकर्ता लोड हो रहे हैं…"
              : "Loading accessed suppliers…"}
          </div>
        ) : logs.length === 0 ? (
          <div className="user-access-empty">
            <p>
              {isHi
                ? "आपने अभी तक किसी आपूर्तिकर्ता का फ़ोन नंबर नहीं देखा है।"
                : "You have not viewed any supplier phone numbers yet."}
            </p>
            <p>
              {isHi ? "" : "Browse the "}
              <Link href="/suppliers">
                {isHi ? "आपूर्तिकर्ता निर्देशिका" : "supplier directory"}
              </Link>{" "}
              {isHi
                ? "देखें और किसी आपूर्तिकर्ता पंक्ति पर “मोबाइल नंबर देखें” पर क्लिक करें।"
                : "and click “View Mobile number” on a supplier row."}
            </p>
          </div>
        ) : (
          <table className="user-access-table">
            <thead>
              <tr>
                <th>{isHi ? "उद्यम" : "Supplier"}</th>
                <th>{isHi ? "स्वामी / निदेशक" : "Proprietor / Director"}</th>
                <th>{isHi ? "जिला" : "District"}</th>
                <th>{isHi ? "उत्पाद श्रेणी" : "Product Category"}</th>
                <th>{isHi ? "मोबाइल" : "Mobile"}</th>
                <th>{isHi ? "एक्सेस तिथि" : "Accessed On"}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{displayOrDash(log.supplier?.enterprise_name)}</td>
                  <td>{displayOrDash(log.supplier?.proprietor_director_name)}</td>
                  <td>{resolveDistrict(log.supplier?.district_id ?? null)}</td>
                  <td>{resolveCategory(log.supplier?.product_category_id ?? null)}</td>
                  <td>
                    {log.supplier?.phone_number ? (
                      <a
                        href={`tel:${log.supplier.phone_number}`}
                        className="user-phone-link"
                      >
                        {log.supplier.phone_number}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{formatAccessDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
