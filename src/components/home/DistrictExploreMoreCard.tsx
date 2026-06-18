"use client";

import Image from "next/image";
import Link from "next/link";

type DistrictExploreMoreCardProps = {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  navDisabled?: boolean;
  isHi?: boolean;
};

/** Figma node 1227:6536 — white chevron inside gray inner circle. */
function NavChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircleNav({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  navDisabled,
  isHi = false,
}: Pick<
  DistrictExploreMoreCardProps,
  "onPrev" | "onNext" | "canGoPrev" | "canGoNext" | "navDisabled" | "isHi"
>) {
  return (
    <div
      className="district-explore-circle-nav"
      aria-label={isHi ? "जिला कैरोसेल नेविगेशन" : "District carousel navigation"}
    >
      <button
        type="button"
        className="district-explore-circle-btn district-explore-circle-btn--prev"
        onClick={onPrev}
        disabled={!canGoPrev || navDisabled}
        aria-label={isHi ? "पिछले जिले दिखाएं" : "Show previous districts"}
      >
        <span className="district-explore-circle-btn-ring">
          <span className="district-explore-circle-btn-core">
            <NavChevronIcon direction="prev" />
          </span>
        </span>
      </button>

      <button
        type="button"
        className="district-explore-circle-btn district-explore-circle-btn--next"
        onClick={onNext}
        disabled={!canGoNext || navDisabled}
        aria-label={isHi ? "अगले जिले दिखाएं" : "Show next districts"}
      >
        <span className="district-explore-circle-btn-ring">
          <span className="district-explore-circle-btn-core">
            <NavChevronIcon direction="next" />
          </span>
        </span>
      </button>
    </div>
  );
}

/** Home district carousel — Figma node 1227:6536. */
export default function DistrictExploreMoreCard({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  navDisabled = false,
  isHi = false,
}: DistrictExploreMoreCardProps) {
  const districtsHref = isHi ? "/hi/districts" : "/districts";

  return (
    <div className="district-explore-card reveal">
      <Image
        className="district-explore-card-dots district-explore-card-dots--tr"
        src="/assets/img/icon/blur.png"
        width={82}
        height={82}
        alt=""
        aria-hidden="true"
      />
      <Image
        className="district-explore-card-dots district-explore-card-dots--bl"
        src="/assets/img/icon/blur.png"
        width={82}
        height={82}
        alt=""
        aria-hidden="true"
      />

      <div className="district-explore-card-content">
        <CircleNav
          onPrev={onPrev}
          onNext={onNext}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          navDisabled={navDisabled}
          isHi={isHi}
        />

        <Link
          href={districtsHref}
          className="district-explore-card-label"
          aria-label={
            isHi ? "सभी जिला ओडीओपी उत्पाद देखें" : "View all district ODOP products"
          }
        >
          {isHi ? "और देखें" : "Explore More"}
        </Link>
      </div>
    </div>
  );
}
