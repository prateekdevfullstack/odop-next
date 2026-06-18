"use client";

import { useRef } from "react";
import { motion, MotionValue } from "framer-motion";
import { useWheelRotation } from "./useWheelRotation";
import { useLanguage } from "@/hooks/useLanguage";

const CX = 420;
const CY = 420;
const R_OUT = 280;
const R_IN = 136;
const BR = 36;
const BWR = 5;
const VB = 840;
const RAD = Math.PI / 180;

const BDIST = Math.round(R_OUT + BR * 0.45);
const R_MID = (R_OUT + R_IN) / 2;
const IMG_SIZE = 470;

function xy(r: number, deg: number) {
  return {
    x: +(CX + r * Math.cos(deg * RAD)).toFixed(2),
    y: +(CY + r * Math.sin(deg * RAD)).toFixed(2),
  };
}

function donutPath(s: number, e: number): string {
  const la = ((e - s) + 360) % 360 > 180 ? 1 : 0;
  const { x: osx, y: osy } = xy(R_OUT, s);
  const { x: oex, y: oey } = xy(R_OUT, e);
  const { x: iex, y: iey } = xy(R_IN, e);
  const { x: isx, y: isy } = xy(R_IN, s);
  return (
    `M${osx},${osy} ` +
    `A${R_OUT},${R_OUT},0,${la},1,${oex},${oey} ` +
    `L${iex},${iey} ` +
    `A${R_IN},${R_IN},0,${la},0,${isx},${isy} Z`
  );
}

const dimOverlay = (overlay: string) => overlay.replace(/[\d.]+\)$/, "0.30)");

const SEGS = [
  {
    id: "coord",
    lines: ["Programme", "Coordination"],
    linesHi: ["कार्यक्रम", "समन्वय"],
    s: 270, e: 342, mid: 306,
    color: "#00AFA5",
    overlay: "rgba(6,137,130,0.60)",
    bg: "/assets/img/about_odop/heritage_entity.jpg",
    icon: "/assets/img/program_cell/Programme_Coordination.png",
    ta: "start" as const,
  },
  {
    id: "stakeholder",
    lines: ["Stakeholder", "Engagement"],
    linesHi: ["हितधारक", "सहभागिता"],
    s: 342, e: 54, mid: 18,
    color: "#AC25B0",
    overlay: "rgba(178,5,184,0.60)",
    bg: "/assets/img/about_odop/artisan_empowerment.jpg",
    icon: "/assets/img/program_cell/Stakeholder_Engagement.png",
    ta: "start" as const,
  },
  {
    id: "branding",
    lines: ["Branding &", "Promotion"],
    linesHi: ["ब्रांडिंग एवं", "प्रचार-प्रसार"],
    s: 54, e: 126, mid: 90,
    color: "#2764B4",
    overlay: "rgba(0,55,127,0.60)",
    bg: "/assets/img/about_odop/market_export_promotion.jpg",
    icon: "/assets/img/program_cell/Branding_Promotion.png",
    ta: "middle" as const,
  },
  {
    id: "market",
    lines: ["Market", "Linkages"],
    linesHi: ["बाजार", "संपर्क"],
    s: 126, e: 198, mid: 162,
    color: "#E2A900",
    overlay: "rgba(200,160,0,0.60)",
    bg: "/assets/img/about_odop/economic_growth.jpg",
    icon: "/assets/img/program_cell/Market_Linkages.png",
    ta: "end" as const,
  },
  {
    id: "strategy",
    lines: ["Strategy &", "Development"],
    linesHi: ["रणनीति एवं", "विकास"],
    s: 198, e: 270, mid: 234,
    color: "#148EFF",
    overlay: "rgba(0,106,204,0.60)",
    bg: "/assets/img/about_odop/enterprise_infrastructure.jpg",
    icon: "/assets/img/program_cell/Strategy_Development.png",
    ta: "end" as const,
  },
] as const;

const LINE_H = 17;
const LDIST = BDIST + BR + BWR + 24;

function badgePos(mid: number, r: number) {
  return xy(BDIST, mid + r);
}

function labelPos(seg: typeof SEGS[number], r: number) {
  const angle = seg.mid + r;
  const cosA = Math.cos(angle * RAD);
  const sinA = Math.sin(angle * RAD);
  const { x: px, y: py } = xy(LDIST, angle);
  const N_LINES = seg.lines.length;
  const ty0 = py - ((N_LINES - 1) * LINE_H) / 2;

  let anchor: "start" | "middle" | "end";
  const tx = px; let ty = ty0;
  if (cosA > 0.25) {
    anchor = "start";
  } else if (cosA < -0.25) {
    anchor = "end";
  } else {
    anchor = "middle";
    ty = ty0 + (sinA >= 0 ? 8 : -8);
  }
  return { tx, ty, anchor };
}

