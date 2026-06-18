"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingState from "@/components/district-admin/LoadingState";
import { districtAdminArtisansPath } from "@/lib/district-admin/routes";
import { getStoredDistrictName } from "@/lib/district-admin/session";
import { fetchProductCategoryOptions } from "@/services/district-admin-lookups.service";

export default function DistrictAdminDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const districtSlug = String(params.district ?? "");

  useEffect(() => {
    void (async () => {
      try {
        const districtName = getStoredDistrictName();
        const categories = await fetchProductCategoryOptions(
          districtName ? { params: { districtName } } : undefined
        );
        if (categories.length > 0) {
          router.replace(
            districtAdminArtisansPath(districtSlug, {
              productCategoryId: categories[0].id,
            })
          );
        } else {
          router.replace(districtAdminArtisansPath(districtSlug));
        }
      } catch {
        router.replace(districtAdminArtisansPath(districtSlug));
      }
    })();
  }, [districtSlug, router]);

  return <LoadingState label="Opening dashboard…" />;
}
