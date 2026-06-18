"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import { useLanguage } from "@/hooks/useLanguage";

const ODOP_CELL_ASSET_BASE = "/assets/img/ODOPCELL";
const BRAND_ODOP_BACKGROUND = `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_1.jpg")}`;
const BRAND_ODOP_MAP = `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_UP MAP.png")}`;
const BRAND_ODOP_LOGO = "/assets/img/logo.png";
const GLOBAL_CONNECT_BACKGROUND = `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_2.jpg")}`;
const GLOBAL_CONNECT_IMAGE = `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_Photo.png")}`;

const PILLAR_SLIDES = [
  {
    key: "brand-heritage",
    label: "Stakeholders",
    background: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_3.jpg")}`,
    image: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_HERITAGE.png")}`,
    imageAlt: "Hand-painted ODOP heritage pottery and crafts",
    imageWidth: 6000,
    imageHeight: 4995,
    title: "HERITAGE",
    subtitle: "(Identity)",
    body: "The traditional knowledge, craftsmanship, and cultural legacy unique to each district, that represents, GI-tagged products, Traditional crafts, Indigenous techniques, Cultural storytelling, and Regional pride.",
    quote: "\"Preserving Uttar Pradesh's living traditions.\"",
    hi: {
      title: "विरासत",
      subtitle: "(Heritage)",
      body: "प्रत्येक जनपद की अपनी विशिष्ट पहचान, पारंपरिक ज्ञान, शिल्प कौशल और सांस्कृतिक धरोहर है। ओडीओपी इन जीवंत परंपराओं को संरक्षित करते हुए उन्हें नई पीढ़ियों तक पहुँचाने का कार्य करता है। यह पहल स्थानीय उत्पादों की ऐतिहासिक एवं सांस्कृतिक महत्ता को बनाए रखते हुए उन्हें भविष्य के लिए सुरक्षित करती है।",
      quote: "“उत्तर प्रदेश की जीवंत परंपराओं का संरक्षण।”",
    },
  },
  {
    key: "brand-innovation",
    label: "Stakeholders",
    background: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_4.jpg")}`,
    image: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_INNOVATION.png")}`,
    imageAlt: "Modern ODOP product innovation and design",
    imageWidth: 6000,
    imageHeight: 3989,
    title: "INNOVATION",
    subtitle: "(Evolution)",
    body: "Modernising traditional industries while retaining authenticity, that represents, Technology integration, Design intervention, E-commerce, Digital promotion, Modern packaging, Product diversification.",
    quote: "\"Tradition adapting for the future.\"",
    hi: {
      title: "नवाचार",
      subtitle: "(Innovation)",
      body: "ओडीओपी परंपरागत उद्योगों को आधुनिक तकनीक, डिज़ाइन, ई-कॉमर्स, डिजिटल प्रचार और उत्पाद विविधीकरण के माध्यम से भविष्य की आवश्यकताओं के अनुरूप विकसित करता है। नवाचार के माध्यम से स्थानीय उत्पादों की गुणवत्ता, उपयोगिता और वैश्विक प्रतिस्पर्धात्मकता को बढ़ावा दिया जाता है।",
      quote: "“परंपरा और आधुनिकता का संगम।”",
    },
  },
  {
    key: "brand-empowerment",
    label: "Stakeholders",
    background: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_5.jpg")}`,
    image: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_EMPOWERMENT.png")}`,
    imageAlt: "Empowered ODOP artisans and entrepreneurs at work",
    imageWidth: 4800,
    imageHeight: 4849,
    title: "EMPOWERMENT",
    subtitle: "(Impact)",
    body: "Strengthening livelihoods through policy support, finance, skilling, infrastructure, and market access, that represents, Skill development, Toolkits, Common Facility Centres, Financial assistance, Export promotion, Branding & packaging.",
    quote: "\"Creating sustainable livelihoods.\"",
    hi: {
      title: "सशक्तिकरण",
      subtitle: "(Empowerment)",
      body: "वित्तीय सहायता, कौशल विकास, टूलकिट, कॉमन फैसिलिटी सेंटर, ब्रांडिंग, विपणन और निर्यात संवर्धन जैसी पहलों के माध्यम से ओडीओपी आजीविका के नए अवसर सृजित करता है और स्थानीय उद्योगों को मजबूत बनाता है। यह कार्यक्रम कारीगरों और उद्यमियों को आत्मनिर्भर बनने तथा आर्थिक प्रगति की नई संभावनाओं तक पहुँचने में सहायता प्रदान करता है।",
      quote: "“स्थायी आजीविका और आत्मनिर्भरता का निर्माण।”",
    },
  },
  {
    key: "brand-global-pillar",
    label: "Stakeholders",
    background: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP WEBSITE BANNERS Blank_6.jpg")}`,
    image: `${ODOP_CELL_ASSET_BASE}/${encodeURIComponent("ODOP_GLOBAL CONNECT.png")}`,
    imageAlt: "ODOP products connecting to global markets",
    imageWidth: 5819,
    imageHeight: 6000,
    title: "GLOBAL CONNECT",
    subtitle: "(Achievement)",
    body: "Taking district products from local clusters to national and international markets, that represents Exports, International exhibitions, Buyer-seller meets, Retail partnerships, Tourism integration.",
    quote: "\"Local products with global recognition.\"",
    hi: {
      title: "वैश्विक संपर्क",
      subtitle: "(Global Connect)",
      body: "स्थानीय उत्पादों को राष्ट्रीय एवं अंतरराष्ट्रीय बाजारों तक पहुँचाना ओडीओपी की प्रमुख उपलब्धियों में से एक है। प्रदर्शनियों, खरीदार-विक्रेता सम्मेलनों, निर्यात संवर्धन तथा वैश्विक साझेदारियों के माध्यम से जनपदों की पहचान विश्व मंच तक पहुँच रही है। यह पहल स्थानीय उत्पादों को वैश्विक अवसरों से जोड़ते हुए उनकी पहुँच और प्रतिष्ठा को निरंतर विस्तारित कर रही है।",
      quote: "“स्थानीय उत्पाद, वैश्विक पहचान।”",
    },
  },
] as const;

