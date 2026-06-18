import Image from "next/image";
import Link from "next/link";
import ActionButton from "@/components/shared/ActionButton";
import {
  formatCfcEventDate,
  getEventCoverImage,
  getEventDescription,
} from "@/lib/cfc/events";
import { cfcPublicEventDetailPath } from "@/lib/cfc/routes";
import type { CfcEvent } from "@/types/cfc-portal";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

type CfcEventCardProps = {
  event: CfcEvent;
  isHi?: boolean;
  variant?: "gallery" | "compact";
};

export default function CfcEventCard({ event, isHi = false, variant = "gallery" }: CfcEventCardProps) {
  const cover = getEventCoverImage(event);
  const description = getEventDescription(event);
  const cfcLabel = event.cfc?.name ?? event.cfc?.city?.districtName ?? "";

  return (
    <article className={`cfc-event-card cfc-event-card--${variant}`}>
      <Link href={cfcPublicEventDetailPath(event.id)} className="cfc-event-card__media">
        <Image
          src={cover}
          alt={event.event_name}
          width={480}
          height={320}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="cfc-event-card__image"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL.light}
        />
      </Link>
      <div className="cfc-event-card__body">
        {cfcLabel ? <span className="cfc-event-card__meta">{cfcLabel}</span> : null}
        <h3 className="cfc-event-card__title">
          <Link href={cfcPublicEventDetailPath(event.id)}>{event.event_name}</Link>
        </h3>
        <time className="cfc-event-card__date" dateTime={event.event_date}>
          {formatCfcEventDate(event.event_date, isHi)}
        </time>
        {description && variant === "gallery" ? (
          <p className="cfc-event-card__description">{description}</p>
        ) : null}
        <ActionButton href={cfcPublicEventDetailPath(event.id)} variant="primary">
          {isHi ? "विवरण देखें" : "View Details"}
        </ActionButton>
      </div>
    </article>
  );
}