interface Props {
  activeId: string;
  onSelect: (id: string, mid: number) => void;
  rotation: MotionValue<number>;
}

export default function OdopCellWheel({ activeId, onSelect, rotation }: Props) {
  const isHi = useLanguage() === "hi";
  const groupRef = useRef<SVGGElement>(null);
  const badgeRefs = useRef<(SVGGElement | null)[]>([]);
  const labelGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const labelTextRefs = useRef<(SVGTextElement | null)[]>([]);

  useWheelRotation(rotation, groupRef, badgeRefs, labelGroupRefs, labelTextRefs, {
    cx: CX,
    cy: CY,
    segments: SEGS,
    badgePos,
    labelPos,
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: VB,
        margin: "0 auto",
        contain: "layout style paint",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      <svg
        role="img"
        aria-label="ODOP Cell Key Functions Wheel"
        viewBox={`-80 -80 ${VB + 160} ${VB + 160}`}
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>ODOP Cell Key Functions</title>

        <defs>
          {SEGS.map((seg) => (
            <clipPath key={seg.id} id={`cp-cell-${seg.id}`}>
              <path d={donutPath(seg.s, seg.e)} />
            </clipPath>
          ))}
          <filter id="f-cell-badge" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodOpacity="0.28" />
          </filter>
          <filter id="f-cell-center" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="10" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ── Rotating group: segments ── */}
        <g ref={groupRef}>
          {SEGS.map((seg) => {
            const isActive = seg.id === activeId;
            const { x: mx, y: my } = xy(R_MID, seg.mid);
            return (
              <g
                key={seg.id}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(seg.id, seg.mid); }}
                style={{ cursor: "pointer" }}
              >
                <image
                  href={seg.bg}
                  x={mx - IMG_SIZE / 2}
                  y={my - IMG_SIZE / 2}
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#cp-cell-${seg.id})`}
                />
                <path
                  d={donutPath(seg.s, seg.e)}
                  fill={isActive ? dimOverlay(seg.overlay) : seg.overlay}
                  stroke="white"
                  strokeWidth={isActive ? 4.5 : 3}
                />
              </g>
            );
          })}
        </g>

        {/* ── Static centre: white circle + ODOP logo ── */}
        <circle cx={CX} cy={CY} r={R_IN - 5} fill="white" filter="url(#f-cell-center)" />
        <image
          href="/assets/img/logo-o.png"
          x={CX - 88}
          y={CY - 88}
          width={176}
          height={176}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ── Orbiting badges (upright — outside rotating group) ── */}
        {SEGS.map((seg, i) => {
          const isActive = seg.id === activeId;
          const { x: bx0, y: by0 } = badgePos(seg.mid, 0);
          return (
            <g
              key={`badge-${seg.id}`}
              ref={(el) => { badgeRefs.current[i] = el; }}
              style={{ transform: `translate(${bx0}px, ${by0}px)` }}
            >
              <motion.g
                filter="url(#f-cell-badge)"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(seg.id, seg.mid); }}
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ cursor: "pointer", transformOrigin: "0px 0px" }}
              >
                <circle cx={0} cy={0} r={BR + BWR} fill="white" />
                <circle cx={0} cy={0} r={BR} fill={seg.color} />
                <image
                  href={seg.icon}
                  x={-BR * 0.65}
                  y={-BR * 0.65}
                  width={BR * 1.3}
                  height={BR * 1.3}
                  preserveAspectRatio="xMidYMid meet"
                />
              </motion.g>
            </g>
          );
        })}

        {/* ── Orbiting labels (outside rotating group — always upright, always visible) ── */}
        {SEGS.map((seg, i) => {
          const isActive = seg.id === activeId;
          const { tx: tx0, ty: ty0, anchor: anchor0 } = labelPos(seg, 0);
          return (
            <g
              key={`lbl-${seg.id}`}
              ref={(el) => { labelGroupRefs.current[i] = el; }}
              style={{ transform: `translate(${tx0}px, ${ty0}px)` }}
            >
              <text
                ref={(el) => { labelTextRefs.current[i] = el; }}
                textAnchor={anchor0}
                fontFamily="Inter, system-ui, -apple-system, sans-serif"
                fontWeight={isActive ? 700 : 600}
                fontSize={13.5}
                fill={isActive ? "#0f172a" : "#1a1a2e"}
                style={{ pointerEvents: "none" }}
              >
                {(isHi ? seg.linesHi : seg.lines).map((line, j) => (
                  <tspan key={j} x={0} y={j * LINE_H}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}
