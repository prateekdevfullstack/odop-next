"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import EntityForm from "@/components/district-admin/EntityForm";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminArtisansPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import {
  apiErrorsToMap,
  bootstrapDistrictFormValues,
  createEmptyArtisanForm,
  zodErrorsToMap,
} from "@/lib/district-admin/entity-form";
import { getStoredDistrictName } from "@/lib/district-admin/session";
import { parseArtisanForm } from "@/lib/validation/district-admin-artisan.schema";
import {
  buildArtisanFormData,
  createDistrictArtisan,
} from "@/services/district-admin-artisan.service";
import { fetchProductCategoryOptions } from "@/services/district-admin-lookups.service";
import type { DistrictEntityFormValues } from "@/types/district-admin";

function mapArtisanApiErrors(errors: Record<string, string[]>): Record<string, string> {
  const mapped = apiErrorsToMap(errors);
  if (mapped.artisan_type && !mapped.entity_type) {
    mapped.entity_type = mapped.artisan_type;
  }
  return mapped;
}

export default function AddDistrictArtisanPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const districtName = getStoredDistrictName() ?? "";
  const productCategoryId = parseProductCategoryId(searchParams);
  const categoryQuery = productCategoryQueryFromId(productCategoryId);

  const [values, setValues] = useState<DistrictEntityFormValues>(() =>
    bootstrapDistrictFormValues(createEmptyArtisanForm(districtName), districtName)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productCategories, setProductCategories] = useState<{ id: number; name: string }[]>([]);

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
      setProductCategories(await fetchProductCategoryOptions());
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
    const parsed = parseArtisanForm(values);
    if (!parsed.success) {
      setFieldErrors(zodErrorsToMap(parsed.error));
      toast.error("Please fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = buildArtisanFormData(values);
      await createDistrictArtisan(fd);
      toast.success("Artisan created successfully.");
      router.push(districtAdminArtisansPath(districtSlug, categoryQuery));
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(mapArtisanApiErrors(err.errors));
        toast.error(err.message);
      } else {
        toast.error("Failed to create artisan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      variant="artisan"
      values={values}
      fieldErrors={fieldErrors}
      productCategories={productCategories}
      categories={[]}
      isSubmitting={isSubmitting}
      productCategoryLocked={Boolean(productCategoryId)}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => router.push(districtAdminArtisansPath(districtSlug, categoryQuery))}
    />
  );
}
