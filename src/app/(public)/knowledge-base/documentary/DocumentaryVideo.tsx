"use client";

import { useEffect, useState } from "react";
import { getHamaraPradeshVideoIntro } from "@/app/actions/hamarapardesh";
import { useLanguage } from "@/hooks/useLanguage";

interface VideoModalProps {
  video?: { id: number } | null;
  onClose: () => void;
}

  // Helper to extract YouTube ID if a full URL is provided in the future
  const getYouTubeId = (url: string | undefined | null): string => {
    if (!url || url === "null") return "";
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : url;
  };

export function DocumentaryVideo({ video, onClose }: VideoModalProps) {
  const [detail, setDetail] = useState<any>(null);
  const lang = useLanguage();
  const isHi = lang === "hi";

  useEffect(() => {
    if (video) {
      document.body.style.overflow = "hidden";
      if (video?.id) {
        getHamaraPradeshVideoIntro(video.id)
          .then(result => {
            if (result.success) {
              const documentaryVideo = result.data?.districtIntro['0'];
              if (documentaryVideo?.introurl) {
                const youtubeId = getYouTubeId(documentaryVideo.introurl);
                if (youtubeId) setDetail(youtubeId);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      document.body.style.overflow = "";
      setDetail(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [video]);
  if (!video) return null;
  return (
    <div
      id="kb-ss-modal"
      className="kb-ss-modal"
      role="dialog"
      aria-modal="true"
      aria-label={isHi ? "वीडियो प्लेयर" : "Video player"}
    >
      <div className="kb-ss-modal__backdrop" onClick={onClose} tabIndex={-1}></div>
      <div className="kb-ss-modal__wrapper">
        <button
          type="button"
          className="kb-ss-modal__close"
          onClick={onClose}
          aria-label={isHi ? "वीडियो बंद करें" : "Close video"}
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
        <div className="kb-ss-modal__panel">
          <div className="kb-ss-modal__frame">
            <iframe
              id="kb-ss-iframe"
              className="kb-ss-modal__iframe"
              title={isHi ? "यूट्यूब वीडियो प्लेयर" : "YouTube video player"}
              src={`https://www.youtube-nocookie.com/embed/${detail}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
