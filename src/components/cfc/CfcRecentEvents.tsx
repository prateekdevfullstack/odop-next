import Link from "next/link";
import Image from "next/image";
import ActionButton from "@/components/shared/ActionButton";
import { formatCfcEventDate, getEventCoverImage, sortCfcEventsDesc } from "@/lib/cfc/events";
import { cfcGalleryPath, cfcPublicEventDetailPath } from "@/lib/cfc/routes";
import { listPublicCfcEvents } from "@/services/public-cfc.service";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

type CfcRecentEventsProps = {
  cfcId: string | number;
  cfcName: string;
  isHi: boolean;
  limit?: number;
};

export default async function CfcRecentEvents({
  cfcId,
  cfcName,
  isHi,
  limit = 4,
}: CfcRecentEventsProps) {
  let events: Awaited<ReturnType<typeof listPublicCfcEvents>>["items"] = [];

  try {
    const result = await listPublicCfcEvents({ cfc_id: cfcId, page: 1, limit: Math.max(limit, 5) });
    events = sortCfcEventsDesc(result.items).slice(0, limit);
  } catch {
    events = [];
  }

  if (events.length === 0) return null;

  return (
    <section className="cfc-section cfc-recent-events">
      <div className="cfc-recent-events__head">
        <div>
          <h2>{isHi ? "हाल की घटनाएं" : "Recent Events"}</h2>
          <p className="cfc-section-note">
            {isHi
              ? `${cfcName} द्वारा आयोजित नवीनतम गतिविधियां और कार्यक्रम।`
              : `Latest activities and programmes hosted by ${cfcName}.`}
          </p>
        </div>
        <ActionButton href={cfcGalleryPath(cfcId)} variant="neutral">
          {isHi ? "सभी घटनाएं देखें" : "View All Events"}
        </ActionButton>
      </div>

      <div className="cfc-recent-events__grid">
        {events.map((event) => (
            <Link
              key={event.id}
              href={cfcPublicEventDetailPath(event.id)}
              className="cfc-recent-events__card"
            >
              <div className="cfc-recent-events__thumb">
                <Image
                  src={getEventCoverImage(event)}
                  alt={event.event_name}
                  width={280}
                  height={180}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                />
              </div>
              <div className="cfc-recent-events__copy">
                <strong>{event.event_name}</strong>
                <time dateTime={event.event_date}>{formatCfcEventDate(event.event_date, isHi)}</time>
                <span>{isHi ? "विवरण देखें" : "View Details"}</span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
