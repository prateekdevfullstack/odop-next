"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  resolveSuccessStoryProfileImage,
  type PublicSuccessStory,
} from "@/lib/success-stories";
import {
  SuccessStoryListModal,
  type SuccessStory,
} from "@/app/(public)/knowledge-base/success-story/SuccessStoryListModal";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { useLanguage } from "@/hooks/useLanguage";
import CapsuleHeading from "../shared/CapsuleHeading";

const AUTOPLAY_MS = 6000;

type SuccessStoriesSectionProps = {
  stories: PublicSuccessStory[];
};

function toModalStory(story: PublicSuccessStory): SuccessStory {
  return {
    id: story.id,
    name: story.name,
    businessName: story.businessName,
    shortDescription: story.shortDescription,
    fullStory: story.fullStory,
    profileImage: story.profileImage,
    city: story.city
      ? {
          id: story.city.id,
          districtName: story.city.districtName,
          state_id: story.city.state_id ?? 0,
          status: story.city.status ?? 0,
        }
      : undefined,
    state: story.state
      ? {
          id: story.state.id,
          name: story.state.name,
          code: story.state.code ?? "",
          status: story.state.status ?? 0,
        }
      : undefined,
  };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getStoryExcerpt(story: PublicSuccessStory): string {
  const raw = story.shortDescription?.trim() || story.fullStory?.trim() || "";
  return stripHtml(raw);
}

function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setCount(1);
      else if (width < 900) setCount(2);
      else if (width < 1200) setCount(3);
      else setCount(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function StoryCard({
  story,
  onSelect,
}: {
  story: PublicSuccessStory;
  onSelect: (story: PublicSuccessStory) => void;
}) {
  const excerpt = getStoryExcerpt(story);
  const [imageSrc, setImageSrc] = useState(() =>
    resolveSuccessStoryProfileImage(story.profileImage),
  );

  return (
    <article className="hss-card">
      <button
        type="button"
        className="hss-card__click"
        onClick={() => onSelect(story)}
        aria-label={`Read story: ${story.name}`}
      >
        <div className="hss-card__media">
          <Image
            src={imageSrc}
            alt={story.name}
            width={480}
            height={360}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL.light}
            className="hss-card__img"
            onError={() => setImageSrc("/assets/img/placeholder.jpg")}
          />
        </div>

        <div className="hss-card__body">
          {excerpt ? <p className="hss-card__excerpt">{excerpt}</p> : null}
          <div className="hss-card__attribution">
            <p className="hss-card__name">{story.name}</p>
            {story.businessName ? (
              <p className="hss-card__business">{story.businessName}</p>
            ) : null}
          </div>
        </div>
      </button>
    </article>
  );
}

/** Home success stories — Figma node 671:3414; data from `/api/public/success-stories`. */
export default function SuccessStoriesSection({ stories }: SuccessStoriesSectionProps) {
  const isHi = useLanguage() === "hi";
  const visibleCount = useVisibleCount();
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedStory, setSelectedStory] = useState<PublicSuccessStory | null>(null);

  const pages = useMemo(() => {
    const chunks: PublicSuccessStory[][] = [];
    for (let i = 0; i < stories.length; i += visibleCount) {
      chunks.push(stories.slice(i, i + visibleCount));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [stories, visibleCount]);

  const pageCount = pages.length;
  const needsCarousel = pageCount > 1;
  const showPager = needsCarousel;

  const goNext = useCallback(() => {
    setPage((current) => (current + 1) % pageCount);
  }, [pageCount]);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, pageCount - 1)));
  }, [pageCount, visibleCount]);

  useEffect(() => {
    if (!showPager || paused) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [showPager, paused, goNext]);

  useScrollReveal();

  if (stories.length === 0) return null;

  return (
    <section id="success-stories" className="hss-section" aria-label={isHi ? "सफलता की कहानियां" : "Success Stories"}>
      <div className="container hss-inner">
        {/* <div className="hss-heading-pill reveal">
          <span className="hss-heading-text">{isHi ? "सफलता की कहानियां" : "Success Stories"}</span>
        </div> */}

        <CapsuleHeading reveal className="mb-20">
        {isHi ? "सफलता की कहानियां" : "Success Stories"}
        </CapsuleHeading>

        <div
          className="hss-carousel"
          aria-roledescription={showPager ? "carousel" : undefined}
          aria-label="Entrepreneur success stories"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <div className="hss-carousel-viewport">
            {pages.map((pageStories, pageIndex) => (
              <div
                key={pageIndex}
                className={`hss-carousel-slide${pageIndex === page ? " is-active" : ""}`}
                aria-hidden={pageIndex !== page}
              >
                <div
                  className="hss-grid"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(visibleCount, pageStories.length)}, minmax(0, 1fr))`,
                  }}
                >
                  {pageStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onSelect={setSelectedStory}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showPager && (
          <div className="hss-pager">
            <div className="hss-dots" role="tablist" aria-label="Success story pages">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === page}
                  aria-label={`Go to page ${index + 1} of ${pageCount}`}
                  className={`hss-dot${index === page ? " is-active" : ""}`}
                  onClick={() => setPage(index)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="hss-footer reveal">
          <Link href="/knowledge-base/success-story" className="hss-view-all">
            {isHi ? "सभी देखें" : "View All"}
          </Link>
        </div>

      </div>

      <SuccessStoryListModal
        story={selectedStory ? toModalStory(selectedStory) : null}
        onClose={() => setSelectedStory(null)}
      />

      <style>{`
        .hss-section {
          scroll-margin-top: 140px;
          background: #f3f4f6;
          padding: clamp(36px, 5vw, 56px) 0 clamp(32px, 4vw, 48px);
        }

        .hss-inner {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(20px, 3.5vw, 32px);
        }

        .hss-heading-pill {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: clamp(14px, 2vw, 20px) clamp(24px, 4vw, 40px);
          background: #8A231C;
          border: 1px solid rgba(179, 84, 0, 0.08);
          border-radius: 1000px;
          box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
        }

        .hss-heading-text {
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: 26px;
          line-height: 135%;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #ffffff;
          text-align: center;
        }

        .hss-carousel {
          width: 100%;
        }

        .hss-carousel-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .hss-carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .hss-carousel-slide.is-active {
          position: relative;
          inset: auto;
          opacity: 1;
          pointer-events: auto;
        }

        .hss-grid {
          display: grid;
          gap: clamp(14px, 2vw, 20px);
          width: 100%;
          align-items: stretch;
        }

        .hss-card {
          min-width: 0;
          height: 100%;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .hss-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
        }

        .hss-card__click {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .hss-card__media {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #e5e7eb;
          overflow: hidden;
          border-radius: 16px 16px 0 0;
        }

        .hss-card__media .hss-card__img {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          object-fit: cover;
          object-position: center top;
        }

        .hss-card__body {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 12px;
          padding: 16px 18px 18px;
          min-height: 0;
        }

        .hss-card__excerpt {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 0.82rem;
          line-height: 1.65;
          color: #4b5563;
          text-align: left;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hss-card__attribution {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          margin-top: 4px;
          text-align: right;
        }

        .hss-card__name {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.35;
          color: #111827;
        }

        .hss-card__business {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 0.78rem;
          font-weight: 400;
          line-height: 1.45;
          color: #9ca3af;
        }

        .hss-pager {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 2;
        }

        .hss-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .hss-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border-radius: 999px;
          cursor: pointer;
          background: #cccccc;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .hss-dot.is-active {
          background: #666666;
          width: 35px;
        }

        .hss-dot:hover:not(.is-active) {
         background: #666666;
        }

        .hss-footer {
          display: flex;
          justify-content: center;
          margin: 0;
          padding: 0;
        }

        .hss-view-all {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
          padding: 12px 32px;
          border-radius: 999px;
          background: #808080;
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .hss-view-all:hover {
          background: #666666;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .hss-section {
            padding: 32px 0 40px;
          }

          .hss-inner {
            gap: 16px;
          }

          .hss-heading-pill {
            padding: 18px 24px;
          }

          .hss-heading-text {
            font-size: 20px;
          }

          .hss-card__body {
            min-height: 0;
          }

          .hss-card__excerpt {
            -webkit-line-clamp: 3;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hss-carousel-slide {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
