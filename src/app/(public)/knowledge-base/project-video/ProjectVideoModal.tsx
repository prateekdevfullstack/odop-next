"use client";

import { useEffect, useState } from "react";
import { getIndustrialDetailAction } from "@/app/actions/entrepreneur";
import { useLanguage } from "@/hooks/useLanguage";

interface ProjectVideoModalProps {
  video: { 
    id: string; 
    title: string; 
    description: string;
    slug?: string;
    sub_category_slug?: string;
  } | null;
  onClose: () => void;
}

 const getYouTubeId = (url: string | undefined | null): string => {
    if (!url || url === "null") return "";
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : url;
  };

export function ProjectVideoModal({ video, onClose }: ProjectVideoModalProps) {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const lang = useLanguage();
  const isHi = lang === "hi";

  useEffect(() => {
    if (video) {
      document.body.style.overflow = "hidden";
      if (video.sub_category_slug && video.slug) {
        setLoading(true);
        getIndustrialDetailAction(video.sub_category_slug, video.slug)
          .then(result => {
            if (result.success) {
              const productDetailVideo = result.data?.contents.find((item: any) => item.name === 'ODOP Product')?.industrial_solutions?.find((sol: any) => sol.url ) || null;
              if (productDetailVideo) video.id = getYouTubeId(productDetailVideo.url);
              setDetail(result.data);
            }
          })
          .finally(() => setLoading(false));
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

  const displayDescription = isHi
    ? (detail?.hindi_description || detail?.description_hindi || detail?.description || detail?.content || video.description)
    : (detail?.description || detail?.content || video.description);

  return (
    <div id="kb-pv-modal" className="kb-pv-modal" role="dialog" aria-modal="true" aria-labelledby="kb-pv-modal-title">
      <div className="kb-pv-modal__backdrop" onClick={onClose} tabIndex={-1}></div>
      <div className="kb-pv-modal__panel">
        <div className="kb-pv-modal__toolbar">
          <button
            type="button"
            className="kb-pv-modal__close"
            onClick={onClose}
            aria-label={isHi ? "वीडियो बंद करें" : "Close video"}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <div className="kb-pv-modal__body">
          <h3 id="kb-pv-modal-title" className="kb-pv-modal__title">{video.title}</h3>
          <div className="kb-pv-modal__frame-wrap">
            <div className="kb-pv-modal__frame">
              <iframe
                id="kb-pv-iframe"
                className="kb-pv-modal__iframe"
                title={isHi ? "यूट्यूब वीडियो प्लेयर" : "YouTube video player"}
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div id="kb-pv-modal-desc" className="kb-pv-modal__desc">
            <span>{isHi ? "विवरण" : "Description"}</span>
            {loading ? (
              <p>{isHi ? "विवरण लोड हो रहा है..." : "Loading details..."}</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: displayDescription }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
