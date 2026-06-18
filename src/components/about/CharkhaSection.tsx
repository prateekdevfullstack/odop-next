"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import CharkhaWheel from "./CharkhaWheel";
import { useFeaturedSegmentSync } from "./useWheelRotation";
import { useLanguage } from "@/hooks/useLanguage";

// The "featured" position on screen is the right-side middle of the wheel.
// Clicking any segment rotates the wheel until that segment sits at this angle.
const FEATURED_ANGLE = 0;

type SegId = "heritage" | "artisan" | "market" | "economic" | "enterprise";

const SEGMENT_MIDS: { id: SegId; mid: number }[] = [
  { id: "heritage", mid: 306 },
  { id: "artisan", mid: 18 },
  { id: "market", mid: 90 },
  { id: "economic", mid: 162 },
  { id: "enterprise", mid: 234 },
];

function angleDistance(a: number, b: number) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

function getFeaturedSegmentId(rotationValue: number): SegId {
  return SEGMENT_MIDS.reduce((closest, segment) => {
    const segmentAngle = (segment.mid + rotationValue) % 360;
    const closestAngle = (closest.mid + rotationValue) % 360;

    return angleDistance(segmentAngle, FEATURED_ANGLE) < angleDistance(closestAngle, FEATURED_ANGLE)
      ? segment
      : closest;
  }).id;
}

type Detail = {
  title: string;
  titleHi: string;
  icon: string;
  color: string;
  image: string;
  points: { n: string; text: string; textHi: string }[];
};

const DETAILS: Record<SegId, Detail> = {
  heritage: {
    title: "Heritage & Identity",
    titleHi: "विरासत एवं पहचान",
    icon: "/assets/img/about_odop/heritage-ico.png",
    color: "#00AFA5",
    image: "/assets/img/about_odop/heritage_right.png",
    points: [
      { n: "01", text: "District-specific traditional products", textHi: "जनपद-विशिष्ट पारंपरिक उत्पाद" },
      { n: "02", text: "GI-tagged & indigenous crafts (44 ODOP GI Products)", textHi: "जीआई-टैग एवं स्वदेशी शिल्प (44 ओडीओपी जीआई उत्पाद)" },
      { n: "03", text: "Cultural preservation", textHi: "सांस्कृतिक संरक्षण" },
    ],
  },
  artisan: {
    title: "Artisan Empowerment",
    titleHi: "शिल्पकार सशक्तिकरण",
    icon: "/assets/img/about_odop/artisan-ico.png",
    color: "#AC25B0",
    image: "/assets/img/about_odop/artisan_right.png",
    points: [
      { n: "01", text: "Skill development programmes & Modern Toolkit distribution (more than 1,50,000 artisans have been facilitated)", textHi: "कौशल विकास कार्यक्रम एवं आधुनिक टूलकिट वितरण (1,50,000 से अधिक शिल्पकार लाभान्वित)" },
      { n: "02", text: "Livelihood generation", textHi: "आजीविका सृजन" },
    ],
  },
  market: {
    title: "Market & Export\nPromotion",
    titleHi: "बाजार एवं निर्यात\nप्रोत्साहन",
    icon: "/assets/img/about_odop/export-ico.png",
    color: "#2764B4",
    image: "/assets/img/about_odop/export_right.png",
    points: [
      { n: "01", text: "550+ National & international exhibitions", textHi: "550+ राष्ट्रीय एवं अंतर्राष्ट्रीय प्रदर्शनियाँ" },
      { n: "02", text: "Buyer-seller meets", textHi: "क्रेता-विक्रेता सम्मेलन" },
      { n: "03", text: "Branding & packaging support", textHi: "ब्रांडिंग एवं पैकेजिंग सहायता" },
      { n: "04", text: "Exports have risen from INR 88,967 to INR 1,86,060 Cr", textHi: "निर्यात ₹88,967 करोड़ से बढ़कर ₹1,86,060 करोड़ हुआ" },
    ],
  },
  economic: {
    title: "Economic Growth",
    titleHi: "आर्थिक विकास",
    icon: "/assets/img/about_odop/economic-ico.png",
    color: "#E2A900",
    image: "/assets/img/about_odop/growth_right.png",
    points: [
      { n: "01", text: "MSME development", textHi: "एमएसएमई विकास" },
      { n: "02", text: "Employment opportunities (More than 5,00,000 have gained employment)", textHi: "रोजगार के अवसर (5,00,000 से अधिक को रोजगार मिला)" },
      { n: "03", text: "Strengthening local industries", textHi: "स्थानीय उद्योगों का सुदृढ़ीकरण" },
    ],
  },
  enterprise: {
    title: "Enterprise &\nInfrastructure",
    titleHi: "उद्यम एवं\nअवसंरचना",
    icon: "/assets/img/about_odop/enterprise-ico.png",
    color: "#148EFF",
    image: "/assets/img/about_odop/enterprise_right.png",
    points: [
      { n: "01", text: "Common Facility Centres (15 operational CFCs)", textHi: "सामान्य सुविधा केंद्र (15 संचालित सीएफसी)" },
      { n: "02", text: "Financial assistance (Projects worth more than INR 7,000 Cr have been sanctioned)", textHi: "वित्तीय सहायता (₹7,000 करोड़ से अधिक की परियोजनाएं स्वीकृत)" },
      { n: "03", text: "Cluster development", textHi: "क्लस्टर विकास" },
    ],
  },
};

