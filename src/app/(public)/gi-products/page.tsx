import type { Metadata } from "next";
import "@/styles/gi-products.css";
import Image from "next/image";
import { Suspense } from "react";
import GIProductList from "./GIProductList";
import GIProductsListSkeleton from "@/bones/GIProductsListSkeleton";
import { getLanguageServer } from "@/lib/language";
import { fetchGIProducts } from "@/services/gi-products.service";
import Breadcrumb from "@/components/shared/Breadcrumb";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "भौगोलिक संकेत (जीआई) उत्पाद | ओडीओपी पोर्टल",
      description:
        "उत्तर प्रदेश के भौगोलिक संकेत (जीआई) उत्पादों की सूची देखें। पारंपरिक उद्योगों और हस्तशिल्प से जुड़े जीआई टैग प्राप्त उत्पाद।",
    };
  }
  return {
    title: "Geographical Indications (GI) Products | ODOP Portal",
    description:
      "Browse Geographical Indications (GI) products from Uttar Pradesh. Traditional industries and crafts with GI tag recognition.",
  };
}

async function getGIProducts() {
  try {
    return await fetchGIProducts({ limit: 100 }, { cache: "no-store" });
  } catch (error) {
    console.error("Error fetching GI products:", error);
    return [];
  }
}

async function GIProductsContent() {
  const products = await getGIProducts();
  return <GIProductList initialItems={products} />;
}

export default function GIProductsPage() {
  return (
    <main className="main-content gi-products-page">
      <section className="page-hero-section">
        <div className="page-hero-wrapper">
          <Image src="/assets/img/banner/district_dummy_img.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
          <div className="page-hero-overlay" style={{ background: "#866562", opacity: 0.45 }} />
          <div className="page-hero-content">
            <h1 className="page-hero-title">GI Products</h1>
            <Breadcrumb en="GI Products" hi="जीआई उत्पाद" />
          </div>
        </div>
      </section>

      <Suspense fallback={<GIProductsListSkeleton />}>
        <GIProductsContent />
      </Suspense>
    </main>
  );
}
