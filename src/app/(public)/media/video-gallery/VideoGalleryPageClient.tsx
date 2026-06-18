"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageBanner from "@/components/shared/PageBanner";
import { useLanguage } from "@/hooks/useLanguage";

type VideoGalleryItem = {
 district: string;
 title: string;
 desc: string;
 handle: string;
 youtubeSrc: string;
 poster: string;
 mp4: string;
};

const CFC_VIDEO_ITEMS: VideoGalleryItem[] = [
 {
 district: "Sitapur",
 title: "ODOP CFC Sitapur",
 desc: "बुनकरों के लिए नया युग।",
 handle: "@odop_sitapur",
 youtubeSrc: "https://www.youtube.com/watch?v=nYQaJAjdIgc",
 poster: "/assets/img/gallery/cfc-thumb/sitapur.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Ayodhya",
 title: "ODOP CFC Ayodhya",
 desc: "अयोध्या का गुड़ अब सिर्फ स्वाद नहीं, आत्मनिर्भरता की पहचान बन रहा है।",
 handle: "@odop_ayodhya",
 youtubeSrc: "https://www.youtube.com/watch?v=N6ebqAvidm4",
 poster: "/assets/img/gallery/cfc-thumb/ayodhya.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Ambedkar Nagar",
 title: "ODOP CFC Ambedkar Nagar",
 desc: "करघा विरासत को मिली नई रफ़्तार।",
 handle: "@odop_ambedkar_nagar",
 youtubeSrc: "https://youtu.be/WlBRXL1xbYM",
 poster: "/assets/img/gallery/cfc-thumb/ambedkar.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Moradabad",
 title: "ODOP CFC Moradabad",
 desc: "स्थानीय कारीगरों की मेहनत अब विदेशों में चमक रही।",
 handle: "@odop_moradabad",
 youtubeSrc: "https://youtu.be/ZNsWlKDbbFQ",
 poster: "/assets/img/gallery/cfc-thumb/moradabad.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Moradabad",
 title: "ODOP CFC Moradabad - spotlight",
 desc: "मुरादाबाद में PVD फिनिश की सुविधा रियायती दरों में।",
 handle: "@odop_moradabad",
 youtubeSrc: "https://youtu.be/O4n04xWKMiw",
 poster: "/assets/img/gallery/cfc-thumb/mooradabad.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Siddharth Nagar",
 title: "ODOP CFC Siddharth Nagar",
 desc: "काला नमक चावल सिर्फ फसल नहीं, एक ब्रांड बन रहा है।",
 handle: "@odop_siddharth_nagar",
 youtubeSrc: "https://youtu.be/4i3JhPtU57U",
 poster: "/assets/img/gallery/cfc-thumb/sidharthnagar.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
 {
 district: "Azamgarh",
 title: "ODOP CFC Azamgarh",
 desc: "काली मिट्टी के उत्पाद सिर्फ उत्पाद नहीं, बल्कि आज़मगढ़ की पहचान और सदियों पुरानी कला का प्रमाण हैं।",
 handle: "@odop_azamgarh",
 youtubeSrc: "https://www.youtube.com/shorts/xTnyW6itxio?feature=share",
 poster: "/assets/img/gallery/cfc-thumb/ajamgarh.avif",
 mp4: "https://www.w3schools.com/html/mov_bbb.mp4",
 },
];

function youtubeEmbedUrl(url: string): string | null {
 const s = String(url);
 const shorts = s.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
 if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}?autoplay=1&rel=0`;
 const m = s.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
 if (!m?.[1]) return null;
 return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
}

function pauseVideosInRoot(root: HTMLElement | null) {
 if (!root) return;
 root.querySelectorAll(".horizontal-video").forEach((v) => {
 (v as HTMLVideoElement).pause();
 const playBtn = v.closest("[data-video-card]")?.querySelector(".play-btn");
 if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
 });
}

export default function VideoGalleryPageClient() {
 const [videoModalEmbed, setVideoModalEmbed] = useState<string | null>(null);

 const openYoutubeModal = useCallback((pageUrl: string) => {
 const embed = youtubeEmbedUrl(pageUrl);
 if (embed) setVideoModalEmbed(embed);
 }, []);

 const closeVideoModal = useCallback(() => {
 setVideoModalEmbed(null);
 }, []);

 useEffect(() => {
 if (!videoModalEmbed) return;
 const prev = document.body.style.overflow;
 document.body.style.overflow = "hidden";
 return () => {
 document.body.style.overflow = prev;
 };
 }, [videoModalEmbed]);

 useEffect(() => {
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") closeVideoModal();
 };
 window.addEventListener("keydown", onKey);
 return () => window.removeEventListener("keydown", onKey);
 }, [closeVideoModal]);

 const isHi = useLanguage() === "hi";

 return (<>
 <PageBanner
 imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png"
 eyebrow={isHi ? "मीडिया" : "Media"}
 current={isHi ? "वीडियो गैलरी" : "Video Gallery"}
 className="mt-0 mt-sm-0"
 />


 <main className="main-content gallery-page">
 <section className="section gallery-content-section">
 <div className="container gallery-container">
 <div className="mt-md-60 mt-30 mb-md-40 mb-20">
 <h1 className="resource-heading-common">{isHi ? "ओडीओपी वीडियो गैलरी" : "ODOP Video Gallery"}</h1>
 </div>

 <CFCSection onExpandYoutube={openYoutubeModal} />
 </div>
 </section>
 </main>

 <div
 id="modal"
 style={{ display: videoModalEmbed ? "flex" : "none" }}
 role="dialog"
 aria-modal="true"
 onClick={(e) => {
 if (e.target === e.currentTarget) closeVideoModal();
 }}
 >
 <div className="modal-content-wrapper">
 <i className="fa-solid fa-xmark" id="closeBtn" role="button" tabIndex={0} aria-label={isHi ? "बंद करें" : "Close"} onClick={closeVideoModal} onKeyDown={(e) => e.key === "Enter" && closeVideoModal()} />
 {videoModalEmbed ? (<>
 <button type="button" className="nav-arrow" id="prevBtn" aria-label={isHi ? "वीडियो बंद करें" : "Close video"} style={{ opacity: 0, pointerEvents: "none" }} tabIndex={-1} />
 <div id="modalBody" style={{ width: "min(92vw, 960px)", aspectRatio: "16/9" }}>
 <iframe
 title={isHi ? "यूट्यूब वीडियो प्लेयर" : "YouTube video player"}
 src={videoModalEmbed}
 className="modal-media"
 style={{ width: "100%", height: "100%", border: "none" }}
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
 allowFullScreen
 />
 </div>
 <button type="button" className="nav-arrow" id="nextBtn" aria-label="" style={{ opacity: 0, pointerEvents: "none" }} tabIndex={-1} />
 </>) : null}
 </div>
 </div>
 </>);
}

function CFCSection({ onExpandYoutube }: { onExpandYoutube: (url: string) => void }) {
 return (<>
 {/* <div className="masonry-header mt-md-60 mt-30 mb-md-40 mb-20">
 <div className="mb-md-0 mb-10">
 <h3>CFC</h3>
 <p>CFC video highlights with the same card experience and popup playback.</p>
 </div>
 </div> */}
 <HorizontalVideoCarousel slides={CFC_VIDEO_ITEMS} onExpandYoutube={onExpandYoutube} />
 </>);
}

function HorizontalVideoCarousel({
 slides,
 onExpandYoutube,
}: {
 slides: VideoGalleryItem[];
 onExpandYoutube: (url: string) => void;
}) {
 const rootRef = useRef<HTMLDivElement>(null);

 const pauseThisRail = useCallback(() => {
 pauseVideosInRoot(rootRef.current);
 }, []);

 if (slides.length === 0) {
 return <p className="section-subtitle" style={{ marginTop: "1rem" }}>No videos in this filter.</p>;
 }

 return (<div ref={rootRef}>
 <div className="success-stories-swiper video-gallery-grid">
 {slides.map((slide, slideIndex) => (<article
 key={`${slide.title}-${slide.youtubeSrc}-${slideIndex}`}
 className="video-gallery-card"
 tabIndex={0}
 role="button"
 aria-label={`Play ${slide.title}`}
 data-video-card
 data-video="true"
 data-district={slide.district}
 data-src={slide.youtubeSrc}
 onClick={(e) => {
 if ((e.target as HTMLElement).closest(".horizontal-controls")) return;
 pauseThisRail();
 onExpandYoutube(slide.youtubeSrc);
 }}
 onKeyDown={(e) => {
 if (e.key !== "Enter" && e.key !== " ") return;
 e.preventDefault();
 pauseThisRail();
 onExpandYoutube(slide.youtubeSrc);
 }}
 >
 <video className="horizontal-video" poster={slide.poster} muted loop playsInline preload="metadata">
 <source src={slide.mp4} type="video/mp4" />
 Your browser does not support the video tag.
 </video>
 <div className="horizontal-overlay">
 <div className="horizontal-content">
 <h4>{slide.title}</h4>
 <p>{slide.desc}</p>
 <span>{slide.handle}</span>
 </div>
 <div className="horizontal-controls">
 <button
 type="button"
 className="play-btn"
 onClick={(e) => {
 e.stopPropagation();
 pauseThisRail();
 onExpandYoutube(slide.youtubeSrc);
 }}
 >
 <i className="fas fa-play" />
 </button>
 </div>
 </div>
 </article>))}
 </div>
 </div>);
}
