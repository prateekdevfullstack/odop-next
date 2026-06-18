"use client";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/shared/PageBanner";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchPublicGalleryEvents, fetchAllEventCategories, type EventCategory, } from "@/services/events.service";
import { resolvePublicAssetUrl } from "@/lib/scheme-media";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { EventCardsSkeleton, MasonrySkeleton } from "@/bones/PhotoGallerySkeleton";
type PinItem = { src: string; thumbSrc?: string; district: string; alt: string };
type GalleryMonth = { month: number; name?: string; count?: number };
type GalleryMonthValue = number | GalleryMonth;
type GalleryImageItem = { image?: string | null };
type GalleryEventItem = {
  title?: string | null;
  galleries?: GalleryImageItem[] | null;
  category?: { name?: string | null } | null;
};
type GalleryResponseShape = {
  rows?: unknown;
  data?: unknown;
  months?: unknown;
};
const MONTH_NAMES = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  hi: [
    "जनवरी",
    "फ़रवरी",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अगस्त",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर",
  ],
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toGalleryRows(value: unknown): GalleryEventItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is GalleryEventItem => isRecord(item));
}

function toGalleryMonths(value: unknown): GalleryMonthValue[] {
  if (!Array.isArray(value)) return [];

  const months: GalleryMonthValue[] = [];
  value.forEach((item) => {
    if (typeof item === "number") {
      months.push(item);
      return;
    }

    if (isRecord(item) && typeof item.month === "number") {
      months.push({
        month: item.month,
        name: typeof item.name === "string" ? item.name : undefined,
        count: typeof item.count === "number" ? item.count : undefined,
      });
    }
  });

  return months;
}