const BRAND_INTRO_HI = {
  title: "ब्रांड ओडीओपी",
  subtitle: "एक जनपद, एक उत्पाद — विरासत से वैश्विक पहचान तक",
  paragraphs: [
    "एक जनपद एक उत्पाद (ODOP) उत्तर प्रदेश सरकार का एक अग्रणी विकास कार्यक्रम है, जिसका उद्देश्य प्रदेश के प्रत्येक जनपद की विशिष्ट पारंपरिक उत्पाद पहचान को संरक्षित, संवर्धित और वैश्विक स्तर पर स्थापित करना है।",
    "ओडीओपी स्थानीय कौशल, शिल्प परंपराओं, कृषि आधारित उत्पादों तथा सूक्ष्म, लघु एवं मध्यम उद्यमों को सशक्त बनाते हुए उन्हें आधुनिक बाजारों, नई तकनीकों और वैश्विक अवसरों से जोड़ता है। यह कार्यक्रम कारीगरों, बुनकरों, शिल्पकारों, किसानों एवं उद्यमियों के लिए एक समग्र पारिस्थितिकी तंत्र का निर्माण करता है, जहाँ परंपरा और नवाचार साथ-साथ आगे बढ़ते हैं।",
    "वित्तीय सहायता, कौशल विकास, आधुनिक अवसंरचना, ब्रांडिंग, विपणन एवं निर्यात संवर्धन के माध्यम से ओडीओपी स्थानीय उत्पादों को राष्ट्रीय एवं अंतरराष्ट्रीय पहचान दिलाने की दिशा में निरंतर कार्य कर रहा है।",
  ],
  footer: ["विरासत में निहित", "कारीगरों को समर्पित", "वैश्विक पहचान की ओर अग्रसर"],
};

const GLOBAL_CONNECT_HI = {
  title: "जनशक्ति",
  subtitle: "(People)",
  body: "ओडीओपी का केंद्रबिंदु वे लोग हैं जो उत्तर प्रदेश की पारंपरिक उत्पाद विरासत को जीवंत बनाए हुए हैं। कारीगर, बुनकर, शिल्पकार, किसान, उद्यमी, स्वयं सहायता समूह, निर्यातक, डिजाइनर, संस्थान तथा उपभोक्ता—सभी इस विकास यात्रा के सहभागी हैं।",
  quote: "“समृद्धि के केंद्र में लोग।”",
};

const PILLAR_SLIDE_ORDER = [
  "brand-heritage",
  "brand-empowerment",
  "brand-innovation",
  "brand-global-pillar",
] as const;

const orderedPillarSlides = [...PILLAR_SLIDES].sort(
  (a, b) => PILLAR_SLIDE_ORDER.indexOf(a.key) - PILLAR_SLIDE_ORDER.indexOf(b.key),
);

const slides = [
  {
    type: "brand-intro" as const,
    key: "brand-odop-intro",
    assets: [BRAND_ODOP_BACKGROUND, BRAND_ODOP_MAP, BRAND_ODOP_LOGO],
  },
  {
    type: "global-connect" as const,
    key: "global-connect",
    assets: [GLOBAL_CONNECT_BACKGROUND, GLOBAL_CONNECT_IMAGE],
  },
  ...orderedPillarSlides.map((pillar) => ({
    type: "pillar" as const,
    key: pillar.key,
    pillar,
    assets: [pillar.background, pillar.image],
  })),
];

