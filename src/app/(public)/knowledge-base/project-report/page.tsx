import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchProjectReports } from "@/services/project-report.service";
import { decrypt128, API_CONFIG } from "@/lib/api";
import Image from "next/image";
import ProjectReportSkeleton from "@/bones/ProjectReportSkeleton";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "परियोजना रिपोर्ट | ज्ञान आधार | ओडीओपी पोर्टल",
      description: "ओडीओपी ज्ञान आधार के अंतर्गत आधिकारिक कार्यक्रम रिपोर्ट, प्रभाव मूल्यांकन और निगरानी प्रकाशन।",
    };
  }
  return {
    title: "Project Report | Knowledge Base | ODOP Portal",
    description: "Official programme reports, impact assessments and monitoring publications under the ODOP Knowledge Base.",
  };
}

interface DecryptedReportData {
  data?: {
    project_reports?: Array<{
      id?: string;
      slug: string;
      name: string;
      title: string;
      hindi_title?: string | null;
      hindi_name?: string;
      thumbnail: string;
      short_description: string;
      hindi_thumbnail?: string;
      hindi_short_description?: string | null;
    }>;
  };
}

interface EncryptedReportsData {
  body: string;
}

async function DynamicProjectReports() {
  const reportsData = await fetchProjectReports();
  let decryptedData: DecryptedReportData | null = null;

  const dataObj = reportsData.data as EncryptedReportsData | null;
  if (reportsData.success && dataObj && typeof dataObj.body === "string") {
    try {
      decryptedData = await decrypt128(dataObj.body) as DecryptedReportData;
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  }

  if (!decryptedData?.data || !Array.isArray(decryptedData.data.project_reports)) {
    return null;
  }

  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <div className="kb-pr-grid" role="list">
      {decryptedData.data.project_reports.map((item) => {
        const title = isHi ? (item.hindi_title || item.title) : item.title;
        const name = isHi ? (item.hindi_name || item.name) : item.name;
        const shortDescription = isHi ? (item.hindi_short_description || item.short_description) : item.short_description;
        const thumbnail = isHi ? (item.hindi_thumbnail || item.thumbnail) : item.thumbnail;
        const linkHref = isHi 
          ? `/hi/knowledge-base/project-report/${item.slug}` 
          : `/knowledge-base/project-report/${item.slug}`;

        return (
          <article key={item.id || item.slug} className="kb-pr-card" role="listitem">
            <Link href={linkHref} className="kb-pr-card__link">
              <span className="kb-pr-card__district">{name}</span>
              <h3 className="kb-pr-card__title">{title}</h3>
              <div className="kb-pr-card__media">
                <Image
                  src={`${API_CONFIG.IMAGE_BASE_URL}${thumbnail}`}
                  alt={title || ""}
                  className="kb-pr-card__img"
                  width={640}
                  height={400}
                  loading="lazy"
                />
                <span className="kb-pr-card__action" aria-hidden="true">
                  <i className="fa-solid fa-angle-right" />
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export default async function ProjectReportPage() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  return (
    <main className="main-content schemes-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "परियोजना रिपोर्ट" : "Project Report"}
      />

      <div className="kb-pr-page">
        <div className="container">
          <div className="kb-capsule-heading-wrap">
            <h1 className="resource-heading-common">
              {lang === "hi" ? "उत्पाद डीएसआर" : "Product DSRs"}
            </h1>
          </div>

          <Suspense fallback={<ProjectReportSkeleton />}>
            <BoneyardSkeleton name="project-reports" loading={false}>
              <DynamicProjectReports />
            </BoneyardSkeleton>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
