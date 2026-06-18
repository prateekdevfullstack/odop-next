"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectVideoModal } from "./ProjectVideoModal";
import { API_CONFIG } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";

export interface ProjectVideo {
  id: number | string;
  title: string;
  district: string;
  city_name: string;
  description: string;
  thumbnail: string;
  video_url: string; // Used to extract youtube id
  slug?: string;
  sub_category_slug?: string;
}

interface ProjectVideoListProps {
  videos: ProjectVideo[];
}

export function ProjectVideoList({ videos }: ProjectVideoListProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ 
    id: string; 
    title: string; 
    description: string;
    slug?: string;
    sub_category_slug?: string;
  } | null>(null);
  const lang = useLanguage();
  const isHi = lang === "hi";

  const getYouTubeId = (url: string | undefined | null): string => {
    if (!url || url === "null") return "";
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    
    // Also handle youtu.be format
    const match2 = url.match(/youtu\.be\/([^?]+)/);
    if (match2) return match2[1];
    
    // If it's already an ID, just return it
    if (!url.includes("/")) return url;
    
    return url;
  };

  return (
    <>
      <div id="kb-pv-grid" className="kb-pv-grid">
        {videos.map((video) => {
          const imageSrc = video.thumbnail?.startsWith("http")
            ? video.thumbnail
            : video.thumbnail
            ? `${API_CONFIG.IMAGE_BASE_URL}${video.thumbnail}`
            : "/assets/img/placeholder.jpg"; // fallback

          const videoId = getYouTubeId(video.video_url);

          return (
            <button
              key={video.id}
              type="button"
              className="kb-pv-card"
              onClick={() => setSelectedVideo({ 
                id: videoId, 
                title: video.title, 
                description: video.description,
                slug: video.slug,
                sub_category_slug: video.sub_category_slug
              })}
              aria-label={isHi ? `वीडियो देखें: ${video.title}` : `Watch video: ${video.title}`}
            >
              <span className="kb-pv-card__media">
                <Image
                  className="kb-pv-card__img"
                  src={imageSrc}
                  alt=""
                  width={400}
                  height={250}
                  style={{ objectFit: "cover" }}
                />
              </span>
              <span className="kb-pv-card__shade" aria-hidden="true"></span>
              <span className="kb-pv-card__inner">
                <span className="kb-pv-card__tag">{video.city_name}</span>
                <span className="kb-pv-card__title">{video.title}</span>
                <span className="kb-pv-card__cta">{isHi ? "वीडियो देखें" : "Watch Video"}</span>
              </span>
            </button>
          );
        })}
      </div>

      <ProjectVideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
