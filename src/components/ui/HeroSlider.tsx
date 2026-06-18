"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { HERO_BANNER_SLIDES, HINDI_HERO_BANNER_SLIDES } from "@/lib/hero-banners";

const HERO_SIZES = "(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px";

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lang = useLanguage();
  const slides = lang === "hi" ? HINDI_HERO_BANNER_SLIDES : HERO_BANNER_SLIDES;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="hero hero-no-image relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      <div className="hero-bg-carousel overflow-hidden" aria-hidden="true">
        <div
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((src, index) => (
            <div
              key={src}
              className="w-full h-full shrink-0 relative"
            >
              <Image
                src={src}
                alt=""
                role="presentation"
                fill
                sizes={HERO_SIZES}
                quality={75}
                className="hero-bg-home"
                style={{ objectFit: "cover", objectPosition: "center 40%" }}
                preload={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-4 left-4 z-10 inline-flex justify-center items-center w-10 h-10 rounded-full shadow-lg text-white transition-all duration-300 cursor-pointer focus:outline-none hover:scale-105 active:scale-95 bg-btn-carousel"
        style={{ backgroundColor: "var(--btn-carousel-bg, #495057)" }}
        onClick={prevSlide}
      >
        <span aria-hidden="true">
          <svg
            className="w-5 h-5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </span>
        <span className="sr-only">Previous</span>
      </button>

      <button
        type="button"
        className="absolute bottom-4 right-4 z-10 inline-flex justify-center items-center w-10 h-10 rounded-full shadow-lg text-white transition-all duration-300 cursor-pointer focus:outline-none hover:scale-105 active:scale-95 bg-btn-carousel"
        style={{ backgroundColor: "var(--btn-carousel-bg, #495057)" }}
        onClick={nextSlide}
      >
        <span className="sr-only">Next</span>
        <span aria-hidden="true">
          <svg
            className="w-5 h-5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </button>

      <div className="hero-slider-dots" role="tablist" aria-label="Hero slide indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            className={`hero-slider-dot${index === currentSlide ? " is-active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
