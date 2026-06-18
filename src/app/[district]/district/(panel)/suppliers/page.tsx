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
  districtAdminSupplierAddPath,
  districtAdminSupplierDetailPath,
  districtAdminSupplierEditPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { listDistrictSuppliers } from "@/services/district-admin-supplier.service";
import { fetchProductCategoryOptions } from "@/services/district-admin-lookups.service";
import type { DistrictSupplier } from "@/types/district-admin";

export default function DistrictAdminSuppliersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const productCategoryId = parseProductCategoryId(searchParams);
  const categoryQuery = productCategoryQueryFromId(productCategoryId);

  const [rawRows, setRawRows] = useState<DistrictSupplier[]>([]);
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
      const result = await listDistrictSuppliers({
        page,
        limit: 10,
        search: search || undefined,
        product_category_id: Number(productCategoryId),
      });
      setRawRows(result.items);
      setLastPage(Math.max(1, result.meta.last_page));
    } catch {
      toast.error("Failed to load suppliers.");
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

  const rows: EntityListRow[] = rawRows.map((s) => ({
    id: s.id,
    name: s.user?.name ?? s.name ?? "",
    email: s.user?.email ?? s.email ?? "",
    mobile_no: s.user?.mobile_no ?? s.mobile_no ?? "",
    enterprise_name: s.enterprise_name ?? "",
    district: s.districtMaster?.districtName ?? s.district ?? "",
    product_category_name: s.productCategory?.name ?? s.product_category?.name,
    registered_address: s.registered_address ?? s.address ?? "",
    proprietor_director_name: s.proprietor_director_name ?? "",
    gst_number: s.gst_number ?? "",
    udyam_registration: s.udyam_registration ?? "",
    pan_number: s.pan_number ?? "",
    website: s.website ?? "",
    bulk_order: s.bulk_order,
  }));

  if (!productCategoryId) {
    return (
      <CategorySelectionPrompt title="Manufacturers" entityLabel="Manufacturer" />
    );
  }

  return (
    <EntityListTable
      title={categoryName ? `Manufacturers — ${categoryName}` : "Manufacturer & Wholesaler"}
      subtitle=""
      variant="supplier"
      rows={rows}
      loading={loading}
      search={searchInput}
      onSearchChange={setSearchInput}
      onSearchSubmit={(e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
      }}
      addHref={districtAdminSupplierAddPath(districtSlug, categoryQuery)}
      detailHref={(id) => districtAdminSupplierDetailPath(districtSlug, id, categoryQuery)}
      editHref={(id) => districtAdminSupplierEditPath(districtSlug, id, categoryQuery)}
      productCategoryId={productCategoryId}
      categoryId=""
      productCategories={productCategories}
      categories={[]}
      onProductCategoryChange={() => {}}
      onCategoryChange={() => {}}
      page={page}
      lastPage={lastPage}
      onPageChange={setPage}
      emptyTitle="No suppliers yet"
      emptyDescription={`Add your first manufacturer for ${categoryName || "this category"}.`}
    />
  );
}
