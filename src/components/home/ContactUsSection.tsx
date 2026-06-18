"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import CapsuleHeading from "../shared/CapsuleHeading";

function PillLink({
  href,
  iconSrc,
  children,
}: {
  href: string;
  iconSrc: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="cus-pill reveal">
      <span className="cus-pill__icon" aria-hidden="true">
        <Image
          src={iconSrc}
          alt=""
          width={34}
          height={34}
          className="cus-pill__icon-img"
        />
      </span>
      <span className="cus-pill__text">{children}</span>
    </Link>
  );
}

export default function ContactUsSection() {
  const isHi = useLanguage() === "hi";

  return (
    <section id="contact-us" className="cus-section" aria-label={isHi ? "निर्देशिका और संपर्क" : "Directory and Contact"}>
      <div className="container cus-inner">
      <CapsuleHeading reveal className="!mb-[48px]">
          {isHi ? "संपर्क करें" : "Contact Us"}
        </CapsuleHeading>
        <div className="cus-grid">
          <article className="cus-card cus-card--directory reveal">
            <div
              className="cus-lineIcon cus-lineIcon--directory"
              aria-hidden="true"
            >
              <Image
                src="/assets/img/icon/fileIcon.png"
                alt=""
                width={22}
                height={22}
                className="cus-lineIcon__img"
              />
            </div>
            <div className="cus-card__top">
              <h3 className="cus-title">{isHi ? "निर्देशिका" : "Directory"}</h3>
            </div>
            <div className="cus-actions">
              <PillLink
                href="/suppliers?supplier_type=Artisans"
                iconSrc="/assets/img/icon/directory_1.png"
              >
                {isHi ? "कारीगर / बुनकर / शिल्पकार" : "Artisans / Weavers / Craftsmen"}
              </PillLink>
              <PillLink
                href="/suppliers?supplier_type=Manufacturers"
                iconSrc="/assets/img/icon/directory_2.png"
              >
                {isHi ? "निर्माता / थोक विक्रेता" : "Manufacturers / Wholesalers"}
              </PillLink>
              <PillLink
                href="/suppliers?supplier_type=Exporters"
                iconSrc="/assets/img/icon/directory_3.png"
              >
                {isHi ? "निर्यातक" : "Exporters"}
              </PillLink>
            </div>
          </article>

          <article className="cus-card cus-card--connect reveal">
            <div
              className="cus-lineIcon cus-lineIcon--connect"
              aria-hidden="true"
            >
              <Image
                src="/assets/img/icon/Link.png"
                alt=""
                width={22}
                height={22}
                className="cus-lineIcon__img"
              />
            </div>
            <div className="cus-card__top">
              <h3 className="cus-title">{isHi ? "जुड़ें" : "Connect"}</h3>
            </div>
            <div className="cus-actions cus-actions--two">
              <PillLink href="/contact-us?tab=scheme" iconSrc="/assets/img/icon/connect_1.png">
                {isHi ? "योजना संबंधी प्रश्न" : "Scheme Related Queries"}
              </PillLink>
              <PillLink href="/contact-us" iconSrc="/assets/img/icon/connect_2.png">
                {isHi ? "सामान्य प्रश्न" : "General Queries"}
              </PillLink>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        :root {
          --cus-white: #ffffff;
          --cus-black: #000000;
          --cus-stroke: #ecebe4;
          --cus-title: #1c1c1c;
          --cus-muted: #575757;
          --cus-purple: #6159a2;
          --cus-green: #72d862;
          --cus-surface: #fafaff;
          --cus-line-h: 6px;
        }

        .cus-section {
          padding: clamp(26px, 4.5vw, 52px) 0;
          background: transparent;
        }

        .cus-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 3.5vw, 32px);
        }

        .cus-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(14px, 2.2vw, 22px);
          width: min(100%, 1040px);
          margin-inline: auto;
        }

        .cus-card {
          position: relative;
          border-radius: 22px;
          --cus-accent: transparent;
          background: linear-gradient(
              to bottom,
              var(--cus-accent) 0 var(--cus-line-h),
              var(--cus-surface) var(--cus-line-h) 100%
            );
          border: 1px solid var(--cus-stroke);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: visible;
          display: flex;
          flex-direction: column;
          // min-height: clamp(225px, 22vw, 270px);
          padding: clamp(18px, 2.6vw, 28px) clamp(16px, 2.4vw, 26px)
            clamp(18px, 2.6vw, 28px);
        }

        .cus-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0, 0, 0, 0.12) 0.9px, transparent 0.9px);
          background-size: 12px 12px;
          opacity: 0.14;
          pointer-events: none;
          z-index: 0;
        }

        .cus-card--directory {
          --cus-accent: #808080;
        }

        .cus-card--connect {
          --cus-accent: #99582A;
        }

        .cus-lineIcon {
          position: absolute;
          top: calc(var(--cus-line-h) / 2);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 2.5px solid var(--cus-white);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.14);
          z-index: 4;
        }

        .cus-lineIcon--directory {
          background: #808080;
        }

        .cus-lineIcon--connect {
          background: #99582A;
        }

        .cus-lineIcon__img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .cus-card__top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 18px;
          z-index: 3;
        }

        .cus-title {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-weight: 700;
          font-size: clamp(1rem, 1.6vw, 1.50rem);
          line-height: 1.25;
          color: var(--cus-title);
        }

        .cus-actions {
          position: relative;
          z-index: 3;
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          --cus-gap: clamp(10px, 1.6vw, 14px);
          gap: var(--cus-gap);
          grid-auto-rows: 1fr;
          padding-top: clamp(12px, 1.8vw, 16px);
        }

        .cus-actions--two {
          --cus-pill-w: calc((100% - (2 * var(--cus-gap))) / 3);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, var(--cus-pill-w)));
          justify-content: center;
          gap: var(--cus-gap);
          grid-auto-rows: 1fr;
        }

        .cus-actions--two .cus-pill {
          width: 100%;
        }

        .cus-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 14px 12px;
          border-radius: 16px;
          background: var(--cus-white);
          border: 1px solid var(--cus-stroke);
          text-decoration: none;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          min-height: 92px;
          height: 100%;
        }

        .cus-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 0, 0, 0.18);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
        }

        .cus-pill__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .cus-pill__icon-img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .cus-pill__text {
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.72rem, 1vw, 0.82rem);
          line-height: 1.2;
          color: var(--cus-title);
          text-align: center;
          max-width: 14ch;
        }

        @media (max-width: 900px) {
          .cus-grid {
            grid-template-columns: 1fr;
          }

          .cus-actions {
            grid-template-columns: 1fr;
          }

          .cus-actions--two {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--cus-gap);
          }

          .cus-actions--two .cus-pill {
            width: auto;
          }

        }
      `}</style>
    </section>
  );
}
