import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CfcEventImageGallery from "@/components/cfc/CfcEventImageGallery";
import PageBanner from "@/components/shared/PageBanner";
import ActionButton from "@/components/shared/ActionButton";
import {
  formatCfcEventDate,
  getEventCoverImage,
  getEventDescription,
} from "@/lib/cfc/events";
import {
  cfcGalleryPath,
  cfcPublicDetailPath,
  cfcPublicListPath,
} from "@/lib/cfc/routes";
import { getLanguageServer } from "@/lib/language";
import { getPublicCfcEventDetail } from "@/services/public-cfc.service";
import "@/styles/cfc-list.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  try {
    const event = await getPublicCfcEventDetail(eventId);
    if (!event) return { title: isHi ? "सीएफसी घटना | ओडीओपी" : "CFC Event | ODOP" };
    return {
      title: isHi
        ? `${event.event_name} | सीएफसी घटना | ओडीओपी`
        : `${event.event_name} | CFC Event | ODOP`,
      description: getEventDescription(event) || `CFC event on ${event.event_date}.`,
    };
  } catch {
    return { title: isHi ? "सीएफसी घटना | ओडीओपी" : "CFC Event | ODOP" };
  }
}

export default async function CfcEventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  let event: Awaited<ReturnType<typeof getPublicCfcEventDetail>> = null;
  try {
    event = await getPublicCfcEventDetail(eventId);
  } catch {
    return notFound();
  }

  if (!event) return notFound();

  const description = getEventDescription(event);
  const cfcName = event.cfc?.name ?? event.cfc?.city?.districtName ?? "";
  const cover = getEventCoverImage(event);
  const hasGalleryImages = (event.images ?? []).some((img) => img.image?.trim());

  return (
    <div className="cfc-detail-page-wrapper">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "सीएफसी गैलरी" : "CFC Gallery"}
        current={isHi ? "घटना विवरण" : "Event Details"}
      />

      <main className="cfc-page section">
        <div className="container">
          <div className="cfc-event-detail">
            <div className="cfc-event-detail__hero">
              <Image
                src={cover}
                alt={event.event_name}
                width={1200}
                height={560}
                priority
                sizes="100vw"
                className="cfc-event-detail__cover"
              />
            </div>

            <div className="cfc-event-detail__content">
              <div className="cfc-event-detail__head">
                <div>
                  {cfcName ? <span className="cfc-event-detail__cfc">{cfcName}</span> : null}
                  <h1>{event.event_name}</h1>
                  <time className="cfc-event-detail__date" dateTime={event.event_date}>
                    {formatCfcEventDate(event.event_date, isHi)}
                  </time>
                </div>
                <div className="cfc-event-detail__actions">
                  {event.cfc_id ? (
                    <ActionButton href={cfcPublicDetailPath(event.cfc_id)} variant="neutral">
                      {isHi ? "सीएफसी विवरण" : "CFC Details"}
                    </ActionButton>
                  ) : null}
                  <ActionButton
                    href={event.cfc_id ? cfcGalleryPath(event.cfc_id) : cfcGalleryPath()}
                    variant="primary"
                  >
                    {isHi ? "सभी घटनाएं" : "All Events"}
                  </ActionButton>
                </div>
              </div>

              {description ? (
                <section className="cfc-section cfc-event-detail__description">
                  <h2>{isHi ? "विवरण" : "Description"}</h2>
                  <p>{description}</p>
                </section>
              ) : null}

              {hasGalleryImages ? (
                <section className="cfc-section cfc-event-detail__gallery">
                  <h2>{isHi ? "छवि गैलरी" : "Image Gallery"}</h2>
                  <CfcEventImageGallery images={event.images ?? []} eventName={event.event_name} />
                </section>
              ) : null}

              <div className="cfc-event-detail__footer-links">
                <Link href={cfcPublicListPath()}>{isHi ? "← सीएफसी सूची" : "← CFC List"}</Link>
                <Link href={cfcGalleryPath(event.cfc_id)}>{isHi ? "गैलरी देखें →" : "View Gallery →"}</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
