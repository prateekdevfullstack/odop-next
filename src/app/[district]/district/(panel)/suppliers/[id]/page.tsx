"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import EntityDetailView from "@/components/district-admin/EntityDetailView";
import LoadingState from "@/components/district-admin/LoadingState";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminSupplierEditPath,
  districtAdminSuppliersPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { getDistrictSupplier } from "@/services/district-admin-supplier.service";
import type { DistrictSupplier } from "@/types/district-admin";

export default function DistrictSupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const id = String(params.id ?? "");
  const urlCategoryId = parseProductCategoryId(searchParams);

  const [supplier, setSupplier] = useState<DistrictSupplier | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDistrictSupplier(id);
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
      setSupplier(res.data);
    } catch {
      toast.error("Failed to load supplier details.");
      router.push(
        districtAdminSuppliersPath(
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

  if (loading || !supplier) {
    return <LoadingState label="Loading supplier details…" />;
  }

  const categoryQuery = productCategoryQueryFromId(
    supplier.product_category_id ?? urlCategoryId
  );

  return (
    <EntityDetailView
      title={supplier.enterprise_name || supplier.name || "Supplier"}
      subtitle="Supplier profile details"
      logoUrl={null}
      editHref={districtAdminSupplierEditPath(districtSlug, supplier.id, categoryQuery)}
      backHref={districtAdminSuppliersPath(districtSlug, categoryQuery)}
      fields={[
        { label: "Firm name", value: supplier.enterprise_name },
        { label: "District full name", value: supplier.districtMaster?.districtName ?? supplier.district },
        { label: "Phone number", value: supplier.user?.mobile_no ?? supplier.mobile_no },
        { label: "Email", value: supplier.user?.email ?? supplier.email },
        { label: "ODOP Product category", value: supplier.productCategory?.name },
        { label: "Registered Address", value: supplier.registered_address ?? supplier.address },
        { label: "Full name", value: supplier.user?.name ?? supplier.name },
        { label: "Proprietor/Director Name", value: supplier.proprietor_director_name },
        { label: "PAN Number", value: supplier.pan_number },
        { label: "Accepts Bulk Orders", value: supplier.bulk_order === true || String(supplier.bulk_order) === "true" ? "Yes" : "No" },
        { label: "GST", value: supplier.gst_number },
        { label: "Udyam registration", value: supplier.udyam_registration },
        { label: "Website", value: supplier.website },
      ]}
    />
  );
}
