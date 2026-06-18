"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import EntityDetailView from "@/components/district-admin/EntityDetailView";
import LoadingState from "@/components/district-admin/LoadingState";
import { parseProductCategoryId } from "@/lib/district-admin/category-nav";
import {
  districtAdminExporterEditPath,
  districtAdminExportersPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { getDistrictExporter } from "@/services/district-admin-exporter.service";
import type { DistrictExporter } from "@/types/district-admin";

export default function DistrictExporterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const id = String(params.id ?? "");
  const urlCategoryId = parseProductCategoryId(searchParams);

  const [exporter, setExporter] = useState<DistrictExporter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDistrictExporter(id);
      if (!res.data) {
        toast.error("Exporter not found.");
        router.push(
          districtAdminExportersPath(
            districtSlug,
            productCategoryQueryFromId(urlCategoryId)
          )
        );
        return;
      }
      setExporter(res.data);
    } catch {
      toast.error("Failed to load exporter details.");
      router.push(
        districtAdminExportersPath(
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

  if (loading || !exporter) {
    return <LoadingState label="Loading exporter details…" />;
  }

  const categoryQuery = productCategoryQueryFromId(
    exporter.product_category_id ?? urlCategoryId
  );

  return (
    <EntityDetailView
      title={exporter.enterprise_name || exporter.name || "Exporter"}
      subtitle="Exporter profile details"
      logoUrl={null}
      editHref={districtAdminExporterEditPath(districtSlug, exporter.id, categoryQuery)}
      backHref={districtAdminExportersPath(districtSlug, categoryQuery)}
      fields={[
        { label: "Export Company name", value: exporter.export_company_name ?? exporter.enterprise_name },
        { label: "District full name", value: exporter.districtMaster?.districtName ?? exporter.district },
        { label: "Phone number", value: exporter.user?.mobile_no ?? exporter.mobile_no },
        { label: "Email", value: exporter.user?.email ?? exporter.email },
        { label: "ODOP Product category", value: exporter.productCategory?.name },
        { label: "Office Address", value: exporter.office_address ?? exporter.address },
        { label: "Full name", value: exporter.user?.name ?? exporter.name },
        { label: "Exporter type", value: exporter.exporter_type },
        { label: "IEC Number", value: exporter.iec_number },
        { label: "Owner/Director Name", value: exporter.owner_director_name },
        { label: "RCMC Details", value: exporter.rcmc_details },
        { label: "Year of Establishment", value: exporter.year_of_establishment },
        { label: "Designation", value: exporter.designation },
        { label: "Contact person", value: exporter.contact_person },
        { label: "Website", value: exporter.website },
      ]}
    />
  );
}
