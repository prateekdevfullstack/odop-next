"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NavRail from "./NavRail";
import { useLanguage } from "@/hooks/useLanguage";
import { HERO_BANNER_SLIDES, HINDI_HERO_BANNER_SLIDES } from "@/lib/hero-banners";

const HERO_SIZES = "(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px";

function HeroSliderV2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const lang = useLanguage();
  const slides = lang === "hi" ? HINDI_HERO_BANNER_SLIDES : HERO_BANNER_SLIDES;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section
      className="hero hero-no-image relative max-w-full"
      aria-roledescription="carousel"
      aria-label="Landing hero images"
    >
      <NavRail />

      <div className="hero-bg-carousel" aria-hidden="true">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`hero-bg hero-bg-slide ${
              index === currentSlide ? "is-active" : ""
            }`}
          >
            <Image
              src={src}
              alt=""
              role="presentation"
              fill
              sizes={HERO_SIZES}
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="hero-bg-home"
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      <div
        className="hero-slider-dots pointer-events-none"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            tabIndex={index === currentSlide ? 0 : -1}
            aria-label={`Go to slide ${index + 1} of ${slides.length}`}
            className={`hero-slider-dot pointer-events-auto${index === currentSlide ? " is-active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSliderV2;