const WORKSHOP_ALL: PinItem[] = [
  { district: "Agra", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b971ba6aff1.jpeg", alt: "ODOP workshop Agra" },
  { district: "Aligarh", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9723197a75.jpeg", alt: "ODOP workshop Aligarh" },
  { district: "Ambedkar Nagar", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9721566983.jpeg", alt: "ODOP workshop Ambedkar Nagar" },
  { district: "Amethi", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b971fa950c7.jpeg", alt: "ODOP workshop Amethi" },
  { district: "Amroha", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9734db6118.jpeg", alt: "ODOP workshop Amroha" },
  {
    district: "Agra",
    src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9731a42c95.jpeg",
    thumbSrc: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9733411c12.jpeg",
    alt: "ODOP workshop Agra",
  },
  { district: "Aligarh", src: "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b9710e86992.jpeg", alt: "ODOP workshop Aligarh" },
];

/** First 20 conclave photos (numeric order; `im12` not used on disk). */
const CONCLAVE_GALLERY_IMAGE_SRCS = [
  "/assets/img/gallery/conclave/im1.jpg",
  "/assets/img/gallery/conclave/im2.jpg",
  "/assets/img/gallery/conclave/im3.jpg",
  "/assets/img/gallery/conclave/im4.jpg",
  "/assets/img/gallery/conclave/im5.jpg",
  "/assets/img/gallery/conclave/im6.jpg",
  "/assets/img/gallery/conclave/im7.jpg",
  "/assets/img/gallery/conclave/im8.jpg",
  "/assets/img/gallery/conclave/im9.jpg",
  "/assets/img/gallery/conclave/im10.jpg",
  "/assets/img/gallery/conclave/im11.jpg",
  "/assets/img/gallery/conclave/im13.jpg",
  "/assets/img/gallery/conclave/im14.jpg",
  "/assets/img/gallery/conclave/im15.jpg",
  "/assets/img/gallery/conclave/im16.jpg",
  "/assets/img/gallery/conclave/im17.jpg",
  "/assets/img/gallery/conclave/im18.jpg",
  "/assets/img/gallery/conclave/im19.jpg",
  "/assets/img/gallery/conclave/im20.jpg",
  "/assets/img/gallery/conclave/im21.jpg",
] as const;

const FOUNDATION_DAY_2026_GALLERY_IMAGE_SRCS = [
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM1.jpg",
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM2.jpg",
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM3.jpg",
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM4.jpg",
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM5.jpg",
  "/assets/img/gallery/uttar-pradesh-foundation-day-2026/IM6.jpg",
] as const;

const PRESS_SRCS = [
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b237ec378.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68b93ec8859ae.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2afd7e395e.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2afe6f4236.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b27e34dd4.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68c2b29a340ab.jpg",
];

const CREDIT_SRCS = [
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc16a56ece7.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc17211c9cd.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc16fd5079e.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc16d73e459.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc174ac7406.jpg",
  "https://scheme.cmyuva.org.in/public/uploads/cmyuva_gallery/68bc15471df48.jpg",
];

type GalleryParams = {
  category_id?: number;
  limit?: number;
  yearFilter?: string | number;
  startDate?: string;
};

function PinMasonry({ items }: { items: PinItem[] }) {
  return (<section className="masonry-container">
    {items.map((item, i) => (<div key={`${item.src}-${i}`} className="pin-card" data-video="false" data-district={item.district} data-src={item.src}>
      <div className="media-container">
        <Image src={item.thumbSrc ?? item.src} className="pin-image" alt={item.alt} width={400} height={300} sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={75} unoptimized />
      </div>
    </div>))}
  </section>);
}

// ─── Main page component ───────────────────────────────────────────────────

export default function GalleryPageClient() {
  const [imageModal, setImageModal] = useState<{ src: string; index: number } | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [eventsGallery, setEventsGallery] = useState<GalleryEventItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [months, setMonths] = useState<GalleryMonthValue[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const loadEventsGallery = async (params: GalleryParams = {}) => {
    try {
      const response = await fetchPublicGalleryEvents(params);

      if (response.success && response.data) {
        const resData: unknown = response.data;
        const responseShape = isRecord(resData) ? (resData as GalleryResponseShape) : null;
        const rowsSource = responseShape?.rows ?? responseShape?.data ?? resData;

        setEventsGallery(toGalleryRows(rowsSource));
        setMonths(toGalleryMonths(responseShape?.months));
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const response = await fetchAllEventCategories();
        if (response.success && response.data) {
          let cats: EventCategory[] = [];
          if (Array.isArray(response.data.data)) {
            cats = response.data.data;
          } else if (Array.isArray(response.data)) {
            cats = response.data as unknown as EventCategory[];
          }
          setCategories(cats);
          // By default, load events for the first (active) category
          if (cats.length > 0) {
            loadEventsGallery({ category_id: cats[0].value, yearFilter: new Date().getFullYear() });
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setGalleryLoading(false);
      }
    }
    init();
  }, []);

  const handleCategoryClick = (categoryId: number, index: number) => {
    const param: GalleryParams = { category_id: categoryId };
    // Preserve the currently selected year filter so months stay visible
    if (selectedYear) {
      param.yearFilter = String(selectedYear);
    }
    // Preserve the currently selected month filter
    // if (selectedYear && selectedMonth) {
    //   param.startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    // }
    loadEventsGallery(param);
    setActiveIndex(index);
    setSelectedMonth(0);
  };

  const handleSelectedYearClick = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    const param: GalleryParams = { yearFilter: String(year), category_id: categories[activeIndex]?.value };
    loadEventsGallery(param);
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    const param: GalleryParams = {
      category_id: categories[activeIndex]?.value,
      startDate: `${selectedYear}-${String(month).padStart(2, "0")}`,
    };
    loadEventsGallery(param);
  };

  const modalGallerySrcs = useMemo(() => {
    const workshop = WORKSHOP_ALL.map((p) => p.src);
    return [
      ...workshop,
      ...CONCLAVE_GALLERY_IMAGE_SRCS,
      ...FOUNDATION_DAY_2026_GALLERY_IMAGE_SRCS,
      ...PRESS_SRCS,
      ...CREDIT_SRCS,
    ];
  }, []);

  const openImageModal = useCallback((src: string) => {
    const index = modalGallerySrcs.indexOf(src);
    setImageModal({ src, index: index >= 0 ? index : 0 });
  },
    [modalGallerySrcs]);

  const closeModals = useCallback(() => {
    setImageModal(null);
  }, []);

  const showPrevImage = useCallback(() => {
    setImageModal((cur) => {
      if (!cur) return cur;
      const next = (cur.index - 1 + modalGallerySrcs.length) % modalGallerySrcs.length;
      return { src: modalGallerySrcs[next], index: next };
    });
  }, [modalGallerySrcs]);

  const showNextImage = useCallback(() => {
    setImageModal((cur) => {
      if (!cur) return cur;
      const next = (cur.index + 1) % modalGallerySrcs.length;
      return { src: modalGallerySrcs[next], index: next };
    });
  }, [modalGallerySrcs]);

  useEffect(() => {
    if (!imageModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [imageModal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
      if (imageModal && e.key === "ArrowLeft") showPrevImage();
      if (imageModal && e.key === "ArrowRight") showNextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModals, imageModal, showNextImage, showPrevImage]);

  useEffect(() => {
    const onPinClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest?.(".pin-card") as HTMLElement | null;
      if (!card || !document.body.contains(card)) return;
      const src = card.dataset.src || card.querySelector("img")?.getAttribute("src");
      if (!src) return;
      e.preventDefault();
      openImageModal(src);
    };
    document.addEventListener("click", onPinClick);
    return () => document.removeEventListener("click", onPinClick);
  }, [openImageModal]);

  const isHi = useLanguage() === "hi";

  return (<div className="gallery-page">
    <PageBanner
      imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png"
      eyebrow={isHi ? "मीडिया" : "Media"}
      current={isHi ? "फोटो गैलरी" : "Photo Gallery"}
    />

    <main className="main-content">
      <section className="section gallery-content-section">
        <div className="container gallery-container">
          <div className="resource-heading-box gallery-page-heading">
            <h1 className="resource-heading-common">
              {isHi ? "ओडीओपी फोटो गैलरी" : "ODOP Photo Gallery"}
            </h1>
          </div>
          <BoneyardSkeleton
            name="photo-gallery-content"
            loading={galleryLoading}
            fallback={
              <>
                <EventCardsSkeleton />
                <div className="skeleton-line" style={{ width: "200px", height: "24px" }} />
                <MasonrySkeleton count={7} />
              </>
            }
          >
            <EventCards
              categories={categories}
              activeIndex={activeIndex}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              months={months}
              onCategoryClick={handleCategoryClick}
              onYearClick={handleSelectedYearClick}
              onMonthClick={handleMonthClick}
              isHi={isHi}
            />

            <WorkshopsBlock
              eventsGallery={eventsGallery}
              categories={categories}
              activeIndex={activeIndex}
              isHi={isHi}
            />
          </BoneyardSkeleton>

          <UpConclaveBlock />

          <FoundationDay2026GalleryBlock />

          <CreditCampBlock />

          <GalleryTabsSync />

        </div>
      </section>
    </main>

    {/* Image modal */}
    <div
      id="modal"
      style={{ display: imageModal ? "flex" : "none" }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModals();
      }}
    >
      <div className="modal-content-wrapper">
        <i className="fa-solid fa-xmark" id="closeBtn" role="button" tabIndex={0} aria-label={isHi ? "बंद करें" : "Close"} onClick={closeModals} onKeyDown={(e) => e.key === "Enter" && closeModals()} />
        {imageModal ? (<>
          <button type="button" className="nav-arrow" id="prevBtn" aria-label={isHi ? "पिछली फोटो" : "Previous"} onClick={(e) => { e.stopPropagation(); showPrevImage(); }}>
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div id="modalBody">
            <Image src={imageModal.src} className="modal-media" alt={isHi ? "गैलरी फोटो" : "Gallery media"} width={800} height={600} sizes="(max-width: 640px) 100vw, 800px" quality={85} unoptimized />
          </div>
          <button type="button" className="nav-arrow" id="nextBtn" aria-label={isHi ? "अगली फोटो" : "Next"} onClick={(e) => { e.stopPropagation(); showNextImage(); }}>
            <i className="fa-solid fa-chevron-right" />
          </button>
        </>) : null}
      </div>
    </div>
  </div>);
}

// ─── Photo section components ──────────────────────────────────────────────

interface WorkshopsBlockProps {
  eventsGallery: GalleryEventItem[];
  categories: EventCategory[];
  activeIndex: number;
  isHi: boolean;
}

function WorkshopsBlock({ eventsGallery, categories, activeIndex, isHi }: WorkshopsBlockProps) {
  const galleryItems: PinItem[] = useMemo(() => {
    return eventsGallery.flatMap((event) =>
      (event.galleries || [])
        .filter((g): g is { image: string } => typeof g.image === "string" && g.image.length > 0)
        .map((g) => ({
          src: resolvePublicAssetUrl(g.image),
          alt: event.title || (isHi ? "गैलरी फोटो" : "Gallery image"),
          district: event.category?.name || "",
        }))
    );
  }, [eventsGallery, isHi]);

  const heading = categories[activeIndex]?.label || "Events";

  return (<>
    <div className="tab-content">
      <h1 className="resource-heading-gallery">{heading}</h1>
      <div className="tab-pane active" id="all-content">
        {galleryItems.length > 0 ? (
          <PinMasonry items={galleryItems} />
        ) : (
          <div className="empty-gallery-message">
            <p style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
              {isHi ? "कोई फोटो उपलब्ध नहीं है" : "No Photo"}
            </p>
          </div>
        )}
      </div>
    </div>
  </>);
}

/** Mirrors `initGalleryTabs` in main.js: tabs in `.gallery-filter-tabs` toggle the next sibling `.tab-pane` by id. */
function GalleryTabsSync() {
  useEffect(() => {
    const sections = document.querySelectorAll(".gallery-filter-tabs");
    const cleanups: Array<() => void> = [];

    sections.forEach((tabSection) => {
      const buttons = tabSection.querySelectorAll<HTMLButtonElement>(".gallery-tab");
      const header = tabSection.closest(".masonry-header");
      const tabContent = header?.nextElementSibling;
      if (!tabContent?.classList.contains("tab-content")) return;

      const tabPanes = tabContent.querySelectorAll(".tab-pane");

      const onClick = (event: Event) => {
        const btn = (event.target as HTMLElement).closest(".gallery-tab") as HTMLButtonElement | null;
        if (!btn || !tabSection.contains(btn)) return;

        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter") || "all";
        let paneId = `${filterValue.toLowerCase().replace(/\s+/g, "-")}-content`;
        let activePane = tabContent.querySelector(`#${CSS.escape(paneId)}`);

        if (!activePane) {
          paneId = `success-${filterValue.toLowerCase().replace(/\s+/g, "-")}-content`;
          activePane = tabContent.querySelector(`#${CSS.escape(paneId)}`);
        }

        tabPanes.forEach((pane) => pane.classList.remove("active"));
        activePane?.classList.add("active");

      };

      tabSection.addEventListener("click", onClick);
      cleanups.push(() => tabSection.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

function UpConclaveBlock() {
  return (<>
    <div className="resource-heading-container">
      {/* <h1 className="resource-heading-gallery">Special Sourcing Show (Guwahati)</h1> */}
    </div>
    {/* <SimplePinGrid srcs={[...CONCLAVE_GALLERY_IMAGE_SRCS]} alt="ODOP Conclave 2025" /> */}
  </>);
}

function FoundationDay2026GalleryBlock() {
  return (<>
    {/* <SimplePinGrid srcs={[...FOUNDATION_DAY_2026_GALLERY_IMAGE_SRCS]} alt="Foundation Day 2026" /> */}
  </>);
}

function CreditCampBlock() {
  return (<>
    {/* <SimplePinGrid srcs={CREDIT_SRCS} alt="ODOP Credit Camp" /> */}
  </>);
}


const now = new Date();
const startYear = new Date(now.getFullYear(), now.getMonth() - 6).getFullYear();
const endYear = now.getFullYear();
const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);


interface EventCardsProps {
  categories: EventCategory[];
  activeIndex: number;
  selectedYear: number;
  selectedMonth: number | null;
  months: GalleryMonthValue[];
  onCategoryClick: (categoryId: number, index: number) => void;
  onYearClick: (year: number) => void;
  onMonthClick: (month: number) => void;
  isHi: boolean;
}

const getMonthNumber = (month: GalleryMonthValue) =>
  typeof month === "number" ? month : month.month;

const getMonthName = (
  month: GalleryMonthValue,
  isHi: boolean,
) => {
  const monthNumber = getMonthNumber(month);
  return MONTH_NAMES[isHi ? "hi" : "en"][monthNumber - 1] || (isHi ? "अमान्य माह" : "Invalid Month");
};

function EventCards({ categories, activeIndex, selectedYear, selectedMonth, months, onCategoryClick, onYearClick, onMonthClick, isHi }: EventCardsProps) {
  return (
    <div className="events-wrapper">
      <div className="cards-container">
        {categories.map((item, index) => {
          return (
            <React.Fragment key={item?.value || index}>
              <Link
                href="#"
                className="event-card-link"
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(item?.value, index);
                }}
              >
                <div
                  className={`event-card ${activeIndex === index ? "active" : ""
                    } `}
                  style={{ background: activeIndex === index ? "white" : "#ECECEC" }}
                >
                  {activeIndex === index ? (
                    <div className="logo-circle">
                      <Image
                        src="/icon/Frame 172.svg"
                        alt="ODOP Logo"
                        width={40}
                        height={40}
                      />
                    </div>
                  ) : (
                    <div className="logo-circle">
                      <Image
                        src="/icon/Frame 172 (1).svg"
                        alt="ODOP Logo"
                        width={40}
                        height={40}
                      />
                    </div>
                  )}

                  {activeIndex === index ? (
                    <div className="watermark">
                      <Image
                        width={224.52}
                        height={168.53}
                        src="/icon/collection-traditional-indian-cultural-religious-symbols-icons 5.svg"
                        alt="Watermark"
                      />
                    </div>
                  ) : (
                    <div className="watermark">
                      <Image
                        width={224.52}
                        height={168.53}
                        src="/icon/collection-traditional-indian-cultural-religious-symbols-icons 5 (1).svg"
                        alt="Watermark"
                      />
                    </div>
                  )}
                  <h3>{item?.label}</h3>
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      <div className="month-tabs">
        {years.map((year) => (
          <button
            key={year}
            className={`month-btn ${selectedYear === year ? "selected" : ""
              }`}

            onClick={() => onYearClick(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {months.length > 0 && (
        <div className="month-sub-tabs">
          {months.map((m, index) => {
            const monthNumber = getMonthNumber(m);
            return (
              <button
                key={index}
                className={`month-btn ${selectedMonth === monthNumber ? "selected" : ""}`}
                onClick={() => monthNumber && onMonthClick(monthNumber)}
              >
                {getMonthName(m, isHi)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