const slideAssets = slides.flatMap((slide) => slide.assets);

const AUTOPLAY_MS = 5000;

function BrandCarouselNav({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="odop-brand-carousel-nav" aria-label="Banner navigation">
      <button
        type="button"
        className="odop-brand-carousel-arrow odop-brand-carousel-arrow--prev"
        onClick={onPrev}
        aria-label="Previous banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        className="odop-brand-carousel-arrow odop-brand-carousel-arrow--next"
        onClick={onNext}
        aria-label="Next banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export default function OdopBrandCarousel() {
  const lang = useLanguage();
  const isHi = lang === "hi";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    let cancelled = false;
    let settled = 0;
    let anyLoaded = false;

    slideAssets.forEach((src) => {
      const img = new window.Image();
      const finish = (ok: boolean) => {
        if (cancelled) return;
        if (ok) anyLoaded = true;
        settled += 1;
        if (settled >= slideAssets.length) {
          setLoadFailed(!anyLoaded);
          setIsReady(true);
        }
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasMultiple) return;
    if (isPaused) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [hasMultiple, isPaused]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  if (slides.length === 0) {
    return (
      <section className="odop-brand-section" id="odop-brand" aria-label={isHi ? "ब्रांड ओडीओपी" : "Brand ODOP"}>
        <div className="container odop-brand-section-inner">
          <CapsuleHeading reveal>
            {isHi ? "ब्रांड ओडीओपी" : "Brand ODOP"}
          </CapsuleHeading>
          <p className="odop-brand-empty" role="status">
            Brand banners are not available at the moment. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="odop-brand-section" id="odop-brand" aria-label={isHi ? "ब्रांड ओडीओपी" : "Brand ODOP"}>
      <div className="container odop-brand-section-inner">
        <CapsuleHeading reveal className="mb-24">
        {isHi ? "ब्रांड ओडीओपी" : "Brand ODOP"}
        </CapsuleHeading>
      </div>

      <div className="odop-brand-carousel-bleed">
        <div
          className={`odop-brand-carousel group relative${!isReady ? " is-loading" : ""}${loadFailed ? " is-error" : ""}`}
          aria-roledescription={hasMultiple ? "carousel" : undefined}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {!isReady && (
            <div className="odop-brand-carousel-skeleton" aria-live="polite" aria-busy="true">
              <span className="sr-only">Loading brand banners</span>
            </div>
          )}

          {loadFailed && isReady ? (
            <div className="container">
              <p className="odop-brand-empty" role="alert">
                Unable to load brand banners. Please refresh the page or try again later.
              </p>
            </div>
          ) : (
            <>
              <div
                className="odop-brand-carousel-viewport overflow-hidden"
                aria-hidden={!isReady}
              >
                <div
                  className="odop-brand-carousel-track flex w-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={slide.key} className="odop-brand-carousel-slide shrink-0 w-full">
                      {slide.type === "brand-intro" ? (
                        <article className="odop-brand-intro-slide" aria-label="Brand ODOP introduction">
                          <Image
                            src={BRAND_ODOP_BACKGROUND}
                            alt=""
                            className="odop-brand-intro-bg"
                            fill
                            sizes="100vw"
                            loading="eager"
                            aria-hidden="true"
                          />
                          <div className={`odop-brand-intro-content${isHi ? " is-hindi" : ""}`}>
                            <div className="odop-brand-intro-map-wrap">
                              <Image
                                src={BRAND_ODOP_LOGO}
                                alt="One District One Product Uttar Pradesh"
                                className="odop-brand-intro-logo"
                                width={151}
                                height={78}
                                loading="eager"
                              />
                              <Image
                                src={BRAND_ODOP_MAP}
                                alt="Uttar Pradesh ODOP product map"
                                className="odop-brand-intro-map"
                                width={6000}
                                height={5635}
                                loading="eager"
                              />
                            </div>
                            {isHi ? (
                              <div className="odop-brand-intro-copy is-hindi" lang="hi">
                                <h3>{BRAND_INTRO_HI.title}</h3>
                                <p className="odop-brand-intro-subtitle">{BRAND_INTRO_HI.subtitle}</p>
                                {BRAND_INTRO_HI.paragraphs.map((para, i) => (
                                  <p key={i}>{para}</p>
                                ))}
                                <strong>
                                  {BRAND_INTRO_HI.footer.map((part, i) => (
                                    <span key={part}>
                                      {i > 0 && <span> | </span>}
                                      {part}
                                    </span>
                                  ))}
                                </strong>
                              </div>
                            ) : (
                              <div className="odop-brand-intro-copy">
                                <h3>Brand ODOP</h3>
                                <p>
                                  ODOP (One District One Product) is a transformative development
                                  initiative that identifies, revives, promotes, and scales the
                                  unique traditional products and industries of each district of
                                  Uttar Pradesh by empowering artisans, enabling entrepreneurship,
                                  preserving heritage, and connecting local excellence to global
                                  markets.
                                </p>
                                <strong>
                                  Rooted in Heritage <span>|</span> Empowering Artisans <span>|</span>{" "}
                                  Evolving Globally
                                </strong>
                              </div>
                            )}
                          </div>
                        </article>
                      ) : slide.type === "global-connect" ? (
                        <article className="odop-brand-global-slide" aria-label="People stakeholders">
                          <Image
                            src={GLOBAL_CONNECT_BACKGROUND}
                            alt=""
                            className="odop-brand-global-bg"
                            fill
                            sizes="100vw"
                            loading={index === 0 ? "eager" : "lazy"}
                            aria-hidden="true"
                          />
                          <div className="odop-brand-global-content">
                            <div className="odop-brand-global-media">
                              <Image
                                src={GLOBAL_CONNECT_IMAGE}
                                alt="ODOP stakeholders including artisans, craftspersons and MSME workers"
                                className="odop-brand-global-image"
                                width={6000}
                                height={4083}
                                loading="lazy"
                              />
                            </div>
                            {isHi ? (
                              <div className="odop-brand-global-copy is-hindi" lang="hi">
                                <h3>{GLOBAL_CONNECT_HI.title}</h3>
                                <span>{GLOBAL_CONNECT_HI.subtitle}</span>
                                <p>{GLOBAL_CONNECT_HI.body}</p>
                                <strong>{GLOBAL_CONNECT_HI.quote}</strong>
                              </div>
                            ) : (
                              <div className="odop-brand-global-copy">
                                <h3>PEOPLE</h3>
                                <span>(Stakeholders)</span>
                                <p>
                                  The human ecosystem powering ODOP, that includes, Artisans,
                                  Weavers, Craftsmen, Farmers, MSMEs, SHGs & Women entrepreneurs,
                                  Traders & Exporters, Designers and Innovators, Government &
                                  Institutions, Buyers & Consumers.
                                </p>
                                <strong>&ldquo;People at the heart of prosperity.&rdquo;</strong>
                              </div>
                            )}
                          </div>
                        </article>
                      ) : (
                        <article className="odop-brand-global-slide" aria-label={slide.pillar.title}>
                          <Image
                            src={slide.pillar.background}
                            alt=""
                            className="odop-brand-global-bg"
                            fill
                            sizes="100vw"
                            loading="lazy"
                            aria-hidden="true"
                          />
                          <div className="odop-brand-global-content">
                            <div className="odop-brand-global-media">
                              <Image
                                src={slide.pillar.image}
                                alt={slide.pillar.imageAlt}
                                className="odop-brand-global-image"
                                width={slide.pillar.imageWidth}
                                height={slide.pillar.imageHeight}
                                loading="lazy"
                              />
                            </div>
                            {isHi ? (
                              <div className="odop-brand-global-copy is-hindi" lang="hi">
                                <h3>{slide.pillar.hi.title}</h3>
                                <span>{slide.pillar.hi.subtitle}</span>
                                <p>{slide.pillar.hi.body}</p>
                                <strong>{slide.pillar.hi.quote}</strong>
                              </div>
                            ) : (
                              <div className="odop-brand-global-copy">
                                <h3>{slide.pillar.title}</h3>
                                <span>{slide.pillar.subtitle}</span>
                                <p>{slide.pillar.body}</p>
                                <strong>{slide.pillar.quote}</strong>
                              </div>
                            )}
                          </div>
                        </article>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {hasMultiple && isReady && !loadFailed && (
                <div
                  className="odop-brand-carousel-dots"
                  role="tablist"
                  aria-label="Banner indicators"
                >
                  {slides.map((slide, index) => (
                    <button
                      key={slide.key}
                      type="button"
                      role="tab"
                      aria-selected={index === currentSlide}
                      aria-label={`Go to banner ${index + 1}`}
                      className={`odop-brand-carousel-dot${index === currentSlide ? " is-active" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {hasMultiple && isReady && !loadFailed && (
        <div className="container odop-brand-carousel-nav-wrap">
          <BrandCarouselNav onPrev={goPrev} onNext={goNext} />
        </div>
      )}
    </section>
  );
}
