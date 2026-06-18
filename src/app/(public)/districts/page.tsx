import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import DistrictList from "./DistrictList";
import { getPublicDistrictCards } from "@/services/districts.service";
import DistrictsListSkeleton from "@/bones/DistrictsListSkeleton";
import Breadcrumb from "@/components/shared/Breadcrumb";
import T from "@/components/shared/T";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "District Wise Products | ODOP Portal",
  description:
    "District wise ODOP products. Browse all 75 districts with primary, secondary and tertiary products.",
};

async function getDistricts() {
  try {
    return await getPublicDistrictCards(
      {
        page: 1,
        limit: 100,
        sort_by: "district_name",
        sort_order: "asc",
      },
      { cache: "no-store" }
    );
  } catch (error) {
    console.error("Error fetching districts:", error);
    return {
      items: [],
      districts: [],
      meta: { current_page: 1, last_page: 1, per_page: 100, total: 0 },
    };
  }
}

async function DistrictsContent() {
  const { items, meta } = await getDistricts();
  return <DistrictList initialItems={items} initialMeta={meta} />;
}

export default function DistrictsPage() {
  return (
    <main className="main-content district-products-page">
      <section className="district-products-intrinsic-banner" style={{ height: 260 }}>
        <Image
          src="/assets/img/banner/district_banner_image.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="district-products-intrinsic-banner-image"
        />
        <div className="district-products-intrinsic-banner-overlay" />
        <div className="district-products-intrinsic-banner-content">
          <h1 className="media-heading"><T en="ODOP Products" hi="ओडीओपी उत्पाद" /></h1>
          <Breadcrumb en="ODOP Products" hi="ओडीओपी उत्पाद" />
        </div>
      </section>

      <Suspense fallback={<DistrictsListSkeleton />}>
        <DistrictsContent />
      </Suspense>
    </main>
  );
}
