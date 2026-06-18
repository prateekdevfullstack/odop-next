"use client";

import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";

type PageBannerProps = {
  imageSrc: string;
  eyebrow: string;
  current: string;
  className?: string;
};

export default function PageBanner({
  imageSrc,
  eyebrow,
  current,
  className = "",
}: PageBannerProps) {
  const isHi = useLanguage() === "hi";
  return (
    <section className={`odop-intrinsic-banner ${className}`.trim()}>
      <Image
        src={imageSrc}
        alt=""
        priority
        fill
        sizes="100vw"
        className="odop-intrinsic-banner-image"
      />
      <div className="odop-intrinsic-banner-overlay" />
      <div className="odop-intrinsic-banner-content">
        <h1 className="media-heading">{eyebrow}</h1>
        <div className="breadcrumb">
          <span className="text-white">{isHi ? "होम" : "Home"}</span>
          <span className="separator">&gt;</span>
          <span className="active">{current}</span>
        </div>
      </div>
    </section>
  );
}
