"use client";

import { useState } from "react";
import Image from "next/image";
import { SuccessStoryListModal } from "./SuccessStoryListModal";
import { API_CONFIG } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { useLanguage } from "@/hooks/useLanguage";

export interface SuccessStory {
  id: string | number;
  name: string;
  businessName: string;
  shortDescription?: string;
  fullStory?: string;
  profileImage: string;
  state?: {
    id: number;
    name: string;
    code: string;
    status: number;
  };
  city?: {
    id: number;
    districtName: string;
    state_id: number;
    status: number;
  };
}

interface SuccessStoryListProps {
  storieslist: SuccessStory[];
}

function getImageUrl(image?: string) {
  if (!image) return "/images/no-image.png";
  const cleanBaseUrl = API_CONFIG.NEW_BASE_URL.replace(/\/+$/, "");
  const cleanImage = image.replace(/\/{2,}/g, "/");

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${cleanBaseUrl}/${cleanImage.replace(/^\/+/, "")}`;
}

export function SuccessStoryList({ storieslist }: SuccessStoryListProps) {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const lang = useLanguage();
  const isHi = lang === "hi";

  return (
    <>
      <div className="kb-ss-grid" role="list">
        {storieslist?.map((story) => (
          <article key={story.id} className="kb-ss-card" role="listitem">
            <button
              type="button"
              className="kb-ss-card__click"
              onClick={() => setSelectedStory(story)}
              aria-label={isHi ? `कहानी देखें: ${story.name}` : `View story: ${story.name}`}
            >
              <div className="kb-ss-card__media">
                <Image
                  src={getImageUrl(story.profileImage)}
                  alt={story.name}
                  className="kb-ss-card__thumb"
                  width={300}
                  height={300}
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  quality={75}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="kb-ss-card__meta">
                <div className="kb-ss-card__copy">
                  <h3 className="kb-ss-card__title">{story.name}</h3>
                  <p className="kb-ss-card__desc">{story.businessName}</p>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      <SuccessStoryListModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </>
  );
}