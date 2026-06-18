"use client";

import { useId } from "react";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";

const HEX_SIZES = {
  xl: { w: 230, h: 270, r: 4 },
  md: { w: 190, h: 210, r: 4 },
  sm: { w: 100, h: 112, r: 3 },
} as const;

function normalize(x: number, y: number): [number, number] {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

function roundedHexPath(
  w: number,
  h: number,
  radius: number,
  inset = 0,
): string {
  const iw = w - inset * 2;
  const ih = h - inset * 2;
  const ox = inset;
  const oy = inset;
  const verts: [number, number][] = [
    [ox + iw / 2, oy],
    [ox + iw, oy + ih * 0.25],
    [ox + iw, oy + ih * 0.75],
    [ox + iw / 2, oy + ih],
    [ox, oy + ih * 0.75],
    [ox, oy + ih * 0.25],
  ];
  const r = Math.min(radius, iw * 0.08, ih * 0.05);
  const n = verts.length;
  let d = "";

  for (let i = 0; i < n; i += 1) {
    const prev = verts[(i - 1 + n) % n];
    const curr = verts[i];
    const next = verts[(i + 1) % n];
    const [v1x, v1y] = normalize(curr[0] - prev[0], curr[1] - prev[1]);
    const [v2x, v2y] = normalize(next[0] - curr[0], next[1] - curr[1]);
    const p1x = curr[0] - v1x * r;
    const p1y = curr[1] - v1y * r;
    const p2x = curr[0] + v2x * r;
    const p2y = curr[1] + v2y * r;

    d += i === 0 ? `M ${p1x} ${p1y} ` : `L ${p1x} ${p1y} `;
    d += `Q ${curr[0]} ${curr[1]} ${p2x} ${p2y} `;
  }

  return `${d}Z`;
}

const ministers = [
  {
    name: "Yogi Adityanath",
    nameHi: "योगी आदित्यनाथ",
    role: "Hon'ble Chief Minister",
    roleHi: "माननीय मुख्यमंत्री",
    image: "/assets/img/ODOP/Yogi_Adityanath.png",
  },
  {
    name: "Shri Bhupendra Chaudhary",
    nameHi: "श्री भूपेंद्र चौधरी",
    role: "Hon'ble Cabinet Minister of MSME",
    roleHi: "माननीय कैबिनेट मंत्री, एमएसएमई",
    image: "/assets/img/ODOP/Bhupendra.png",
  },
  {
    name: "Shri Hansraj Vishwakarma",
    nameHi: "श्री हंसराज विश्वकर्मा",
    role: "Hon'ble State Minister of MSME",
    roleHi: "माननीय राज्य मंत्री, एमएसएमई",
    image: "/assets/img/ODOP/Hansraj.png",
  },
];

const officials = [
  {
    name: "Shri Shashi Prakash Goyal",
    nameHi: "श्री शशि प्रकाश गोयल",
    role: "Chief Secretary",
    roleHi: "मुख्य सचिव",
    image: "/assets/img/ODOP/Prakash.png",
  },
  {
    name: "Shri Shashi Bhushan Lal Susheel",
    nameHi: "श्री शशि भूषण लाल सुशील",
    role: "Principal Secretary, MSME and Export Promotion",
    roleHi: "प्रमुख सचिव, एमएसएमई एवं निर्यात प्रोत्साहन",
    image: "/assets/img/ODOP/Bhushan.png",
  },
  {
    name: "Shri K. Vijayendra Pandian",
    nameHi: "श्री के. विजयेंद्र पांडियन",
    role: "Commissioner of the Directorate of Industries",
    roleHi: "आयुक्त, उद्योग निदेशालय",
    image: "/assets/img/ODOP/Vijayendra.png",
  },
];

function DotGrid({ className = "" }: { className?: string }) {
  // return <span className={`ld-dots ${className}`} aria-hidden="true" />;
  return <Image className={`ld-dots ${className}`} src="/assets/img/icon/blur.png" width={150} height={150} alt="" aria-hidden="true" />;
}

function HexPortrait({
  image,
  alt,
  size,
}: {
  image: string;
  alt: string;
  size: "xl" | "md" | "sm";
}) {
  const uid = useId().replace(/:/g, "");
  const { w, h, r } = HEX_SIZES[size];
  const hexPath = roundedHexPath(w, h, r);
  const hexClip = `path("${hexPath}")`;
  const gradId = `ld-hex-grad-${uid}`;

  return (
    <div className={`ld-hex ld-hex--${size}`} style={{ width: w, height: h }}>
      <div
        className="ld-hex-body"
        style={{ width: w, height: h, clipPath: hexClip }}
      >
        <svg
          className="ld-hex-frame"
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          height={h}
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id={gradId}
              gradientUnits="objectBoundingBox"
              cx="0.5"
              cy="0.5"
              rx="0.4259"
              ry="0.3805"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E4E5E3" />
            </radialGradient>
          </defs>
          <path d={hexPath} fill={`url(#${gradId})`} />
        </svg>
        <div className="ld-hex-photo">
          <img
            src={image}
            alt={alt}
            className={`ld-hex-img ld-hex-img--${size}`}
          />
        </div>
      </div>
      <svg
        className="ld-hex-outline"
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        aria-hidden="true"
      >
        <path
          d={hexPath}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function TextCard({
  name,
  role,
  variant,
}: {
  name: string;
  role: string;
  variant: "cm" | "minister" | "official";
}) {
  return (
    <div className={`ld-card ld-card--${variant}`}>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

export default function LeadershipDesk() {
  const isHi = useLanguage() === "hi";
  const [chiefMinister, cabinetMinister, stateMinister] = ministers;

  return (
    <section
      id="leadership-desk"
      aria-label="Leadership and Administrative Officers"
      className="ld-section"
    >
      <div className="container">
        <CapsuleHeading
          reveal
          className="ld-heading-pill my-16"
          textClassName="ld-heading-text"
        >
          {isHi ? "नेतृत्व" : "Leadership"}
        </CapsuleHeading>

        <div className="ld-layout reveal">
          <div className="ld-main-group">
            <DotGrid className="ld-dots--main-one" />
            <DotGrid className="ld-dots--main-two" />

            <div className="ld-cm-card">
              <TextCard
                name={isHi ? chiefMinister.nameHi : chiefMinister.name}
                role={isHi ? chiefMinister.roleHi : chiefMinister.role}
                variant="cm"
              />
            </div>

            <div className="ld-cm-photo">
              <HexPortrait
                image={chiefMinister.image}
                alt={chiefMinister.name}
                size="xl"
              />
            </div>

            <div className="ld-photo-left">
              <HexPortrait
                image={cabinetMinister.image}
                alt={cabinetMinister.name}
                size="md"
              />
            </div>

            <div className="ld-photo-right">
              <HexPortrait
                image={stateMinister.image}
                alt={stateMinister.name}
                size="md"
              />
            </div>

            <div className="ld-label-left">
              <TextCard
                name={isHi ? cabinetMinister.nameHi : cabinetMinister.name}
                role={isHi ? cabinetMinister.roleHi : cabinetMinister.role}
                variant="minister"
              />
            </div>

            <div className="ld-label-right">
              <TextCard
                name={isHi ? stateMinister.nameHi : stateMinister.name}
                role={isHi ? stateMinister.roleHi : stateMinister.role}
                variant="minister"
              />
            </div>
          </div>

          <div className="ld-officials">
            {officials.map((official) => (
              <div className="ld-official" key={official.name}>
                <DotGrid className="ld-dots--official" />

                <div className="ld-official-photo">
                  <HexPortrait
                    image={official.image}
                    alt={official.name}
                    size="sm"
                  />
                </div>

                <TextCard
                  name={isHi ? official.nameHi : official.name}
                  role={isHi ? official.roleHi : official.role}
                  variant="official"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ld-section {
          // scroll-margin-top: 130px;
          background: #f4f4f6;
          // padding: clamp(36px, 5vw, 72px) 0;
          overflow: hidden;
        }

        // .ld-heading-pill {
        //   width: 100%;
        //   background: #8a231c;
        //   border-radius: 999px;
        //   padding: clamp(13px, 2vw, 20px) clamp(20px, 4vw, 42px);
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
        // }

        // .ld-heading-text {
        //     color: #ffffff;
        //     font-family: "Montserrat", sans-serif;
        //     font-size: 20px;
        //     font-weight: 600;
        //     text-transform: uppercase;
        //     letter-spacing: 0px;
        // }

        .ld-layout {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(600px, 1.08fr) minmax(460px, 0.92fr);
          align-items: center;
          gap: clamp(50px, 6vw, 90px);
        }

        .ld-main-group {
          position: relative;
          height: 610px;
        }

        .ld-cm-photo {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 6;
        }

        .ld-cm-card {
            position: absolute;
            top: 114px;
            right: 410px;
            z-index: 2;
        }

        .ld-photo-left {
            position: absolute;
            top: 225px;
            left: 145px;
            z-index: 5;
        }

        .ld-photo-right {
            position: absolute;
            top: 225px;
            right: 145px;
            z-index: 5;
        }

        .ld-label-left {
            position: absolute;
            left: 0px;
            bottom: 7rem;
            z-index: 3;
        }

        .ld-label-right {
            position: absolute;
            right: -34px;
            bottom: 7rem;
            z-index: 3;

        }

        .ld-officials {
            display: flex;
            flex-direction: column;
            gap: 36px;
            height: 100%;
            justify-content: flex-start;
            margin-top: 100px;
        }

        .ld-official {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 116px;
        }

        .ld-official-photo {
          position: relative;
          z-index: 5;
          flex-shrink: 0;
        }

        .ld-official .ld-card {
            margin-left: -42px;
        }

        .ld-card {
          background: #ffffff;
          max-height: 58px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
        }

        .ld-card h3 {
            margin: 0 0 5px;
            font-family: "Montserrat", sans-serif;
            font-size: clamp(1rem, 1.3vw, 1rem);
            font-weight: 600;
            line-height: 1.25;
            color: #111827;
        }

        .ld-card p {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.78rem, 1vw, 0.85rem);
          font-weight: 500;
          line-height: 1.35;
          color: #4b5563;
        }

        .ld-card--cm {
            width: 300px;
            padding: 17px 62px 17px 29px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            clip-path: polygon(9% 0%, 100% 0%, 91% 100%, 0% 100%);
        }

       .ld-card--minister {
          width: 300px;
          padding: 17px 28px;
          text-align: center;
          align-items: center;
          clip-path: polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%);
      }

        .ld-card--official {
          width: 460px;
          padding: 17px 56px 17px 72px;
          text-align: left;
          clip-path: polygon(0% 0%, 88% 0%, 100% 100%, 0% 100%);
        }

        .ld-hex {
          position: relative;
          flex-shrink: 0;
        }

        .ld-hex-body {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .ld-hex-frame {
          position: absolute;
          inset: 0;
          display: block;
        }

        .ld-hex-photo {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .ld-hex-outline {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          pointer-events: none;
          z-index: 2;
          overflow: visible;
        }

        .ld-hex-img {
          position: absolute;
          display: block;
          height: auto;
          max-width: none;
        }

        .ld-hex-img--xl {
          width: 100%;
          bottom: -32px;
          left: 0;
          right: 0;
          margin: 0 auto;
        }

        .ld-hex-img--md {
          width: 88%;
          bottom: -20px;
          left: -11px;
          right: 0;
          margin: 0 auto;
        }

        .ld-hex-img--sm {
          width: 100%;
          bottom: -18px;
          left: 0;
          right: 0;
          margin: 0 auto;
        }

        .ld-dots {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          width: 82px;
          height: 82px;
          background-size: 16px 16px;
          filter: invert(.85);
        }

        .ld-dots--main-one {
          top: 205px;
          left: 52%;
        }

        .ld-dots--main-two {
          top: 262px;
          left: 57%;
        }
          

        .ld-dots--official {
          top: 30%;
          left: -50px;
          transform: translateY(-50%);
          opacity: 30%;
        }

        @media (max-width: 1280px) {
          .ld-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 64px;
          }

          .ld-main-group {
            width: 100%;
            max-width: 720px;
            min-width: 0;
            margin: 0 auto;
          }

          .ld-officials {
            width: 100%;
            max-width: 620px;
            min-width: 0;
            margin: 0 auto;
          }

          .ld-card--official {
            width: 100%;
          }
        }

        @media (max-width: 900px) {
          .ld-layout {
            gap: 38px;
          }

          .ld-main-group {
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
          }

          .ld-cm-photo,
          .ld-cm-card,
          .ld-photo-left,
          .ld-photo-right,
          .ld-label-left,
          .ld-label-right {
            position: static;
            transform: none;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .ld-cm-photo {
            order: 1;
          }

          .ld-cm-card {
            order: 2;
          }

          .ld-photo-left {
            order: 3;
            margin-top: 10px;
          }

          .ld-label-left {
            order: 4;
          }

          .ld-photo-right {
            order: 5;
            margin-top: 10px;
          }

          .ld-label-right {
            order: 6;
          }

          .ld-officials {
            gap: 26px;
          }

          .ld-official {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .ld-official .ld-card {
            margin-left: 0;
          }

          .ld-card--cm,
          .ld-card--minister,
          .ld-card--official {
            width: min(100%, 360px);
            clip-path: none;
            border-radius: 16px;
            padding: 16px 20px;
            text-align: center;
            align-items: center;
          }

          .ld-dots {
            display: none;
          }


          .ld-card h3 {
            font-size: 1rem;
          }

          .ld-card p {
            font-size: 0.82rem;
          }
        }

        @media (max-width: 420px) {
          .ld-section {
            padding: 30px 0;
          }

          .ld-card--cm,
          .ld-card--minister,
          .ld-card--official {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
