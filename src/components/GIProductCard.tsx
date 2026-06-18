"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { API_CONFIG } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import {
  DISTRICT_CARD_PLACEHOLDER,
  resolveDistrictCardImage,
} from "@/lib/district-card-media";
import type { GIProductCardData } from "@/services/gi-products.service";

const PLACEHOLDER = DISTRICT_CARD_PLACEHOLDER;
const BANNER_SIZES = "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw";
const SWIPE_THRESHOLD_PX = 40;
const AUTOPLAY_MS = 4500;

interface GIProductCardProps {
  product: GIProductCardData;
  index: number;
}

function collectOptimizableHosts(): Set<string> {
  const hosts = new Set(["udyamsarthi.co.in", "odopapi.samadhandigitech.com"]);
  for (const base of [API_CONFIG.NEW_BASE_URL, API_CONFIG.IMAGE_BASE_URL, API_CONFIG.BASE_URL]) {
    try {
      hosts.add(new URL(base).hostname);
    } catch {
      /* ignore */
    }
  }
  return hosts;
}

function canOptimizeWithNextImage(src: string, optimizableHosts: Set<string>): boolean {
  if (src.startsWith("/")) return true;
  try {
    return optimizableHosts.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

function normalizeImageKey(url: string): string {
  try {
    const parsed = new URL(url, API_CONFIG.NEW_BASE_URL);
    return parsed.pathname.replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().replace(/\/$/, "").toLowerCase();
  }
}

function buildCarouselSlides(images: string[] | undefined, fallbackImg: string): string[] {
  const seen = new Set<string>();
  const slides: string[] = [];

  for (const entry of images ?? []) {
    const trimmed = entry?.trim();
    if (!trimmed) continue;
    const key = normalizeImageKey(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    slides.push(trimmed);
  }

  if (slides.length > 0) return slides;

  const fallback = fallbackImg?.trim();
  return fallback ? [fallback] : [PLACEHOLDER];
}

interface GICardMediaProps {
  src: string;
  alt: string;
  variant: "banner" | "thumb";
  priority?: boolean;
}

function GICardMedia({ src, alt, variant, priority = false }: GICardMediaProps) {
  const optimizableHosts = useMemo(() => collectOptimizableHosts(), []);
  const [imageSrc, setImageSrc] = useState(() => resolveDistrictCardImage(src));
  const useNextImage = canOptimizeWithNextImage(imageSrc, optimizableHosts);

  useEffect(() => {
    setImageSrc(resolveDistrictCardImage(src));
  }, [src]);

  const handleError = useCallback(() => {
    setImageSrc((current) => (current === PLACEHOLDER ? current : PLACEHOLDER));
  }, []);

  if (variant === "banner") {
    if (useNextImage) {
      return (
        <div className="gi-card-media-wrap">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={BANNER_SIZES}
            className="gi-card-media district-card-media"
            preload={priority}
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL.light}
            onError={handleError}
          />
          <div className="district-card-blur district-card-blur--start" aria-hidden="true">
            <Image
              src="/assets/img/icon/blur.png"
              alt=""
              width={65}
              height={65}
              loading="lazy"
              decoding="async"
              quality={100}
            />
          </div>
          <div className="district-card-blur district-card-blur--end" aria-hidden="true">
            <Image
              src="/assets/img/icon/blur.png"
              alt=""
              width={65}
              height={65}
              loading="lazy"
              decoding="async"
              quality={100}
            />
          </div>
        </div>
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <Image
        src={imageSrc}
        alt={alt}
        className="gi-card-media district-card-media"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={handleError}
      />
    );
  }

  if (useNextImage) {
    return (
      <div className="gi-card-media-wrap gi-card-media-wrap--thumb district-card-media-wrap district-card-media-wrap--thumb">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="110px"
          className="gi-card-media district-card-media"
          quality={55}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL.light}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Image
      src={imageSrc}
      alt={alt}
      className="gi-card-media district-card-media"
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}

interface GICardCarouselProps {
  slides: string[];
  name: string;
  variant: "banner" | "thumb";
  activeIndex: number;
  priorityFirst?: boolean;
}

function GICardCarousel({
  slides,
  name,
  variant,
  activeIndex,
  priorityFirst = false,
}: GICardCarouselProps) {
  const slideCount = slides.length;
  const offsetPercent = slideCount > 0 ? (activeIndex * 100) / slideCount : 0;

  return (
    <div
      className={`district-card-carousel-viewport${variant === "thumb" ? " district-card-carousel-viewport--thumb" : ""}`}
      aria-hidden={variant === "thumb" ? true : undefined}
    >
      <div
        className="district-card-carousel-track"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translate3d(-${offsetPercent}%, 0, 0)`,
        }}
      >
        {slides.map((imgSrc, idx) => (
          <div
            key={`${variant}-${normalizeImageKey(imgSrc)}-${idx}`}
            className="district-card-carousel-slide"
            style={{
              flex: `0 0 ${100 / slideCount}%`,
              width: `${100 / slideCount}%`,
            }}
            aria-hidden={idx !== activeIndex}
          >
            <GICardMedia
              src={imgSrc}
              alt={variant === "banner" ? `${name} product image ${idx + 1}` : ""}
              variant={variant}
              priority={priorityFirst && idx === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GIProductCard({ product, index }: GIProductCardProps) {
  const { name, subtitle, img, images } = product;

  const carouselSlides = useMemo(() => buildCarouselSlides(images, img), [images, img]);
  const hasCarousel = carouselSlides.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const priorityBanner = index < 4;
  const revealClass =
    index % 4 === 1 ? " delay-1" : index % 4 === 2 ? " delay-2" : index % 4 === 3 ? " delay-3" : "";

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselSlides]);

  useEffect(() => {
    if (!hasCarousel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselSlides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasCarousel, carouselSlides.length]);

  const goNext = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex((prev) => (prev + 1) % carouselSlides.length);
    },
    [carouselSlides.length]
  );

  const goPrev = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex(
        (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
      );
    },
    [carouselSlides.length]
  );

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!hasCarousel || touchStartX.current === null) return;
      const endX = event.changedTouches[0]?.clientX;
      if (endX == null) return;
      const delta = endX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
      if (delta < 0) {
        setActiveIndex((prev) => (prev + 1) % carouselSlides.length);
      } else {
        setActiveIndex(
          (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
        );
      }
    },
    [hasCarousel, carouselSlides.length]
  );

  return (
    <article className={`gi-card reveal${revealClass}`}>
      <div className="gi-card-content">
        <div className="gi-card-hero">
          <div
            className="gi-card-img"
            onTouchStart={hasCarousel ? handleTouchStart : undefined}
            onTouchEnd={hasCarousel ? handleTouchEnd : undefined}
          >
            {hasCarousel ? (
              <GICardCarousel
                slides={carouselSlides}
                name={name}
                variant="banner"
                activeIndex={activeIndex}
                priorityFirst={priorityBanner}
              />
            ) : (
              <GICardMedia
                src={carouselSlides[0]}
                alt={`${name} product image`}
                variant="banner"
                priority={priorityBanner}
              />
            )}
          </div>

          <div className="gi-card-thumb">
            {hasCarousel ? (
              <GICardCarousel
                slides={carouselSlides}
                name={name}
                variant="thumb"
                activeIndex={activeIndex}
              />
            ) : (
              <GICardMedia src={carouselSlides[0]} alt="" variant="thumb" />
            )}
          </div>
        </div>

        <div className="gi-card-body">
          <h3 className="gi-card-title">{name}</h3>
          {/* {subtitle ? <p className="gi-card-subtitle">{subtitle}</p> : null} */}
        </div>
      </div>

      {hasCarousel && (
        <>
          <button
            type="button"
            className="district-card-carousel-btn district-card-carousel-btn--prev"
            aria-label={`Show previous ${name} product image`}
            onClick={goPrev}
          >
            <span className="district-card-carousel-btn-glow" aria-hidden="true" />
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="district-card-carousel-btn district-card-carousel-btn--next"
            aria-label={`Show next ${name} product image`}
            onClick={goNext}
          >
            <span className="district-card-carousel-btn-glow" aria-hidden="true" />
            <FaChevronRight aria-hidden="true" />
          </button>
        </>
      )}
    </article>
  );
}
