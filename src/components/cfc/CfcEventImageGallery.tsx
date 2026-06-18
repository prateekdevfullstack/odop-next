"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { resolveCfcUploadUrl } from "@/lib/cfc/media";
import type { CfcEventImage } from "@/types/cfc-portal";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

type CfcEventImageGalleryProps = {
  images: CfcEventImage[];
  eventName: string;
};

export default function CfcEventImageGallery({ images, eventName }: CfcEventImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const urls = images
    .map((img) => resolveCfcUploadUrl(img.image))
    .filter(Boolean);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null || urls.length === 0) return current;
      return (current - 1 + urls.length) % urls.length;
    });
  }, [urls.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null || urls.length === 0) return current;
      return (current + 1) % urls.length;
    });
  }, [urls.length]);

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, showNext, showPrev]);

  if (!urls.length) {
    return null;
  }

  return (
    <>
      <div className="cfc-event-gallery-grid">
        {urls.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            className="cfc-event-gallery-thumb"
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1} of ${urls.length}`}
          >
            <Image
              src={src}
              alt={`${eventName} — image ${index + 1}`}
              width={320}
              height={220}
              sizes="(max-width: 640px) 50vw, 25vw"
              className="cfc-event-gallery-thumb__image"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL.light}
            />
          </button>
        ))}
      </div>

      {activeIndex != null ? (
        <div className="cfc-event-lightbox" role="dialog" aria-modal="true" aria-label="Event image gallery">
          <button type="button" className="cfc-event-lightbox__close" onClick={close} aria-label="Close gallery">
            <FaTimes />
          </button>
          {urls.length > 1 ? (
            <>
              <button type="button" className="cfc-event-lightbox__nav cfc-event-lightbox__nav--prev" onClick={showPrev} aria-label="Previous image">
                <FaChevronLeft />
              </button>
              <button type="button" className="cfc-event-lightbox__nav cfc-event-lightbox__nav--next" onClick={showNext} aria-label="Next image">
                <FaChevronRight />
              </button>
            </>
          ) : null}
          <div className="cfc-event-lightbox__stage">
            <Image
              src={urls[activeIndex]}
              alt={`${eventName} — image ${activeIndex + 1}`}
              width={1200}
              height={800}
              sizes="100vw"
              className="cfc-event-lightbox__image"
              priority
            />
          </div>
          {urls.length > 1 ? (
            <p className="cfc-event-lightbox__counter">
              {activeIndex + 1} / {urls.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
