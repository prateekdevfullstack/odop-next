"use client";

import { useState } from "react";
import Image from "next/image";
import { VideoModal } from "@/components/ui/VideoModal";
import { useLanguage } from "@/hooks/useLanguage";

export interface SuccessStory {
  id: string | number;
  title: string;
  description: string;
  district: string;
  thumbnail: string;
  video_id: string;
  video_url: string;
  duration?: string;
}

interface SuccessStoryListProps {
  stories: SuccessStory[];
}

export function SuccessStoryVideoList({ stories }: SuccessStoryListProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const lang = useLanguage();
  const isHi = lang === "hi";
  const sectionHeading = isHi ? "सफलता की कहानी वीडियो" : "Success Story Videos";

  return (
    <>
      <div className="masonry-header success_story_sideos mt-md-60 mt-50 mb-md-40 mb-20 ">
        <div className="mb-md-0 mb-10 mt-50">
          <h3>{sectionHeading}</h3>
        </div>
      </div>
      <div className="kb-ss-grid" role="list">
        {stories.map((story) => (
          <article key={story.id} className="kb-ss-card" role="listitem">
            <div className="kb-ss-card__media">
              <Image
                src={story.thumbnail}
                alt={story.title}
                className="kb-ss-card__thumb"
                width={1280}
                height={720}
                style={{ objectFit: "cover" }}
              />
              {story.duration && (
                <span className="kb-ss-card__duration" aria-hidden="true">
                  {story.duration}
                </span>
              )}
              <button
                type="button"
                className="kb-ss-card__play"
                onClick={() => setSelectedVideoId(story.video_id)}
                aria-label={isHi ? `चलाएं: ${story.title}` : `Play: ${story.title}`}
              >
                <span className="kb-ss-card__play-shape" aria-hidden="true"></span>
              </button>
            </div>
            <div className="kb-ss-card__meta">
              <div className="kb-ss-card__avatar">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="kb-ss-card__copy">
                <h3 className="kb-ss-card__title">{story.title}</h3>
                <p className="kb-ss-card__desc">{story.description}</p>
                <span className="kb-ss-card__tag">{story.district}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <VideoModal
        videoId={selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
      />
    </>
  );
}
