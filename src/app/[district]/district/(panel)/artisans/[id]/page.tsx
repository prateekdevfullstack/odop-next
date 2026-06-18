"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import EntityDetailView from "@/components/district-admin/EntityDetailView";
import LoadingState from "@/components/district-admin/LoadingState";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminArtisanEditPath,
  districtAdminArtisansPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { getDistrictArtisan } from "@/services/district-admin-artisan.service";
import type { DistrictArtisan } from "@/types/district-admin";

export default function DistrictArtisanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const id = String(params.id ?? "");
  const urlCategoryId = parseProductCategoryId(searchParams);

  const [artisan, setArtisan] = useState<DistrictArtisan | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDistrictArtisan(id);
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
      setArtisan(res.data);
    } catch {
      toast.error("Failed to load artisan details.");
      router.push(
        districtAdminArtisansPath(
          districtSlug,
          productCategoryQueryFromId(urlCategoryId)
        )
      );
    } finally {
      setLoading(false);
    }
  }, [districtSlug, id, router, urlCategoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !artisan) {
    return <LoadingState label="Loading artisan details…" />;
  }

  const categoryQuery = productCategoryQueryFromId(
    artisan.product_category_id ?? urlCategoryId
  );

  return (
    <EntityDetailView
      title={artisan.enterprise_name || artisan.name || "Artisan"}
      subtitle="Artisan profile details"
      editHref={districtAdminArtisanEditPath(districtSlug, artisan.id, categoryQuery)}
      backHref={districtAdminArtisansPath(districtSlug, categoryQuery)}
      fields={[
        { label: "Name prefix", value: artisan.name_prefix },
        { label: "Full name", value: artisan.user?.name ?? artisan.name },
        { label: "Mobile number", value: artisan.user?.mobile_no ?? artisan.mobile_no },
        { label: "Email", value: artisan.user?.email ?? artisan.email },
        { label: "Enterprise name", value: artisan.enterprise_name },
        { label: "Enterprise type", value: artisan.enterprise_type },
        { label: "Artisan type", value: artisan.artisan_type },
        { label: "Address", value: artisan.address },
        { label: "District", value: artisan.districtMaster?.districtName ?? artisan.district },
        { label: "ODOP Product category", value: artisan.productCategory?.name },
        { label: "Website", value: artisan.website },
        { label: "Aadhar number", value: artisan.aadhar_number },
        { label: "Craft specialization", value: artisan.craftSpecialization?.specialization_name ?? artisan.craft_specialization },
        { label: "Production capacity", value: artisan.production_capacity },
        { label: "Customized order", value: artisan.customized_order },
        { label: "Status", value: artisan.status === 1 ? "Active" : "Inactive" },
        { label: "Verified", value: artisan.is_verified === 1 ? "Yes" : "No" },
      ]}
    />
  );
}
