import Link from "next/link";
import Image from "next/image";
import { resolvePublicAssetUrl } from "@/lib/scheme-media";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { getLanguageServer } from "@/lib/language";
import type { Highlight as HighlightItem, Scheme } from "@/lib/schemes";
import CapsuleHeading from "../shared/CapsuleHeading";

const MSME_APPLY_URL = "https://msme.up.gov.in/login/Registration_Login";

const cleanText = (text: string | null | undefined): string => {
  if (!text) return "";
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

function getHighlightText(highlight: HighlightItem) {
  const title = cleanText(highlight.title);
  const description = cleanText(highlight.description);
  const hasTitle = Boolean(title && title !== "=>");

  if (hasTitle && description) {
    return `${title}: ${description}`;
  }

  return hasTitle ? title : description || null;
}

function getSchemeFocusAreas(highlights: HighlightItem[] | null | undefined) {
  if (!Array.isArray(highlights)) {
    return [];
  }
  return highlights
    .map(getHighlightText)
    .filter((item): item is string => Boolean(item))
    .slice(0, 5);
}

function getSchemeDescription(scheme: Scheme, isHi: boolean) {
  const desc = isHi
    ? (scheme.longDescriptionHindi || scheme.shortDescriptionHindi || scheme.introJsonHindi?.description || scheme.longDescription || scheme.shortDescription || scheme.introJson?.description)
    : (scheme.longDescription || scheme.shortDescription || scheme.introJson?.description);
  return cleanText(desc) || null;
}

function getLogoSrc(scheme: Scheme) {
  if (!scheme.logo?.trim()) return null;
  return resolvePublicAssetUrl(scheme.logo);
}

function MsmeSchemeCard({ scheme, isHi }: { scheme: Scheme; isHi: boolean }) {
  const name = cleanText(isHi ? (scheme.nameHindi || scheme.name) : scheme.name);
  const description = getSchemeDescription(scheme, isHi);
  const focusAreas = getSchemeFocusAreas(isHi ? (scheme.highlightsJsonHindi || scheme.highlightsJson) : scheme.highlightsJson);
  const logoSrc = getLogoSrc(scheme);

  return (
    <article className="ms-card reveal">
      <div className="ms-card-hero">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL.light}
            className="ms-card-hero-img"
          />
        ) : (
          <div className="ms-card-hero-fallback" aria-hidden="true" />
        )}
        <h3 className="ms-card-hero-title">{name}</h3>
      </div>

      <div className="ms-card-body">
        <h3 className="ms-scheme-name">{name}</h3>

        {description && <p className="ms-description">{description}</p>}

        {focusAreas.length > 0 && (
          <div className="ms-focus">
            <h4 className="ms-focus-heading">{isHi ? "मुख्य फोकस क्षेत्र" : "Key Focus Areas"}</h4>
            <ul className="ms-focus-list">
              {focusAreas.map((area, i) => (
                <li key={`${scheme.slug}-focus-${i}`}>
                  <Image src="/assets/img/icon/checkIcon.png" alt="Check" width={14} height={14} />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="ms-card-footer">
        <Link href={MSME_APPLY_URL} className="ms-btn" target="_blank" rel="noopener noreferrer">
          {isHi ? "विवरण देखें और आवेदन करें" : "View Details & Apply"}
        </Link>
      </div>
    </article>
  );
}

export default async function MsmeSchemesSection({ schemes }: { schemes: Scheme[] }) {
  if (schemes.length === 0) return null;

  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  const display = schemes.slice(0, 4);

  return (
    <section id="msme-schemes" className="ms-section" aria-label="MSME Schemes & Policies">
      <div className="container">

        <CapsuleHeading reveal>
        {isHi ? "एमएसएमई योजनाएं और नीतियां" : "MSME Schemes & Policies"}
        </CapsuleHeading>


        <div className="ms-grid">
          {display.map((scheme) => (
            <MsmeSchemeCard key={scheme.id ?? scheme.slug} scheme={scheme} isHi={isHi} />
          ))}
        </div>

        <div className="ms-footer reveal">
          <Link href="/msme-schemes" className="ms-view-all">
            {isHi ? "सभी देखें" : "View All"}
          </Link>
        </div>
      </div>

      <style>{`
        .ms-section {
          scroll-margin-top: 140px;
          background: transparent;
          padding: clamp(20px, 3vw, 40px) 0 clamp(16px, 2.5vw, 50px);
        }

        .ms-section > .container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(24px, 4vw, 60px);
        }

        .ms-heading-pill {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 2vw, 22px) clamp(20px, 4vw, 40px);
          width: 100%;
          background: #8A231C;
          border: 1px solid rgba(179, 84, 0, 0.08);
          box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
          border-radius: 1000px;
        }

        .ms-heading-text {
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: clamp(1rem, 2.2vw, 1.625rem);
          line-height: 135%;
          text-transform: uppercase;
          color: #ffffff;
          text-align: center;
        }

        .ms-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(14px, 2vw, 24px);
          width: 100%;
        }

        .ms-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          min-height: 100%;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ms-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
        }

        .ms-card-hero {
          position: relative;
          aspect-ratio: 393 / 120;
          width: 100%;
          container-type: inline-size;
          overflow: visible;
          background: #8A231C;
        }

        .ms-card-hero-img {
          object-fit: contain;
          object-position: center;
          padding: 8px;
        }

        .ms-card-hero-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }

        .ms-card-hero-title {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .ms-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px 16px 30px;
        }

        .ms-description {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.7rem, 1vw, 0.75rem);
          line-height: 1.6;
          color: #6b7280;
        }

        .ms-focus {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ms-focus-heading {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-weight: 700;
          font-size: clamp(0.7rem, 1vw, 0.75rem);
          line-height: 1.35;
          color: #111827;
        }

        .ms-focus-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .ms-focus-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.625rem, 0.9vw, 0.6875rem);
          line-height: 1.45;
          color: #9ca3af;
        }

       .ms-scheme-name {
            margin: 0;
            font-family: "Montserrat", sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 21px;
            color: #111827;
        }

        .ms-card-footer {
          padding: 0 16px 16px;
          margin-top: auto;
        }

        .ms-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: clamp(38px, 4vw, 42px);
          padding: clamp(8px, 1.2vw, 10px) clamp(12px, 1.6vw, 16px);
          background: #808080;
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: clamp(0.75rem, 1.1vw, 0.8125rem);
          line-height: 1.2;
          text-align: center;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .ms-btn:hover {
          background: #666666;
          color: #ffffff;
        }

        .ms-btn:focus-visible {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .ms-footer {
          display: flex;
          justify-content: center;
          margin: 0;
          padding: 0;
        }

        .ms-view-all {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
          padding: 12px 32px;
          border-radius: 999px;
          background: #808080;
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .ms-view-all:hover {
            background: #a9a9a9;
            color: #373434;
            transform: translateY(-1px);
        }

        @media (max-width: 1200px) {
          .ms-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(14px, 2vw, 20px);
          }
        }

        @media (max-width: 768px) {
          .ms-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .ms-description {
            font-size: 0.75rem;
          }

          .ms-focus-list li {
            font-size: 0.6875rem;
          }
        }

        @media (max-width: 640px) {
          .ms-section {
            padding: clamp(16px, 5vw, 28px) 0 clamp(12px, 4vw, 20px);
          }

          .ms-section > .container {
            gap: clamp(14px, 4vw, 24px);
          }

          .ms-heading-text {
            font-size: clamp(0.9rem, 4vw, 1.25rem);
          }

          .ms-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </section>
  );
}
