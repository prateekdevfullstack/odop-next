"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import EntityForm from "@/components/district-admin/EntityForm";
import LoadingState from "@/components/district-admin/LoadingState";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminSupplierDetailPath,
  districtAdminSuppliersPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import {
  apiErrorsToMap,
  bootstrapDistrictFormValues,
  zodErrorsToMap,
} from "@/lib/district-admin/entity-form";
import { getStoredDistrictName } from "@/lib/district-admin/session";
import { parseSupplierFormUpdate } from "@/lib/validation/district-admin-supplier.schema";
import {
  buildSupplierFormData,
  getDistrictSupplier,
  supplierToFormValues,
  updateDistrictSupplier,
} from "@/services/district-admin-supplier.service";
import {
  fetchCategoryOptions,
  fetchProductCategoryOptions,
} from "@/services/district-admin-lookups.service";
import type { DistrictEntityFormValues } from "@/types/district-admin";

function mapSupplierApiErrors(errors: Record<string, string[]>): Record<string, string> {
  const mapped = apiErrorsToMap(errors);
  if (mapped.supplier_type && !mapped.entity_type) {
    mapped.entity_type = mapped.supplier_type;
  }
  return mapped;
}

export default function EditDistrictSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const id = String(params.id ?? "");
  const districtName = getStoredDistrictName() ?? "";
  const urlCategoryId = parseProductCategoryId(searchParams);

  const [values, setValues] = useState<DistrictEntityFormValues | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productCategories, setProductCategories] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, pc, cat] = await Promise.all([
        getDistrictSupplier(id),
        fetchProductCategoryOptions(),
        fetchCategoryOptions(),
      ]);
      if (!res.data) {
        toast.error("Supplier not found.");
        router.push(
          districtAdminSuppliersPath(
            districtSlug,
            productCategoryQueryFromId(urlCategoryId)
          )
        );
        return;
      }
      setValues(
        bootstrapDistrictFormValues(supplierToFormValues(res.data, districtName), districtName)
      );
      setProductCategories(pc);
      setCategories(cat);
    } catch {
      toast.error("Failed to load supplier.");
      router.push(
        districtAdminSuppliersPath(
          districtSlug,
          productCategoryQueryFromId(urlCategoryId)
        )
      );
    } finally {
      setLoading(false);
    }
  }, [districtName, districtSlug, id, router, urlCategoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !values) {
    return <LoadingState label="Loading supplier…" />;
  }

  const categoryQuery = productCategoryQueryFromId(
    values.product_category_id || urlCategoryId
  );

  const handleChange = (field: keyof DistrictEntityFormValues, value: string) => {
    setValues((prev) => (prev ? { ...prev, [field]: value } : prev));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSupplierFormUpdate(values);
    if (!parsed.success) {
      setFieldErrors(zodErrorsToMap(parsed.error));
      toast.error("Please fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = buildSupplierFormData(values);
      await updateDistrictSupplier(id, fd);
      toast.success("Supplier updated successfully.");
      router.push(districtAdminSupplierDetailPath(districtSlug, id, categoryQuery));
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(mapSupplierApiErrors(err.errors));
        toast.error(err.message);
      } else {
        toast.error("Failed to update supplier.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      variant="supplier"
      values={values}
      fieldErrors={fieldErrors}
      productCategories={productCategories}
      categories={categories}
      isEdit
      isSubmitting={isSubmitting}
      productCategoryLocked
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() =>
        router.push(districtAdminSupplierDetailPath(districtSlug, id, categoryQuery))
      }
    />
  );
}