export default function CharkhaSection() {
  const isHi = useLanguage() === "hi";
  const [activeId, setActiveId] = useState<SegId>("heritage");

  // Accumulated rotation degrees — never resets, keeps growing so spin is seamless.
  const rotation = useMotionValue(0);
  // Holds the handle to the current running animation so we can stop it.
  const spinRef = useRef<{ stop: () => void } | null>(null);
  const activeIdRef = useRef<SegId>("heritage");
  const isSnapAnimatingRef = useRef(false);
  const savedScrollY = useRef<number | null>(null);

  const setActiveSegment = useCallback((id: SegId) => {
    if (activeIdRef.current === id) return;
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  // Chains one 360° revolution at a time (avoids large-number overflow and
  // allows perfect seamless resume after any snap).
  const startSpin = useCallback(() => {
    const spin = () => {
      const from = rotation.get();
      spinRef.current = animate(rotation, from + 360, {
        duration: 25,
        ease: "linear",
        onComplete: spin, // chain next revolution immediately
      });
    };
    spin();
  }, [rotation]);

  // Kick off the default rotation on mount; clean up on unmount.
  useEffect(() => {
    startSpin();
    return () => { spinRef.current?.stop(); };
  }, [startSpin]);

  useFeaturedSegmentSync(rotation, isSnapAnimatingRef, getFeaturedSegmentId, setActiveSegment);

  useLayoutEffect(() => {
    if (savedScrollY.current !== null) {
      const y = savedScrollY.current;
      savedScrollY.current = null;
      window.scrollTo(0, y);
    }
  }, [activeId]);

  const handleSelect = useCallback(
    (id: string, segMid: number) => {
      if (typeof window !== "undefined") savedScrollY.current = window.scrollY;
      // Stop whatever is running (spin or a previous snap).
      spinRef.current?.stop();
      isSnapAnimatingRef.current = true;

      const current = rotation.get();

      // How many degrees CW to bring segMid to FEATURED_ANGLE on screen?
      //   screen angle of seg = segMid + current  (mod 360)
      //   we want: segMid + current + delta ≡ FEATURED_ANGLE  (mod 360)
      //   delta = (FEATURED_ANGLE - segMid - current) mod 360   → always ≥ 0
      // Then convert to shortest path: if delta > 180 go CCW instead.
      // Always rotate clockwise (positive). rawDelta is in [0, 360).
      const delta = ((FEATURED_ANGLE - segMid - current) % 360 + 360) % 360;

      activeIdRef.current = id as SegId;
      setActiveId(id as SegId);

      spinRef.current = animate(rotation, current + delta, {
        duration: 1.05,
        ease: "easeInOut",
        onComplete: () => {
          isSnapAnimatingRef.current = false;
          setActiveSegment(getFeaturedSegmentId(rotation.get()));
          startSpin();
        }, // resume normal spin from the new angle
      });
    },
    [rotation, setActiveSegment, startSpin],
  );

  const d = DETAILS[activeId];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: "0 0 8px",
        overflowAnchor: "none",
      }}
    >
      {/* Wheel */}
      <div style={{ flex: "1 1 340px", minWidth: 0 }}>
        <CharkhaWheel
          activeId={activeId}
          onSelect={handleSelect}
          rotation={rotation}
        />
      </div>

      {/* Detail panel */}
      <div style={{ flex: "1 1 400px", maxWidth: 540 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              background: "transparent",
              borderRadius: 20,
              overflow: "visible",
            }}
          >
            {/* Image with white header overlay on top-left */}
            <div className="about-detail-media" style={{ position: "relative" }}>
              <div className="about-detail-imgwrap" style={{ position: "relative", height: 240, overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
                <Image
                  src={d.image}
                  alt={isHi ? d.titleHi : d.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="540px"
                />
              </div>

              {/* White notch overlay — logo + title sit here */}
              <div
                className="about-detail-notch"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "62%",
                  height: 68,
                  background: "transparent",
                  borderBottomRightRadius: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 16px 0 12px",
                  transform: "translate(-18px, -14px)",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: d.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 2px 12px ${d.color}55`,
                  }}
                >
                  <Image src={d.icon} alt="" width={28} height={28} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.3,
                    whiteSpace: "pre-line",
                  }}
                >
                  {isHi ? d.titleHi : d.title}
                </h3>
              </div>
            </div>

            {/* Point cards */}
            <div
              className="charkha-cards-grid"
              style={{ padding: "16px 0 20px", background: "transparent" }}
            >
              {d.points.map((pt) => (
                <div
                  key={pt.n}
                  style={{
                    background: "#cdf0f3",
                    borderRadius: 12,
                    padding: "14px 14px 16px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: d.color,
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1,
                      marginBottom: 10,
                    }}
                  >
                    {pt.n}
                  </div>
                  <div
                    style={{
                      fontSize: "0.74rem",
                      color: "#334155",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.5,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      wordBreak: "normal",
                    }}
                  >
                    {isHi ? pt.textHi : pt.text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .charkha-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .charkha-cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
        @media (max-width: 480px) {
          .charkha-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
