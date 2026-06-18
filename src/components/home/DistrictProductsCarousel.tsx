"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DistrictProductCard from "@/components/DistrictProductCard";
import DistrictExploreMoreCard from "@/components/home/DistrictExploreMoreCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/hooks/useLanguage";
import type { PublicDistrict } from "@/lib/api/districts.types";
import { mapPublicDistrictToCard } from "@/services/districts.service";

const CARDS_PER_PAGE = 7;

type DistrictProductsCarouselProps = {
  districts: PublicDistrict[];
};

export default function DistrictProductsCarousel({
  districts: rawDistricts,
}: DistrictProductsCarouselProps) {
  const lang = useLanguage();
  const isHi = lang === "hi";

  const districts = useMemo(
    () => rawDistricts.map((item) => mapPublicDistrictToCard(item, isHi)),
    [rawDistricts, isHi]
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [slidePhase, setSlidePhase] = useState<"idle" | "exit" | "enter">("idle");
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const pendingPageRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  const totalPages = Math.max(1, Math.ceil(districts.length / CARDS_PER_PAGE));

  const visibleDistricts = useMemo(() => {
    const start = pageIndex * CARDS_PER_PAGE;
    return districts.slice(start, start + CARDS_PER_PAGE);
  }, [districts, pageIndex]);

  useScrollReveal([pageIndex, slidePhase]);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const finishTransition = useCallback(() => {
    const nextPage = pendingPageRef.current;
    if (nextPage == null) return;
    pendingPageRef.current = null;
    setPageIndex(nextPage);
    setSlidePhase("enter");
    window.setTimeout(() => setSlidePhase("idle"), 20);
  }, []);

  const goToPage = useCallback(
    (targetPage: number, direction: "next" | "prev") => {
      if (targetPage === pageIndex || targetPage < 0 || targetPage >= totalPages) return;
      if (slidePhase !== "idle") return;

      if (reduceMotionRef.current) {
        setPageIndex(targetPage);
        return;
      }

      pendingPageRef.current = targetPage;
      setSlideDirection(direction);
      setSlidePhase("exit");
    },
    [pageIndex, slidePhase, totalPages]
  );

  const handlePrevPage = useCallback(() => {
    goToPage(pageIndex - 1, "prev");
  }, [goToPage, pageIndex]);

  const handleNextPage = useCallback(() => {
    goToPage(pageIndex + 1, "next");
  }, [goToPage, pageIndex]);

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform" && event.propertyName !== "opacity") return;
      if (slidePhase === "exit") {
        finishTransition();
      }
    },
    [finishTransition, slidePhase]
  );

  const slideClass =
    slidePhase === "exit"
      ? `dp-carousel-slide-host--exit-${slideDirection}`
      : slidePhase === "enter"
        ? `dp-carousel-slide-host--enter-${slideDirection}`
        : "";

  if (rawDistricts.length === 0) {
    return (
      <p className="dp-carousel-empty" role="status">
        {isHi
          ? "जिला उत्पाद इस समय उपलब्ध नहीं हैं। कृपया बाद में पुनः प्रयास करें।"
          : "District products are unavailable right now. Please try again later."}
      </p>
    );
  }

  return (
    <div className="dp-carousel">
      <div
        className="dp-carousel-grid"
        aria-label={
          isHi
            ? `जिला उत्पाद, पृष्ठ ${pageIndex + 1} / ${totalPages}`
            : `District products, page ${pageIndex + 1} of ${totalPages}`
        }
      >
        <div
          key={pageIndex}
          className={`dp-carousel-slide-host ${slideClass}`.trim()}
          aria-live="polite"
          aria-atomic="true"
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="dp-carousel-row1">
            {visibleDistricts.slice(0, 4).map((district, index) => (
              <DistrictProductCard
                key={district.id ?? district.slug}
                district={district}
                index={index}
                productLayout="bullets"
              />
            ))}
          </div>

          <div className="dp-carousel-row2-cards">
            {visibleDistricts.slice(4, 7).map((district, index) => (
              <DistrictProductCard
                key={district.id ?? district.slug}
                district={district}
                index={index + 4}
                productLayout="bullets"
              />
            ))}
          </div>
        </div>

        <DistrictExploreMoreCard
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          navDisabled={slidePhase !== "idle"}
          isHi={isHi}
        />
      </div>

      <style>{`
        .dp-carousel {
          width: 100%;
          --dp-district-card-min-height: calc(210px + 54px + 116px + 24px);
        }

        .dp-carousel-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: auto auto;
          gap: clamp(16px, 2.2vw, 24px);
          align-items: stretch;
          overflow: hidden;
        }

        .dp-carousel-slide-host {
          display: grid;
          grid-template-columns: subgrid;
          grid-template-rows: subgrid;
          grid-column: 1 / -1;
          grid-row: 1 / -1;
          transition:
            transform 0.55s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.45s ease;
          will-change: transform, opacity;
        }

        .dp-carousel-slide-host--exit-next {
          transform: translateX(-28px);
          opacity: 0;
        }

        .dp-carousel-slide-host--exit-prev {
          transform: translateX(28px);
          opacity: 0;
        }

        .dp-carousel-slide-host--enter-next {
          transform: translateX(28px);
          opacity: 0;
        }

        .dp-carousel-slide-host--enter-prev {
          transform: translateX(-28px);
          opacity: 0;
        }

        .dp-carousel-row1 {
          grid-column: 1 / -1;
          grid-row: 1;
          display: grid;
          grid-template-columns: subgrid;
          align-items: stretch;
        }

        .dp-carousel-row1 > * {
          min-width: 0;
          height: 100%;
        }

        .dp-carousel-row2-cards {
          grid-column: 1 / 4;
          grid-row: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(16px, 2.2vw, 24px);
          align-items: stretch;
        }

        .dp-carousel-row2-cards > * {
          min-width: 0;
          height: 100%;
        }

        /* Explore-more card — Figma node 1227:6536 */
        .district-explore-card {
          position: relative;
          z-index: 2;
          grid-column: 4;
          grid-row: 2;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 0;
          width: 100%;
          padding: clamp(24px, 3.5vw, 32px) clamp(16px, 2.5vw, 22px);
          border: 1px solid #e8ebf0;
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 2px 14px rgba(18, 29, 48, 0.05);
          overflow: hidden;
        }

        .district-explore-card-dots {
          position: absolute;
          z-index: 0;
          width: clamp(72px, 12vw, 96px);
          height: clamp(72px, 12vw, 96px);
          pointer-events: none;
          object-fit: contain;
          filter: invert(0.85);
          opacity: 0.32;
        }

        .district-explore-card-dots--tr {
          top: -10px;
          right: -20px;
        }

        .district-explore-card-dots--bl {
          bottom: -10px;
          left: -20px;
        }

        .district-explore-card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(22px, 3.5vw, 30px);
          width: 100%;
        }

        .dp-carousel-empty {
          margin: 0;
          padding: 24px 16px;
          text-align: center;
          font-family: "Poppins", sans-serif;
          font-size: 0.95rem;
          color: #718096;
        }

        .district-explore-circle-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(28px, 5vw, 40px);
        }

        .district-explore-circle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .district-explore-circle-btn-ring {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(72px, 11vw, 80px);
          height: clamp(72px, 11vw, 80px);
          border-radius: 50%;
          background: #eceff3;
          transition: background 0.2s ease;
        }

        .district-explore-circle-btn-core {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(50px, 7.5vw, 56px);
          height: clamp(50px, 7.5vw, 56px);
          border-radius: 50%;
          background: #b0b4bc;
          color: #ffffff;
          transition: background 0.2s ease;
        }

        .district-explore-circle-btn svg {
          width: 1.1rem;
          height: 1.1rem;
        }

        .district-explore-circle-btn:hover:not(:disabled) .district-explore-circle-btn-core {
          background: #9ca3af;
        }

        .district-explore-circle-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .district-explore-circle-btn:active:not(:disabled) {
          transform: scale(0.96);
        }

        .district-explore-circle-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .district-explore-circle-btn:focus-visible {
          outline: 2px solid #b35400;
          outline-offset: 3px;
        }

        .district-explore-card-label {
          font-family: var(--font-heading, "Montserrat", sans-serif);
          font-size: clamp(0.92rem, 1.5vw, 1.05rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3d4551;
          text-align: center;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .district-explore-card-label:hover {
          color: #1a2540;
          transform: translateY(-1px);
        }

        .district-explore-card-label:focus-visible {
          outline: 2px solid #b35400;
          outline-offset: 4px;
          border-radius: 4px;
        }

        @media (max-width: 1200px) {
          .dp-carousel-grid {
            display: flex;
            flex-direction: column;
            gap: clamp(16px, 2.2vw, 24px);
            overflow: visible;
          }

          .dp-carousel-slide-host {
            display: flex;
            flex-direction: column;
            grid-column: unset;
            grid-row: unset;
            gap: clamp(16px, 2.2vw, 24px);
          }

          .dp-carousel-row1 {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(16px, 2.2vw, 24px);
            grid-column: unset;
            grid-row: unset;
          }

          .dp-carousel-row2-cards {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(16px, 2.2vw, 24px);
            grid-column: unset;
            grid-row: unset;
          }

          .district-explore-card {
            grid-column: unset;
            grid-row: unset;
            height: auto;
            min-height: var(--dp-district-card-min-height, 404px);
          }
        }

        @media (max-width: 900px) {
          .dp-carousel-row1,
          .dp-carousel-row2-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .dp-carousel-row1,
          .dp-carousel-row2-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .district-explore-card {
            min-height: var(--dp-district-card-min-height, 404px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dp-carousel-slide-host {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
