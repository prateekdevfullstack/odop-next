"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import EntityForm from "@/components/district-admin/EntityForm";
import LoadingState from "@/components/district-admin/LoadingState";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminArtisanDetailPath,
  districtAdminArtisansPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import {
  apiErrorsToMap,
  bootstrapDistrictFormValues,
  zodErrorsToMap,
} from "@/lib/district-admin/entity-form";
import { getStoredDistrictName } from "@/lib/district-admin/session";
import { parseArtisanFormUpdate } from "@/lib/validation/district-admin-artisan.schema";
import {
  artisanToFormValues,
  buildArtisanFormData,
  getDistrictArtisan,
  updateDistrictArtisan,
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

export default function EditDistrictArtisanPage() {
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
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, pc] = await Promise.all([
        getDistrictArtisan(id),
        fetchProductCategoryOptions(),
      ]);
      if (!res.data) {
        toast.error("Artisan not found.");
        router.push(
          districtAdminArtisansPath(
            districtSlug,
            productCategoryQueryFromId(urlCategoryId)
          )
        );
        return;
      }
      setValues(
        bootstrapDistrictFormValues(artisanToFormValues(res.data, districtName), districtName)
      );
      setProductCategories(pc);
    } catch {
      toast.error("Failed to load artisan.");
      router.push(
        districtAdminArtisansPath(
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
    return <LoadingState label="Loading artisan…" />;
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
    const parsed = parseArtisanFormUpdate(values);
    if (!parsed.success) {
      setFieldErrors(zodErrorsToMap(parsed.error));
      toast.error("Please fix validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = buildArtisanFormData(values);
      await updateDistrictArtisan(id, fd);
      toast.success("Artisan updated successfully.");
      router.push(districtAdminArtisanDetailPath(districtSlug, id, categoryQuery));
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(mapArtisanApiErrors(err.errors));
        toast.error(err.message);
      } else {
        toast.error("Failed to update artisan.");
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
      isEdit
      isSubmitting={isSubmitting}
      productCategoryLocked
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() =>
        router.push(districtAdminArtisanDetailPath(districtSlug, id, categoryQuery))
      }
    />
  );
}
