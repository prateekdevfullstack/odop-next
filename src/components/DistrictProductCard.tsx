"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { API_CONFIG } from "@/lib/api";
import {
  DISTRICT_CARD_PLACEHOLDER,
  resolveDistrictCardImage,
} from "@/lib/district-card-media";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

export interface DistrictLinkedProduct {
  id?: number;
  name: string;
  isPrimary: boolean;
}

function coerceProductLabel(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["hi", "hindi", "en", "name", "label"]) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
  }
  return "";
}

function normalizeDistrictLinkedProducts(
  raw: DistrictLinkedProduct[] | undefined
): DistrictLinkedProduct[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const primary: DistrictLinkedProduct[] = [];
  const rest: DistrictLinkedProduct[] = [];
  let primaryAssigned = false;

  const add = (name: string, wantsPrimary: boolean, id?: number) => {
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    // Only the very first primary-flagged entry gets isPrimary: true
    const isPrimary = wantsPrimary && !primaryAssigned;
    if (isPrimary) primaryAssigned = true;

    const item = { id, name, isPrimary };
    if (isPrimary) primary.push(item);
    else rest.push(item);
  };

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    add(
      coerceProductLabel(entry.name),
      Boolean(entry.isPrimary),
      entry.id
    );
  }

  if (primary.length === 0 && rest.length > 0) {
    rest[0] = { ...rest[0], isPrimary: true };
  }

  return [...primary, ...rest];
}

export interface DistrictProduct {
  id?: number | string;
  slug: string;
  name: string;
  img: string;
  products: DistrictLinkedProduct[];
  profile?: string;
  images?: string[];
}

interface DistrictProductCardProps {
  district: DistrictProduct;
  index: number;
  productLayout?: "lines" | "bullets";
}

const PLACEHOLDER = DISTRICT_CARD_PLACEHOLDER;
const BANNER_SIZES = "(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw";
const PRODUCTS_PER_LINE = 2;
const SWIPE_THRESHOLD_PX = 40;

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

/** Slides from `cityProductCategoryImages` only (via `images` prop). */
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

function buildProductLines(products: string[]): string[] {
  if (products.length === 0) return [];

  const lines: string[] = [];
  for (let i = 0; i < products.length; i += PRODUCTS_PER_LINE) {
    const chunk = products.slice(i, i + PRODUCTS_PER_LINE);
    const hasMore = i + PRODUCTS_PER_LINE < products.length;
    lines.push(chunk.join(" | ") + (hasMore ? " |" : ""));
  }
  return lines;
}

interface DistrictCardMediaProps {
  src: string;
  alt: string;
  variant: "banner" | "thumb";
  priority?: boolean;
}

function DistrictCardMedia({ src, alt, variant, priority = false }: DistrictCardMediaProps) {
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
        <div className="district-card-media-wrap">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={BANNER_SIZES}
            className="district-card-media"
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
        className="district-card-media"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={handleError}
      />
    );
  }

  if (useNextImage) {
    return (
      <div className="district-card-media-wrap district-card-media-wrap--thumb">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="80px"
          className="district-card-media"
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
      className="district-card-media"
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}

interface DistrictCardCarouselProps {
  slides: string[];
  name: string;
  variant: "banner" | "thumb";
  activeIndex: number;
  priorityFirst?: boolean;
}

function DistrictCardCarousel({
  slides,
  name,
  variant,
  activeIndex,
  priorityFirst = false,
}: DistrictCardCarouselProps) {
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
            <DistrictCardMedia
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

export default function DistrictProductCard({
  district,
  index,
  productLayout = "lines",
}: DistrictProductCardProps) {
  const { slug, name, img, products: linkedProducts = [], profile, images } = district;

  const displayProducts = useMemo(
    () => normalizeDistrictLinkedProducts(linkedProducts),
    [linkedProducts]
  );

  const productLines = useMemo(
    () => buildProductLines(displayProducts.map((item) => item.name)),
    [displayProducts]
  );

  const carouselSlides = useMemo(() => buildCarouselSlides(images, img), [images, img]);
  const hasCarousel = carouselSlides.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselSlides]);

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

  const profileUrl = profile || `/districts/${slug}`;
  const priorityBanner = index < 4;
  const revealClass =
    index % 4 === 1 ? " delay-1" : index % 4 === 2 ? " delay-2" : index % 4 === 3 ? " delay-3" : "";

  return (
    <div className={`district-card reveal${revealClass}`}>
      <Link
        href={profileUrl}
        className="district-card-link"
        aria-label={`View ${name} district profile`}
      >
        <div className="district-card-hero">
          <div
            className="district-card-img"
            onTouchStart={hasCarousel ? handleTouchStart : undefined}
            onTouchEnd={hasCarousel ? handleTouchEnd : undefined}
          >
            {hasCarousel ? (
              <DistrictCardCarousel
                slides={carouselSlides}
                name={name}
                variant="banner"
                activeIndex={activeIndex}
                priorityFirst={priorityBanner}
              />
            ) : (
              <DistrictCardMedia
                src={carouselSlides[0]}
                alt={`${name} product image`}
                variant="banner"
                priority={priorityBanner}
              />
            )}

          </div>

          <div className="district-card-thumb">
            {hasCarousel ? (
              <DistrictCardCarousel
                slides={carouselSlides}
                name={name}
                variant="thumb"
                activeIndex={activeIndex}
              />
            ) : (
              <DistrictCardMedia src={carouselSlides[0]} alt="" variant="thumb" />
            )}
          </div>
        </div>

        <div className="district-card-body">
          <h4>{name}</h4>
          {displayProducts.length > 0 && (
            <div className="district-card-products">
              {productLayout === "bullets" ? (
                <p className="district-card-products-bullets">
                  {displayProducts.map((item, productIndex) => (
                    <span
                      key={`${slug}-product-${item.id ?? productIndex}`}
                      className={`district-card-product-item${item.isPrimary ? " district-card-product-item--primary" : ""}`}
                    >
                      {productIndex > 0 && (
                        <span className="district-card-product-separator" aria-hidden="true">
                          |
                        </span>
                      )}
                      {item.name}
                    </span>
                  ))}
                </p>
              ) : (
                productLines.map((line, lineIndex) => {
                  const lineProducts = displayProducts.filter((item) =>
                    line.includes(item.name)
                  );
                  const isPrimaryLine = lineProducts.some((item) => item.isPrimary);

                  return (
                    <p
                      key={`${line}-${lineIndex}`}
                      className={
                        isPrimaryLine ? "district-card-product-line--primary" : undefined
                      }
                    >
                      {line}
                    </p>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Link>

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
    </div>
  );
}
