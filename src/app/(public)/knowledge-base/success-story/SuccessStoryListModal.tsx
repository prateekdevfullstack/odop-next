"use client";

import { useEffect } from "react";
import Image from "next/image";
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

interface SuccessStoryListModalProps {
  story: SuccessStory | null;
  onClose: () => void;
}

function getImageUrl(image?: string) {
  if (!image) return "/images/no-image.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const cleanBaseUrl = API_CONFIG.NEW_BASE_URL.replace(/\/+$/, "");
  const cleanImage = image.replace(/^\/+/, "");

  return `${cleanBaseUrl}/${cleanImage}`;
}

export function SuccessStoryListModal({
  story,
  onClose,
}: SuccessStoryListModalProps) {
  const lang = useLanguage();
  const isHi = lang === "hi";

  useEffect(() => {
    document.body.style.overflow = story ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [story]);
  if (!story) return null;

  return (
    <div className="story-modal-overlay" onClick={onClose}>
      <div className="story-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="story-modal-close"
          onClick={onClose}
          aria-label={isHi ? "मोडल बंद करें" : "Close modal"}
        >
          ×
        </button>

        <div className="story-design">
          {/* LEFT SIDE */}
          <div className="story-design-left">
            <div className="story-profile-img-wrap">
              <Image
                src={getImageUrl(story.profileImage)}
                alt={story.name}
                className="story-profile-img"
                width={300}
                height={300}
                sizes="(max-width: 640px) 200px, 300px"
                quality={80}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL.light}
              />
            </div>

            <div className="story-person-info">
              <h3>{story.name}</h3>
              <p>{story.businessName}</p>
            </div>

            {story.shortDescription && (
              <div className="story-short-text">
                <p>{story.shortDescription}</p>
              </div>
            )}
          </div>

          <div className="story-design-right">
            <div className="story-city-badge">
              {story.city?.districtName || story.state?.name || (isHi ? "सफलता की कहानी" : "Success Story")}
            </div>

            <div className="story-main-text">
              <p>{story.fullStory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}