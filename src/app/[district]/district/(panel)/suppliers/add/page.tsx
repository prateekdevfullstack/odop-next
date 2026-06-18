"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import EntityForm from "@/components/district-admin/EntityForm";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminSuppliersPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import {
  apiErrorsToMap,
  bootstrapDistrictFormValues,
  createEmptyEntityForm,
  zodErrorsToMap,
} from "@/lib/district-admin/entity-form";
import { getStoredDistrictName } from "@/lib/district-admin/session";
import { parseSupplierForm } from "@/lib/validation/district-admin-supplier.schema";
import {
  buildSupplierFormData,
  createDistrictSupplier,
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

export default function AddDistrictSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const districtName = getStoredDistrictName() ?? "";
  const productCategoryId = parseProductCategoryId(searchParams);
  const categoryQuery = productCategoryQueryFromId(productCategoryId);

  const [values, setValues] = useState<DistrictEntityFormValues>(() =>
    bootstrapDistrictFormValues(createEmptyEntityForm(districtName), districtName)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productCategories, setProductCategories] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    setValues((v) => bootstrapDistrictFormValues(v, districtName));
  }, [districtName]);

  useEffect(() => {
    if (productCategoryId) {
      setValues((prev) => ({ ...prev, product_category_id: productCategoryId }));
    }
  }, [productCategoryId]);

  useEffect(() => {
    void (async () => {
      const [pc, cat] = await Promise.all([
        fetchProductCategoryOptions(),
        fetchCategoryOptions(),
      ]);
      setProductCategories(pc);
      setCategories(cat);
    })();
  }, []);

  const handleChange = (field: keyof DistrictEntityFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSupplierForm(values);
    if (!parsed.success) {
      setFieldErrors(zodErrorsToMap(parsed.error));
      toast.error("Please fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = buildSupplierFormData(values);
      await createDistrictSupplier(fd);
      toast.success("Supplier created successfully.");
      router.push(districtAdminSuppliersPath(districtSlug, categoryQuery));
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(mapSupplierApiErrors(err.errors));
        toast.error(err.message);
      } else {
        toast.error("Failed to create supplier.");
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
      isSubmitting={isSubmitting}
      productCategoryLocked={Boolean(productCategoryId)}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => router.push(districtAdminSuppliersPath(districtSlug, categoryQuery))}
    />
  );
}
