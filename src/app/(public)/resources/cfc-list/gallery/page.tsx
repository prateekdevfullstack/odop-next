import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CfcEventCard from "@/components/cfc/CfcEventCard";
import PageBanner from "@/components/shared/PageBanner";
import Pagination from "@/components/shared/Pagination";
import { sortCfcEventsDesc } from "@/lib/cfc/events";
import { cfcPublicDetailPath, cfcPublicListPath } from "@/lib/cfc/routes";
import { getLanguageServer } from "@/lib/language";
import { localizePathname } from "@/lib/locale";
import { listPublicCfcEvents } from "@/services/public-cfc.service";
import "@/styles/cfc-list.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  return {
    title: isHi ? "सीएफसी गैलरी | ओडीओपी" : "CFC Gallery | ODOP",
    description: isHi
      ? "सभी सीएफसी कार्यक्रमों, गतिविधियों और छवियों की गैलरी देखें।"
      : "Browse all CFC events, activities, and photo galleries.",
  };
}

async function CfcGalleryContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cfc_id?: string; q?: string }>;
}) {
  const [params, lang] = await Promise.all([searchParams, getLanguageServer()]);
  const isHi = lang === "hi";
  const page = Math.max(1, Number(params.page) || 1);
  const cfcId = params.cfc_id?.trim() || undefined;
  const search = params.q?.trim() || undefined;
  const limit = 12;

  let events: Awaited<ReturnType<typeof listPublicCfcEvents>>["items"] = [];
  let totalPages = 1;

  try {
    const result = await listPublicCfcEvents({
      cfc_id: cfcId,
      page,
      limit,
      search,
    });
    events = sortCfcEventsDesc(result.items);
    totalPages = Math.max(1, result.meta.last_page);
  } catch {
    events = [];
  }

  const baseUrl = localizePathname("/resources/cfc-list/gallery", isHi ? "hi" : "en");

  return (
    <main className="cfc-page section">
      <div className="container">
        {cfcId ? (
          <p className="cfc-gallery-filter-note">
            {isHi ? "फ़िल्टर किया गया सीएफसी: " : "Filtered by CFC: "}
            <span>{events[0]?.cfc?.name ?? events[0]?.cfc?.city?.districtName ?? cfcId}</span>
            {" · "}
            <Link href={baseUrl}>{isHi ? "सभी घटनाएं" : "All events"}</Link>
          </p>
        ) : null}

        {events.length === 0 ? (
          <div className="cfc-gallery-empty">
            <p>{isHi ? "कोई घटना नहीं मिली।" : "No events found."}</p>
            <Link href={cfcPublicListPath()} className="cfc-pdf-btn">
              {isHi ? "सीएफसी सूची पर वापस जाएं" : "Back to CFC List"}
            </Link>
          </div>
        ) : (
          <>
            <div className="cfc-event-gallery-grid">
              {events.map((event) => (
                <CfcEventCard key={event.id} event={event} isHi={isHi} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={baseUrl}
              searchParams={params}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default async function CfcGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cfc_id?: string; q?: string }>;
}) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <div className="cfc-detail-page-wrapper">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "नॉलेज हब" : "Knowledge Hub"}
        current={isHi ? "सीएफसी गैलरी" : "CFC Gallery"}
      />

      <div className="container">
        <div className="cfc-capsule-heading-wrap">
          <h1 className="resource-heading-common">{isHi ? "सीएफसी गैलरी" : "CFC Gallery"}</h1>
          <p className="cfc-gallery-intro">
            {isHi
              ? "सभी सामान्य सुविधा केंद्रों की घटनाओं, कार्यशालाओं और गतिविधियों की तस्वीरें और विवरण देखें।"
              : "Explore photos and details from events, workshops, and activities across Common Facility Centres."}
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="container cfc-gallery-loading">
            {isHi ? "गैलरी लोड हो रही है…" : "Loading gallery…"}
          </div>
        }
      >
        <CfcGalleryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
