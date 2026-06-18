"use client";

import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchKnowledgeHubScroll } from "@/services/content.service";
import type { KnowledgeHubScrollItem } from "@/lib/api/knowledge-hub-scroll.types";

import "swiper/css";
import CapsuleHeading from "../shared/CapsuleHeading";
import KnowledgeHubCard from "./KnowledgeHubCard";

const AUTOPLAY_MS = 4500;

const SECTION_HEADING = {
  en: "Knowledge Hub",
  hi: "ज्ञान केंद्र",
};

const STATE_TEXT = {
  en: {
    error: "Unable to load Knowledge Hub resources right now. Please try again later.",
    empty: "No Knowledge Hub resources available yet.",
  },
  hi: {
    error: "ज्ञान केंद्र संसाधन अभी लोड नहीं हो सके। कृपया बाद में पुनः प्रयास करें।",
    empty: "अभी कोई ज्ञान केंद्र संसाधन उपलब्ध नहीं है।",
  },
};

export default function KnowledgeHubSection() {
  const lang = useLanguage();
  const [items, setItems] = useState<KnowledgeHubScrollItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchKnowledgeHubScroll({ skipAuth: true })
      .then(({ data }) => {
        if (cancelled) return;
        setItems(data?.data?.filter((item) => item.status === "ACTIVE") ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = items === null;

  return (
    <section id="knowledge-hub" className="kh-section" aria-label={SECTION_HEADING[lang]}>
      <div className="container kh-heading-wrap">
        <CapsuleHeading reveal className="mb-20">
          {SECTION_HEADING[lang]}
        </CapsuleHeading>
      </div>

      <div className="kh-carousel-bleed">
        <div className="kh-carousel-shell reveal">
          {isLoading ? (
            <div className="kh-status-row" aria-busy="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="kh-card-skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : error ? (
            <p className="kh-status-message kh-status-message--error">{STATE_TEXT[lang].error}</p>
          ) : items.length === 0 ? (
            <p className="kh-status-message">{STATE_TEXT[lang].empty}</p>
          ) : (
            <Swiper
              className="kh-swiper swiper"
              modules={[Autoplay]}
              slidesPerView={1.15}
              spaceBetween={14}
              centeredSlides
              grabCursor
              rewind
              autoplay={{
                delay: AUTOPLAY_MS,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.25,
                  spaceBetween: 16,
                  centeredSlides: true,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 18,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                  centeredSlides: false,
                },
              }}
              aria-roledescription="carousel"
              aria-label="Official ODOP resources"
            >
              {items.map((item) => (
                <SwiperSlide key={item.id}>
                  <KnowledgeHubCard item={item} lang={lang} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <style>{`
        .kh-section {
          scroll-margin-top: 140px;
          background: transparent;
          padding: 0 0 clamp(36px, 6vw, 45px);
          overflow: hidden;
        }

        .kh-heading-wrap {
          margin-bottom: clamp(12px, 2vw, 20px);
        }

        .kh-carousel-bleed {
          width: 100%;
        }

        .kh-header {
          display: block;
        }

        .kh-heading-pill {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: clamp(12px, 2vw, 22px) clamp(20px, 4vw, 40px);
          background: #8A231C;
          border: 1px solid rgba(179, 84, 0, 0.08);
          border-radius: 1000px;
          box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
        }

        .kh-heading-text {
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: clamp(1rem, 2.2vw, 1.625rem);
          line-height: 135%;
          text-transform: uppercase;
          color: #ffffff;
          text-align: center;
        }

        .kh-carousel-shell {
          width: 100%;
          overflow: hidden;
          padding: 6px var(--container-px) 18px;
          background: transparent;
        }

        .kh-swiper {
          width: 100%;
          overflow: visible;
        }

        .kh-swiper .swiper-wrapper {
          align-items: stretch;
          margin: 10px;
        }

        .kh-swiper .swiper-slide {
          height: auto;
        }

        .kh-status-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }

        .kh-card-skeleton {
          height: 375px;
          min-height: 375px;
          border-radius: 21.3px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: kh-skeleton-pulse 1.4s ease infinite;
        }

        @keyframes kh-skeleton-pulse {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        .kh-status-message {
          margin: 0;
          padding: 48px 16px;
          text-align: center;
          font-family: var(--font-body, "Inter", sans-serif);
          font-size: 1rem;
          color: #6b7280;
        }

        .kh-status-message--error {
          color: #8A231C;
        }

        .kh-card {
          display: block;
          min-width: 0;
          height: 375px;
          min-height: 375px;
          background: #ffffff;
          border: 0.89px solid #ADB5BD;
          border-radius: 21.3px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 14px 40px rgba(15, 23, 42, 0.1);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          isolation: isolate;
        }

        .kh-card.reveal:hover {
          transform: translateY(-0px);
          border-color: rgba(138, 35, 28, 0.18);
          box-shadow: 0 22px 52px rgba(15, 23, 42, 0.16);
        }

        .kh-card-thumb {
          position: relative;
          width: 100%;
          height: 100%;
          background: #ffffff;
          container-type: inline-size;
        }

        .kh-card-bg {
          object-fit: cover;
          object-position: top center;
          z-index: 0;
          transition: transform 0.28s ease, filter 0.28s ease;
        }

        .kh-card-content {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14cqw 6cqw 0;
          text-align: center;
          pointer-events: none;
        }

        .kh-card-logo {
          width: 52cqw;
          line-height: 0;
        }

        .kh-card-logo img {
          width: 100%;
          height: auto;
        }

        .kh-card-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 6cqw;
          color: #1955c4;
          font-family: var(--font-heading, sans-serif);
          font-weight: 800;
          line-height: 1.2;
          white-space: pre-line;
        }

        .kh-card-title-prefix {
          font-size: 6cqw;
          margin-bottom: 1cqw;
        }

        .kh-card-title-main {
          font-size: 10.5cqw;
        }

        .kh-card-title--compact .kh-card-title-prefix {
          font-size: 10.5cqw;
        }

        .kh-card-title--compact .kh-card-title-main {
          font-size: calc(10.5cqw - 10px);
        }

        .kh-card-divider {
          position: relative;
          width: 40cqw;
          aspect-ratio: 1466 / 277;
          margin-top: 5cqw;
        }

        .kh-card-divider img {
          object-fit: contain;
        }

        .kh-card-department {
          margin: 4cqw 0 0;
          font-family: var(--font-body, "Inter", sans-serif);
          font-size: 4cqw;
          line-height: 1.5;
          color: #4b5563;
          white-space: pre-line;
          font-weight: 600;
        }

        .kh-card-subtitle {
          margin: 2cqw 0 0;
          font-family: var(--font-body, "Inter", sans-serif);
          font-size: calc(10.5cqw - 10px);
          line-height: 1.5;
          color: #1955c4;
          white-space: pre-line;
          font-weight: 800;
        }

        .kh-card:hover .kh-card-bg {
          transform: scale(1.018);
          filter: saturate(1.03) contrast(1.02);
        }

        .kh-card-overlay {
            position: absolute;
            left: 50%;
            bottom: 16px;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            width: 65%;
            padding: 6px 6px 6px 18px;
            border: 1px solid rgba(255, 255, 255, 0.72);
            border-radius: 999px;
            background: rgb(126 25 18);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 0px 16px rgb(78 78 78 / 16%);
            transform: translateX(-50%);
            transition: background 0.24s ease, transform 0.24s ease;
        }
        
        .kh-card-overlay:hover {
           background-color:#6b0a03;
        }

        .kh-card-link-pill {
            font-family: "Montserrat", sans-serif;
            font-weight: 600;
            font-size: 12px;
            line-height: normal;
            color: #ffffff;
            text-transform: uppercase;
        }

        .kh-card-link-pill svg {
          width: 10px;
          height: 10px;
          color: #8A231C;
        }

        .kh-card-action {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            /* background: linear-gradient(135deg, #8A231C, #bd5b2d); */
            background: #f9c000;
            font-size: 0.92rem;
            box-shadow: 0 8px 18px rgba(138, 35, 28, 0.26);
        }
        .kh-card-action svg {
            color: #7e1912;
            font-size: 18px;
        }

        @media (max-width: 640px) {
          .kh-section {
            padding: clamp(28px, 7vw, 48px) 0;
          }

          .kh-heading-wrap {
            margin-bottom: clamp(16px, 5vw, 24px);
          }

          .kh-heading-text {
            font-size: clamp(0.9rem, 4vw, 1.25rem);
          }

          .kh-card-overlay {
            left: 50%;
            bottom: 12px;
            width: calc(100% - 20px);
            max-width: 198px;
            padding: 6px;
          }

          .kh-card-action {
            width: clamp(32px, 9vw, 36px);
            height: clamp(32px, 9vw, 36px);
            font-size: clamp(0.75rem, 3vw, 0.875rem);
          }

          .kh-card-link-pill {
            padding: 8px 10px;
            font-size: clamp(0.62rem, 2.7vw, 0.7rem);
          }
        }
      `}</style>
    </section>
  );
}
