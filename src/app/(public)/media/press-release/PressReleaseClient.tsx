"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import PageBanner from "@/components/shared/PageBanner";

type PressItem = {
  src: string;
  category: string;
  alt: string;
};

const PRESS_ITEMS: PressItem[] = [
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b237ec378.jpg", category: "National", alt: "ODOP scheme coverage Hindustan Times" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b93ec8859ae.jpg", category: "National", alt: "ODOP rural economy Times of India" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2afd7e395e.jpg", category: "International", alt: "ODOP international market Economic Times" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2afe6f4236.jpg", category: "Regional", alt: "ODOP artisans credit camp Dainik Jagran" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b27e34dd4.jpg", category: "International", alt: "ODOP GI products global recognition Amar Ujala" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b29a340ab.jpg", category: "National", alt: "ODOP digital portal launch NDTV" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b237ec378.jpg", category: "Regional", alt: "ODOP Conclave 2025 Navbharat Times" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b93ec8859ae.jpg", category: "National", alt: "ODOP Varanasi handloom weavers The Hindu" },
  { src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2afd7e395e.jpg", category: "International", alt: "ODOP Moradabad metalwork exports Business Standard" },
];

const CATEGORIES = ["All", "National", "International", "Regional"] as const;

export default function PressReleaseClient() {
  const lang = useLanguage();
  const isHi = lang === "hi";

  const headingText = isHi ? "समाचारों में ओडीओपी" : "ODOP in News";
  const closeAria = isHi ? "बंद करें" : "Close";
  const previousAria = isHi ? "पिछला" : "Previous";
  const nextAria = isHi ? "अगला" : "Next";
  const pressMediaAlt = isHi ? "प्रेस रिलीज़ मीडिया" : "Press release media";

  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [modalItem, setModalItem] = useState<{ src: string; index: number } | null>(null);

  const filtered = useMemo(
    () => activeCategory === "All" ? PRESS_ITEMS : PRESS_ITEMS.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  const filteredSrcs = useMemo(() => filtered.map((p) => p.src), [filtered]);

  const openModal = useCallback(
    (src: string) => {
      const index = filteredSrcs.indexOf(src);
      setModalItem({ src, index: index >= 0 ? index : 0 });
    },
    [filteredSrcs],
  );

  const closeModal = useCallback(() => setModalItem(null), []);

  const showPrev = useCallback(() => {
    setModalItem((cur) => {
      if (!cur) return cur;
      const next = (cur.index - 1 + filteredSrcs.length) % filteredSrcs.length;
      return { src: filteredSrcs[next], index: next };
    });
  }, [filteredSrcs]);

  const showNext = useCallback(() => {
    setModalItem((cur) => {
      if (!cur) return cur;
      const next = (cur.index + 1) % filteredSrcs.length;
      return { src: filteredSrcs[next], index: next };
    });
  }, [filteredSrcs]);

  useEffect(() => {
    if (!modalItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [modalItem]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (modalItem && e.key === "ArrowLeft") showPrev();
      if (modalItem && e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal, modalItem, showNext, showPrev]);

  useEffect(() => {
    const onPinClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest?.(".pin-card") as HTMLElement | null;
      if (!card || !document.body.contains(card)) return;
      const src = card.dataset.src || card.querySelector("img")?.getAttribute("src");
      if (!src) return;
      e.preventDefault();
      openModal(src);
    };
    document.addEventListener("click", onPinClick);
    return () => document.removeEventListener("click", onPinClick);
  }, [openModal]);

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png"
        eyebrow={isHi ? "मीडिया" : "Media"}
        current={isHi ? "प्रेस रिलीज़" : "Press Release"}
        className="mt-0 mt-sm-0"
      />

      {/* ── Main content ── */}
      <main className="main-content gallery-page">
        <section className="section gallery-content-section">
          <div className="container gallery-container">
            <div className="mt-md-60 mt-30 mb-md-40 mb-20">
              <h1 className="resource-heading-common">{headingText}</h1>
            </div>

            {/* Masonry grid — same structure as gallery */}
            <section className="masonry-container">
              {filtered.map((item, i) => (
                <div
                  key={`${item.src}-${item.category}-${i}`}
                  className="pin-card"
                  data-video="false"
                  data-src={item.src}
                >
                  <div className="media-container">
                    <Image src={item.src} className="pin-image" alt={item.alt} width={400} height={300} sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={75} unoptimized />
                  </div>
                </div>
              ))}
            </section>

          </div>
        </section>
      </main>

      {/* ── Lightbox modal ── */}
      <div
        id="modal"
        style={{ display: modalItem ? "flex" : "none" }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal-content-wrapper">
          <i
            className="fa-solid fa-xmark"
            id="closeBtn"
            role="button"
            tabIndex={0}
            aria-label={closeAria}
            onClick={closeModal}
            onKeyDown={(e) => e.key === "Enter" && closeModal()}
          />
          {modalItem && (
            <>
              <button
                type="button"
                className="nav-arrow"
                id="prevBtn"
                aria-label={previousAria}
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <div id="modalBody">
                <Image src={modalItem.src} className="modal-media" alt={pressMediaAlt} width={800} height={600} sizes="(max-width: 640px) 100vw, 800px" quality={85} unoptimized />
              </div>
              <button
                type="button"
                className="nav-arrow"
                id="nextBtn"
                aria-label={nextAria}
                onClick={(e) => { e.stopPropagation(); showNext(); }}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
