"use client";

import React, { useEffect, useState } from "react";
import {
  ARTISAN_CUSTOMIZED_ORDER_OPTIONS,
  ARTISAN_NAME_PREFIX_OPTIONS,
  ExporterType,
} from "@/lib/district-admin/constants";
import { fetchCraftSpecializationOptions } from "@/services/district-admin-lookups.service";
import type { DistrictEntityFormValues } from "@/types/district-admin";
import type { LookupOption } from "@/services/district-admin-lookups.service";

export type EntityFormVariant = "supplier" | "artisan" | "exporter";

type EntityFormProps = {
  variant: EntityFormVariant;
  values: DistrictEntityFormValues;
  fieldErrors: Record<string, string>;
  productCategories: LookupOption[];
  categories: LookupOption[];
  isEdit?: boolean;
  isSubmitting?: boolean;
  productCategoryLocked?: boolean;
  onChange: (field: keyof DistrictEntityFormValues, value: string) => void;
  onLogoChange?: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function FormFieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {optional ? <span className="form-field-optional"> (Optional)</span> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="supplier-field-error">{message}</p>;
}

function ProductCategoryField({
  value,
  productCategories,
  disabled,
  locked,
  error,
  onChange,
}: {
  value: string;
  productCategories: LookupOption[];
  disabled: boolean;
  locked: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={`form-field${locked ? " form-field-locked" : ""}`}>
      <FormFieldLabel htmlFor="entity-product-category">ODOP Product category *</FormFieldLabel>
      <select
        id="entity-product-category"
        className="select-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select product category</option>
        {productCategories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

export default function EntityForm({
  variant,
  values,
  fieldErrors,
  productCategories,
  categories,
  isEdit,
  isSubmitting,
  productCategoryLocked,
  onChange,
  onSubmit,
  onCancel,
}: EntityFormProps) {
  const productCategoryDisabled = Boolean(isSubmitting || productCategoryLocked);
  const entityLabel =
    variant === "supplier"
      ? "Manufacturer & Wholesaler"
      : variant === "artisan"
        ? "Artisan"
        : "Exporter";

  const [craftSpecData, setCraftSpecData] = useState<{ categoryId: string; options: LookupOption[] }>({ categoryId: "", options: [] });
  const craftSpecializations =
    craftSpecData.categoryId === values.product_category_id ? craftSpecData.options : [];

  useEffect(() => {
    if (variant !== "artisan" || !values.product_category_id) return;
    const id = values.product_category_id;
    void fetchCraftSpecializationOptions(id).then((options) => {
      setCraftSpecData({ categoryId: id, options });
    });
  }, [values.product_category_id, variant]);

  return (
    <div className="dashboard-content">
    <form onSubmit={onSubmit} className="panel">
      <div className="panel-head">
        <div>
          <h1>{isEdit ? `Edit ${entityLabel}` : `Add ${entityLabel}`}</h1>
          <p className="panel-meta">
            {isEdit
              ? `Update ${entityLabel.toLowerCase()} details for your district.`
              : `Register a new ${entityLabel.toLowerCase()} in your district.`}
          </p>
        </div>
      </div>

      <div className="form-grid">
        {variant === "artisan" && (
          <>
            <ProductCategoryField
              value={values.product_category_id}
              productCategories={productCategories}
              disabled={productCategoryDisabled}
              locked={Boolean(productCategoryLocked)}
              error={fieldErrors.product_category_id}
              onChange={(v) => onChange("product_category_id", v)}
            />

            <div className="form-field">
              <FormFieldLabel htmlFor="artisan-name-prefix" optional>
                Name prefix
              </FormFieldLabel>
              <select
                id="artisan-name-prefix"
                className="select-field"
                value={values.name_prefix}
                onChange={(e) => onChange("name_prefix", e.target.value)}
                disabled={isSubmitting}
              >
                {ARTISAN_NAME_PREFIX_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.name_prefix} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-name">Artisan name *</FormFieldLabel>
              <input
                id="entity-name"
                className="text-field"
                value={values.name}
                onChange={(e) => onChange("name", e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Jane Artisan"
                autoComplete="name"
              />
              <FieldError message={fieldErrors.name} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-mobile">Mobile number *</FormFieldLabel>
              <input
                id="entity-mobile"
                className="text-field"
                inputMode="numeric"
                maxLength={10}
                value={values.mobile_no}
                onChange={(e) =>
                  onChange("mobile_no", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.mobile_no} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-email" optional>
                Email ID
              </FormFieldLabel>
              <input
                id="entity-email"
                type="email"
                className="text-field"
                value={values.email}
                onChange={(e) => onChange("email", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-website" optional>
                Website
              </FormFieldLabel>
              <input
                id="entity-website"
                type="url"
                className="text-field"
                placeholder="https://example.com"
                value={values.website}
                onChange={(e) => onChange("website", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.website} />
            </div>

            <div className="form-field full-span">
              <FormFieldLabel htmlFor="entity-address" optional>
                Address
              </FormFieldLabel>
              <textarea
                id="entity-address"
                className="textarea-field"
                value={values.address}
                onChange={(e) => onChange("address", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.address} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-aadhar" optional>
                Aadhar number
              </FormFieldLabel>
              <input
                id="entity-aadhar"
                className="text-field"
                inputMode="numeric"
                maxLength={12}
                value={values.aadhar_number}
                onChange={(e) =>
                  onChange("aadhar_number", e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                disabled={isSubmitting}
              />
              <p className="supplier-upload-help">
                For internal administrative use only — not shown on the public website.
              </p>
              <FieldError message={fieldErrors.aadhar_number} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-craft-specialization" optional>
                Craft specialization
              </FormFieldLabel>
              <select
                id="entity-craft-specialization"
                className="select-field"
                value={values.craft_specialization}
                onChange={(e) => onChange("craft_specialization", e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Select craft specialization</option>
                {craftSpecializations.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.craft_specialization} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-production-capacity" optional>
                Production capacity
              </FormFieldLabel>
              <input
                id="entity-production-capacity"
                className="text-field"
                value={values.production_capacity}
                onChange={(e) => onChange("production_capacity", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.production_capacity} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-customized-order" optional>
                Customized order
              </FormFieldLabel>
              <select
                id="entity-customized-order"
                className="select-field"
                value={values.customized_order}
                onChange={(e) => onChange("customized_order", e.target.value)}
                disabled={isSubmitting}
              >
                {ARTISAN_CUSTOMIZED_ORDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.customized_order} />
            </div>
          </>
        )}

        {variant === "supplier" && (
          <>
            <ProductCategoryField
              value={values.product_category_id}
              productCategories={productCategories}
              disabled={productCategoryDisabled}
              locked={Boolean(productCategoryLocked)}
              error={fieldErrors.product_category_id}
              onChange={(v) => onChange("product_category_id", v)}
            />

            <div className="form-field">
              <FormFieldLabel htmlFor="supplier-enterprise">Enterprise/Unit name *</FormFieldLabel>
              <input
                id="supplier-enterprise"
                className="text-field"
                value={values.enterprise_name}
                onChange={(e) => onChange("enterprise_name", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.enterprise_name} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="supplier-proprietor">Proprietor/Director name *</FormFieldLabel>
              <input
                id="supplier-proprietor"
                className="text-field"
                value={values.proprietor_director_name}
                onChange={(e) => onChange("proprietor_director_name", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.proprietor_director_name} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-mobile">Mobile number *</FormFieldLabel>
              <input
                id="entity-mobile"
                className="text-field"
                inputMode="numeric"
                maxLength={10}
                value={values.mobile_no}
                onChange={(e) =>
                  onChange("mobile_no", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.mobile_no} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-udyam" optional>
                Udyam registration number
              </FormFieldLabel>
              <input
                id="entity-udyam"
                className="text-field"
                value={values.udyam_registration}
                onChange={(e) => onChange("udyam_registration", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.udyam_registration} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-gst" optional>
                GST number
              </FormFieldLabel>
              <input
                id="entity-gst"
                className="text-field"
                value={values.gst_number}
                onChange={(e) => onChange("gst_number", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.gst_number} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="supplier-pan" optional>
                PAN number
              </FormFieldLabel>
              <input
                id="supplier-pan"
                className="text-field"
                value={values.pan_number}
                onChange={(e) => onChange("pan_number", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.pan_number} />
            </div>

            <div className="form-field full-span">
              <FormFieldLabel htmlFor="entity-registered-address" optional>
                Registered address
              </FormFieldLabel>
              <textarea
                id="entity-registered-address"
                className="textarea-field"
                value={values.registered_address}
                onChange={(e) => {
                  onChange("registered_address", e.target.value);
                  onChange("address", e.target.value);
                }}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.registered_address} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-email" optional>
                Email ID
              </FormFieldLabel>
              <input
                id="entity-email"
                type="email"
                className="text-field"
                value={values.email}
                onChange={(e) => onChange("email", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-website" optional>
                Website
              </FormFieldLabel>
              <input
                id="entity-website"
                type="url"
                className="text-field"
                placeholder="https://example.com"
                value={values.website}
                onChange={(e) => onChange("website", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.website} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="supplier-bulk-order" optional>
                Bulk order
              </FormFieldLabel>
              <select
                id="supplier-bulk-order"
                className="select-field"
                value={values.bulk_order}
                onChange={(e) => onChange("bulk_order", e.target.value)}
                disabled={isSubmitting}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              <FieldError message={fieldErrors.bulk_order} />
            </div>
          </>
        )}

        {variant === "exporter" && (
          <>
            <ProductCategoryField
              value={values.product_category_id}
              productCategories={productCategories}
              disabled={productCategoryDisabled}
              locked={Boolean(productCategoryLocked)}
              error={fieldErrors.product_category_id}
              onChange={(v) => onChange("product_category_id", v)}
            />

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-owner">Owner/Director name *</FormFieldLabel>
              <input
                id="exporter-owner"
                className="text-field"
                value={values.owner_director_name}
                onChange={(e) => onChange("owner_director_name", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.owner_director_name} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-mobile">Mobile number *</FormFieldLabel>
              <input
                id="exporter-mobile"
                className="text-field"
                inputMode="numeric"
                maxLength={10}
                value={values.mobile_no}
                onChange={(e) =>
                  onChange("mobile_no", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.mobile_no} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-iec">IEC number *</FormFieldLabel>
              <input
                id="exporter-iec"
                className="text-field"
                value={values.iec_number}
                onChange={(e) => onChange("iec_number", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.iec_number} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-company-name" optional>
                Export company name
              </FormFieldLabel>
              <input
                id="exporter-company-name"
                className="text-field"
                value={values.export_company_name}
                onChange={(e) => {
                  onChange("export_company_name", e.target.value);
                  onChange("enterprise_name", e.target.value);
                }}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.export_company_name} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-type" optional>
                Type of exporter
              </FormFieldLabel>
              <select
                id="entity-type"
                className="select-field"
                value={values.entity_type}
                onChange={(e) => onChange("entity_type", e.target.value)}
                disabled={isSubmitting}
              >
                {Object.values(ExporterType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.entity_type} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-rcmc" optional>
                RCMC details
              </FormFieldLabel>
              <input
                id="exporter-rcmc"
                className="text-field"
                value={values.rcmc_details}
                onChange={(e) => onChange("rcmc_details", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.rcmc_details} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-est-year" optional>
                Year of establishment
              </FormFieldLabel>
              <input
                type="number"
                id="exporter-est-year"
                className="text-field"
                placeholder="YYYY"
                min={1900}
                max={new Date().getFullYear()}
                value={values.year_of_establishment}
                onChange={(e) => onChange("year_of_establishment", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.year_of_establishment} />
            </div>

            <div className="form-field full-span">
              <FormFieldLabel htmlFor="entity-office-address" optional>
                Office address
              </FormFieldLabel>
              <textarea
                id="entity-office-address"
                className="textarea-field"
                value={values.office_address}
                onChange={(e) => {
                  onChange("office_address", e.target.value);
                  onChange("address", e.target.value);
                }}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.office_address} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-contact-person" optional>
                Contact person
              </FormFieldLabel>
              <input
                id="exporter-contact-person"
                className="text-field"
                value={values.contact_person}
                onChange={(e) => onChange("contact_person", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.contact_person} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="exporter-designation" optional>
                Designation
              </FormFieldLabel>
              <input
                id="exporter-designation"
                className="text-field"
                value={values.designation}
                onChange={(e) => onChange("designation", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.designation} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-email" optional>
                Email ID
              </FormFieldLabel>
              <input
                id="entity-email"
                type="email"
                className="text-field"
                value={values.email}
                onChange={(e) => onChange("email", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="form-field">
              <FormFieldLabel htmlFor="entity-website" optional>
                Website
              </FormFieldLabel>
              <input
                id="entity-website"
                type="url"
                className="text-field"
                placeholder="https://example.com"
                value={values.website}
                onChange={(e) => onChange("website", e.target.value)}
                disabled={isSubmitting}
              />
              <FieldError message={fieldErrors.website} />
            </div>
          </>
        )}
      </div>

      <div className="da-form-actions" style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
}
