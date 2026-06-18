"use client";

import { useState } from "react";
import Image from "next/image";
import { DocumentaryVideo } from "./DocumentaryVideo";
import { API_CONFIG } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";

export interface Documentary {
  id: number;
  name: string;
  hindi_name?: string | null;
  slug: string;
  thumbnail: string;
  hindi_thumbnail?: string | null;
  short_description: string | null;
  hindi_short_description?: string | null;
  sub_category?: {
    name: string;
    title: string;
  };
  get_sub_category?: {
    id: number;
    name: string;
    hindi_name?: string | null;
    slug: string;
    thumbnail: string;
    hindi_thumbnail?: string | null;
    short_description: string | null;
    hindi_short_description?: string | null;
    description?: string | null;
    hindi_description?: string | null;
  } | null;
  title?: string | null;
  hindi_title?: string | null;
  url?: string;
}

interface DocumentaryListProps {
  documentaries: Documentary[];
}

export function DocumentaryList({ documentaries }: DocumentaryListProps) {
  const [selectedVideo, setSelectedVideo] = useState<{id: number} | null>(null);
  const lang = useLanguage();
  const isHi = lang === "hi";

  return (
    <>
      <div className="kb-ss-grid" role="list">
        {documentaries.map((doc) => {
          const title = isHi ? (doc.hindi_name || doc.name) : doc.name;
          const thumbnail = isHi ? (doc.hindi_thumbnail || doc.thumbnail) : doc.thumbnail;
          const imageSrc = thumbnail
            ? `${API_CONFIG.IMAGE_BASE_URL}${thumbnail}`
            : "/assets/img/placeholder.jpg";
          return (
            <article key={doc.id} className="kb-doc-card" role="listitem">
              <div className="kb-doc-card__surface">
                <div className="kb-doc-card__image-container">
                  <Image
                    src={imageSrc}
                    alt={title || (isHi ? "वृत्तचित्र छवि" : "Documentary Image")}
                    className="kb-doc-card__image"
                    width={400}
                    height={250}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="kb-doc-card__scrim" aria-hidden="true"></div>
                <div className="kb-doc-card__body">
                  <h3 className="kb-doc-card__heading">{title}</h3>
                </div>
                <button
                  type="button"
                  className="kb-ss-card__play kb-doc-card__play-btn"
                  onClick={() => setSelectedVideo({id: doc.id})}
                  aria-label={isHi ? `वृत्तचित्र चलाएं: ${title}` : `Play documentary: ${title}`}
                >
                  <span className="kb-ss-card__play-shape" aria-hidden="true"></span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <DocumentaryVideo
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
