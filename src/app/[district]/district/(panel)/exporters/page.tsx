"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CategorySelectionPrompt from "@/components/district-admin/CategorySelectionPrompt";
import EntityListTable, { type EntityListRow } from "@/components/district-admin/EntityListTable";
import {
  getProductCategoryName,
  parseProductCategoryId,
} from "@/lib/district-admin/category-nav";
import {
  districtAdminExporterAddPath,
  districtAdminExporterDetailPath,
  districtAdminExporterEditPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { listDistrictExporters } from "@/services/district-admin-exporter.service";
import { fetchProductCategoryOptions } from "@/services/district-admin-lookups.service";
import type { DistrictExporter } from "@/types/district-admin";

export default function DistrictAdminExportersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const productCategoryId = parseProductCategoryId(searchParams);
  const categoryQuery = productCategoryQueryFromId(productCategoryId);

  const [rawRows, setRawRows] = useState<DistrictExporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [productCategories, setProductCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        setProductCategories(await fetchProductCategoryOptions());
      } catch {
        /* optional */
      }
    })();
  }, []);

  const categoryName = getProductCategoryName(productCategories, productCategoryId);

  const load = useCallback(async () => {
    if (!productCategoryId) {
      setRawRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await listDistrictExporters({
        page,
        limit: 10,
        search: search || undefined,
        product_category_id: Number(productCategoryId),
      });
      setRawRows(result.items);
      setLastPage(Math.max(1, result.meta.last_page));
    } catch {
      toast.error("Failed to load exporters.");
      setRawRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, productCategoryId, search]);

  useEffect(() => {
    setPage(1);
    setSearch("");
    setSearchInput("");
  }, [productCategoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows: EntityListRow[] = rawRows.map((e) => ({
    id: e.id,
    name: e.user?.name ?? e.name ?? "",
    email: e.user?.email ?? e.email ?? "",
    email_id: e.email_id ?? e.email ?? "",
    mobile_no: e.user?.mobile_no ?? e.mobile_no ?? "",
    enterprise_name: e.export_company_name ?? e.enterprise_name ?? "",
    export_company_name: e.export_company_name ?? e.enterprise_name ?? "",
    district: e.districtMaster?.districtName ?? e.district ?? "",
    product_category_name: e.productCategory?.name,
    address: e.office_address ?? e.address ?? "",
    office_address: e.office_address ?? e.address ?? "",
    supplier_type: e.exporter_type,
    iec_number: e.iec_number,
    owner_director_name: e.owner_director_name,
    contact_person: e.contact_person,
    designation: e.designation,
    year_of_establishment: e.year_of_establishment ? String(e.year_of_establishment) : "",
    rcmc_details: e.rcmc_details,
    website: e.website,
  }));

  if (!productCategoryId) {
    return <CategorySelectionPrompt title="Exporters" entityLabel="Exporter" />;
  }

  return (
    <EntityListTable
      title={categoryName ? `Exporters — ${categoryName}` : "Exporters"}
      subtitle=""
      variant="exporter"
      rows={rows}
      loading={loading}
      search={searchInput}
      onSearchChange={setSearchInput}
      onSearchSubmit={(e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
      }}
      addHref={districtAdminExporterAddPath(districtSlug, categoryQuery)}
      detailHref={(id) => districtAdminExporterDetailPath(districtSlug, id, categoryQuery)}
      editHref={(id) => districtAdminExporterEditPath(districtSlug, id, categoryQuery)}
      productCategoryId={productCategoryId}
      categoryId=""
      productCategories={productCategories}
      categories={[]}
      onProductCategoryChange={() => {}}
      onCategoryChange={() => {}}
      page={page}
      lastPage={lastPage}
      onPageChange={setPage}
      emptyTitle="No exporters yet"
      emptyDescription={`Add your first exporter for ${categoryName || "this category"}.`}
    />
  );
}
