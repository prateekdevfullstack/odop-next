"use client";

import Link from "next/link";
import { FaEdit, FaEye, FaSearch } from "react-icons/fa";

export type EntityListRow = {
  id: number;
  name: string;
  name_prefix?: string;
  email: string;
  email_id?: string;
  mobile_no: string;
  enterprise_name: string;
  enterprise_type?: string;
  district?: string;
  sector_category_name?: string;
  product_category_name?: string;
  craft_specialization?: string;
  production_capacity?: string;
  customized_order?: string;
  address?: string;
  registered_address?: string;
  supplier_type?: string;
  status?: number;
  export_company_name?: string;
  office_address?: string;
  iec_number?: string;
  owner_director_name?: string;
  proprietor_director_name?: string;
  rcmc_details?: string;
  contact_person?: string;
  designation?: string;
  year_of_establishment?: string;
  website?: string;
  gst_number?: string;
  udyam_registration?: string;
  pan_number?: string;
  bulk_order?: boolean;
};

type EntityListTableProps = {
  title: string;
  subtitle: string;
  variant?: "supplier" | "exporter" | "artisan";
  rows: EntityListRow[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  addHref: string;
  detailHref: (id: number) => string;
  editHref: (id: number) => string;
  productCategoryId: string;
  categoryId: string;
  productCategories: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  onProductCategoryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  emptyTitle: string;
  emptyDescription: string;
};

function displayText(value?: string) {
  if (!value?.trim()) return "—";
  return value.trim();
}

export default function EntityListTable({
  title,
  subtitle,
  variant = "supplier",
  rows,
  loading,
  search,
  onSearchChange,
  onSearchSubmit,
  addHref,
  detailHref,
  editHref,
  page,
  lastPage,
  onPageChange,
  emptyTitle,
  emptyDescription,
}: EntityListTableProps) {
  return (
    <div className="dashboard-content da-list-layout">
      <div className="panel da-list-panel">
        <header className="da-page-header">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </header>

        <div className="da-list-toolbar">
          <form onSubmit={onSearchSubmit} className="da-search-form">
            <div className="da-search-field">
              <FaSearch className="da-search-icon" aria-hidden />
              <input
                className="text-field"
                placeholder="Search by firm name, email, phone…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="da-list-toolbar-actions">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <Link href={addHref} className="btn btn-primary">
                Add new
              </Link>
            </div>
          </form>
        </div>

        {loading ? (
          <p className="panel-meta da-list-loading">Loading records…</p>
        ) : rows.length === 0 ? (
          <div className="district-admin-empty">
            <h3>{emptyTitle}</h3>
            <p className="panel-meta">{emptyDescription}</p>
            <Link href={addHref} className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
              Add first record
            </Link>
          </div>
        ) : (
          <div className="da-list-body">
            <div className="table-shell da-table-scroll">
              <table className={`data-table da-entity-table da-entity-table--${variant}`}>
                {variant === "exporter" && (
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Export Company name</th>
                      <th>Exporter type</th>
                      <th>Owner / Director</th>
                      <th>IEC Number</th>
                      <th>RCMC</th>
                      <th>Year of Establishment</th>
                      <th>Office Address</th>
                      <th>Contact Person</th>
                      <th>Designation</th>
                      <th>Email ID</th>
                      <th>Website</th>
                      <th>Product Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                )}
                {variant === "supplier" && (
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Enterprise / Unit Name</th>
                      <th>Registered Address</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Bulk Order</th>
                      <th>Product Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                )}
                {variant === "artisan" && (
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Artisan name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>ODOP Product Category</th>
                      <th>Craft Specialization</th>
                      <th>Production Capacity</th>
                      <th>Customized Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                )}

                <tbody>
                  {rows.map((row, index) => {
                    const serial = (page - 1) * 10 + index + 1;
                    return (
                      <tr key={row.id}>
                        {variant === "exporter" && (
                          <>
                            <td>{serial}</td>
                            <td>{row.export_company_name || row.enterprise_name || "—"}</td>
                            <td>{row.supplier_type || "—"}</td>
                            <td>{row.owner_director_name || "—"}</td>
                            <td>{row.iec_number || "—"}</td>
                            <td>{row.rcmc_details || "—"}</td>
                            <td>{row.year_of_establishment || "—"}</td>
                            <td>{displayText(row.office_address || row.address)}</td>
                            <td>{row.contact_person || "—"}</td>
                            <td>{row.designation || "—"}</td>
                            <td>{row.email_id || row.email || "—"}</td>
                            <td>{row.website || "—"}</td>
                            <td>{row.product_category_name ?? "—"}</td>
                          </>
                        )}
                        {variant === "supplier" && (
                          <>
                            <td>{serial}</td>
                            <td>{row.enterprise_name || "—"}</td>
                            <td>{displayText(row.registered_address || row.address)}</td>
                            <td>{row.mobile_no || "—"}</td>
                            <td>{row.email || "—"}</td>
                            <td>{row.bulk_order ? "Yes" : "No"}</td>
                            <td>{row.product_category_name ?? "—"}</td>
                          </>
                        )}
                        {variant === "artisan" && (
                          <>
                            <td>{serial}</td>
                            <td>{row.name || "—"}</td>
                            <td>{row.mobile_no || "—"}</td>
                            <td>{row.email || "—"}</td>
                            <td>{displayText(row.address)}</td>
                            <td>{row.product_category_name ?? "—"}</td>
                            <td>{row.craft_specialization || row.sector_category_name || "—"}</td>
                            <td>{row.production_capacity || "—"}</td>
                            <td>
                              {row.customized_order
                                ? row.customized_order === "Yes" ||
                                  row.customized_order.toLowerCase() === "yes"
                                  ? "Yes"
                                  : "No"
                                : "—"}
                            </td>
                          </>
                        )}

                        <td>
                        <div className="table-actions">
                          <Link href={detailHref(row.id)} className="btn-outline" title="View">
                            <FaEye />
                          </Link>
                          <Link href={editHref(row.id)} className="btn-outline" title="Edit">
                            <FaEdit />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {lastPage > 1 ? (
              <div className="da-list-pagination">
                <button
                  type="button"
                  className="btn-outline"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                >
                  Previous
                </button>
                <span className="panel-meta">
                  Page {page} of {lastPage}
                </span>
                <button
                  type="button"
                  className="btn-outline"
                  disabled={page >= lastPage}
                  onClick={() => onPageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
