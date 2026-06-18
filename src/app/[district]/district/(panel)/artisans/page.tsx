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
  districtAdminArtisanAddPath,
  districtAdminArtisanDetailPath,
  districtAdminArtisanEditPath,
  productCategoryQueryFromId,
} from "@/lib/district-admin/routes";
import { listDistrictArtisans } from "@/services/district-admin-artisan.service";
import { fetchProductCategoryOptions } from "@/services/district-admin-lookups.service";
import type { DistrictArtisan } from "@/types/district-admin";

function normalizeArtisanRows(artisans: DistrictArtisan[]): EntityListRow[] {
  return artisans.map((a) => ({
    id: a.id,
    name: a.user?.name ?? a.name ?? "",
    email: a.user?.email ?? a.email ?? "",
    mobile_no: a.user?.mobile_no ?? a.mobile_no ?? "",
    enterprise_name: a.enterprise_name ?? "",
    enterprise_type: a.enterprise_type,
    district: a.district,
    sector_category_name: a.category?.name,
    product_category_name: a.productCategory?.name,
    craft_specialization: a.category?.name,
    production_capacity: a.production_capacity ?? "",
    customized_order: a.customized_order ?? "",
    address: a.address,
    supplier_type: a.artisan_type,
    status: a.status,
  }));
}

export default function DistrictAdminArtisansPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const districtSlug = String(params.district ?? "");
  const productCategoryId = parseProductCategoryId(searchParams);
  const categoryQuery = productCategoryQueryFromId(productCategoryId);

  const [rows, setRows] = useState<EntityListRow[]>([]);
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
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await listDistrictArtisans({
        page,
        limit: 10,
        search: search || undefined,
        product_category_id: Number(productCategoryId),
      });
      setRows(normalizeArtisanRows(result.items));
      setLastPage(Math.max(1, result.meta.last_page));
    } catch {
      toast.error("Failed to load artisans.");
      setRows([]);
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

  if (!productCategoryId) {
    return <CategorySelectionPrompt title="Artisans" entityLabel="Artisan" />;
  }

  return (
    <EntityListTable
      title={categoryName ? `Artisans — ${categoryName}` : "Artisans"}
      subtitle=""
      rows={rows}
      loading={loading}
      search={searchInput}
      onSearchChange={setSearchInput}
      onSearchSubmit={(e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
      }}
      addHref={districtAdminArtisanAddPath(districtSlug, categoryQuery)}
      detailHref={(id) => districtAdminArtisanDetailPath(districtSlug, id, categoryQuery)}
      editHref={(id) => districtAdminArtisanEditPath(districtSlug, id, categoryQuery)}
      productCategoryId={productCategoryId}
      categoryId=""
      productCategories={productCategories}
      categories={[]}
      onProductCategoryChange={() => {}}
      onCategoryChange={() => {}}
      page={page}
      lastPage={lastPage}
      onPageChange={setPage}
      emptyTitle="No artisans yet"
      emptyDescription={`Add your first artisan for ${categoryName || "this category"}.`}
    />
  );
}
