"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import OdopCellWheel from "./OdopCellWheel";
import { useFeaturedSegmentSync } from "./useWheelRotation";
import { useLanguage } from "@/hooks/useLanguage";

const FEATURED_ANGLE = 0;

type SegId = "coord" | "stakeholder" | "branding" | "market" | "strategy";

const SEGMENT_MIDS: { id: SegId; mid: number }[] = [
  { id: "coord", mid: 306 },
  { id: "stakeholder", mid: 18 },
  { id: "branding", mid: 90 },
  { id: "market", mid: 162 },
  { id: "strategy", mid: 234 },
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
  coord: {
    title: "Programme\nCoordination",
    titleHi: "कार्यक्रम\nसमन्वय",
    icon: "/assets/img/program_cell/Programme_Coordination.png",
    color: "#00AFA5",
    image: "/assets/img/about_odop/heritage_right.png",
    points: [
      { n: "01", text: "Implementation and monitoring of ODOP initiatives across districts", textHi: "जनपदों में ओडीओपी पहलों का क्रियान्वयन एवं अनुश्रवण" },
    ],
  },
  stakeholder: {
    title: "Stakeholder\nEngagement",
    titleHi: "हितधारक\nसहभागिता",
    icon: "/assets/img/program_cell/Stakeholder_Engagement.png",
    color: "#AC25B0",
    image: "/assets/img/about_odop/artisan_right.png",
    points: [
      { n: "01", text: "Coordination with artisans, departments, institutions, buyers, and industry partners", textHi: "शिल्पकारों, विभागों, संस्थानों, क्रेताओं एवं उद्योग भागीदारों के साथ समन्वय" },
    ],
  },
  branding: {
    title: "Branding &\nPromotion",
    titleHi: "ब्रांडिंग एवं\nप्रचार-प्रसार",
    icon: "/assets/img/program_cell/Branding_Promotion.png",
    color: "#2764B4",
    image: "/assets/img/about_odop/export_right.png",
    points: [
      { n: "01", text: "Promotion of ODOP products through campaigns, exhibitions, and digital outreach", textHi: "अभियानों, प्रदर्शनियों एवं डिजिटल पहुंच के माध्यम से ओडीओपी उत्पादों का प्रचार-प्रसार" },
    ],
  },
  market: {
    title: "Market\nLinkages",
    titleHi: "बाजार\nसंपर्क",
    icon: "/assets/img/program_cell/Market_Linkages.png",
    color: "#E2A900",
    image: "/assets/img/about_odop/growth_right.png",
    points: [
      { n: "01", text: "Facilitating domestic and international market access", textHi: "घरेलू एवं अंतर्राष्ट्रीय बाजार पहुंच को सुगम बनाना" },
    ],
  },
  strategy: {
    title: "Strategy &\nDevelopment",
    titleHi: "रणनीति एवं\nविकास",
    icon: "/assets/img/program_cell/Strategy_Development.png",
    color: "#148EFF",
    image: "/assets/img/about_odop/enterprise_right.png",
    points: [
      { n: "01", text: "Supporting innovation, infrastructure, exports, and cluster development", textHi: "नवाचार, अवसंरचना, निर्यात एवं क्लस्टर विकास को सहयोग" },
      { n: "02", text: "Connecting artisans, heritage, innovation, and markets through a unified development ecosystem", textHi: "एक एकीकृत विकास पारिस्थितिकी तंत्र के माध्यम से शिल्पकारों, विरासत, नवाचार एवं बाजारों को जोड़ना" },
    ],
  },
};

export default function OdopCellSection() {
  const isHi = useLanguage() === "hi";
  const [activeId, setActiveId] = useState<SegId>("coord");

  const rotation = useMotionValue(0);
  const spinRef = useRef<{ stop: () => void } | null>(null);
  const activeIdRef = useRef<SegId>("coord");
  const isSnapAnimatingRef = useRef(false);
  const savedScrollY = useRef<number | null>(null);

  const setActiveSegment = useCallback((id: SegId) => {
    if (activeIdRef.current === id) return;
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  const startSpin = useCallback(() => {
    const spin = () => {
      const from = rotation.get();
      spinRef.current = animate(rotation, from + 360, {
        duration: 25,
        ease: "linear",
        onComplete: spin,
      });
    };
    spin();
  }, [rotation]);

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
      spinRef.current?.stop();
      isSnapAnimatingRef.current = true;

      const current = rotation.get();
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
        },
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
        <OdopCellWheel
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
            {/* Image with header overlay on top-left */}
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

              {/* Notch overlay — logo + title */}
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
              className="cell-cards-grid"
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
        .cell-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .cell-cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
        @media (max-width: 480px) {
          .cell-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
