import type { Metadata } from "next";
import { fetchHamaraPradeshDistricts } from "@/services/hamara-pradesh.service";
import { DocumentaryList } from "./DocumentaryList";
import { decrypt128 } from "@/lib/api";
import { Suspense } from "react";
import DocumentarySkeleton from "@/bones/DocumentarySkeleton";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "वृत्तचित्र | ज्ञान आधार | ओडीओपी पोर्टल",
      description: "एक जिला एक उत्पाद कार्यक्रम के ओडीओपी वृत्तचित्र फिल्में और वीडियो प्रलेखन।",
    };
  }
  return {
    title: "Documentary | Knowledge Base | ODOP Portal",
    description: "ODOP documentary films and video documentation of the One District One Product programme.",
  };
}

async function getHamaraPradeshDistricts() {
  try {
    const response = await fetchHamaraPradeshDistricts();
    let decryptedData: any = await decrypt128((response.data as any).body);
    return decryptedData?.data?.district || [];
  } catch (error) {
    console.error("Error fetching documentaries:", error);
    return [];
  }
}

async function DocumentaryContent() {
  const documentaries = await getHamaraPradeshDistricts();
  return (
    <BoneyardSkeleton name="documentaries" loading={false}>
      <DocumentaryList documentaries={documentaries} />
    </BoneyardSkeleton>
  );
}

export default async function DocumentaryPage() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <main className="main-content schemes-page kb-ss-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "वृत्तचित्र" : "Documentary"}
      />

      <div className="container">
        <div className="kb-capsule-heading-wrap">
          <h1 className="resource-heading-common">
            {isHi ? "वृत्तचित्र" : "Documentary"}
          </h1>
        </div>

        <Suspense fallback={<DocumentarySkeleton />}>
          <DocumentaryContent />
        </Suspense>
      </div>
    </main>
  );
}
