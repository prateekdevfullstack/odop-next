import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { getLanguageServer } from "@/lib/language";
import type { Highlight as HighlightItem, Scheme } from "@/lib/schemes";
import { BsFillPatchCheckFill } from "react-icons/bs";
import CapsuleHeading from "../shared/CapsuleHeading";

const SCHEME_ORDER = [
  "margin-money-scheme-uttar-pradesh",
  "marketing-development-assistance-scheme-uttar-pradesh",
  "training-and-toolkit-scheme-uttar-pradesh",
  "common-facility-centre-cfc-scheme-uttar-pradesh",
] as const;

const SCHEME_CATEGORY: Record<string, string> = {
  "margin-money-scheme-uttar-pradesh": "Finance & Enterprise",
  "marketing-development-assistance-scheme-uttar-pradesh": "Branding & Market Access",
  "training-and-toolkit-scheme-uttar-pradesh": "Skill & Productivity",
  "common-facility-centre-cfc-scheme-uttar-pradesh": "Infrastructure & Technology",
};

const SCHEME_CATEGORY_HI: Record<string, string> = {
  "margin-money-scheme-uttar-pradesh": "वित्त एवं उद्यम",
  "marketing-development-assistance-scheme-uttar-pradesh": "ब्रांडिंग एवं बाजार पहुंच",
  "training-and-toolkit-scheme-uttar-pradesh": "कौशल एवं उत्पादकता",
  "common-facility-centre-cfc-scheme-uttar-pradesh": "अवसंरचना एवं प्रौद्योगिकी",
};

const SCHEME_RIBBON_TEXT: Record<string, string> = {
  "margin-money-scheme-uttar-pradesh": "Finance & Enterprise",
  "marketing-development-assistance-scheme-uttar-pradesh": "Branding & Market Access",
  "training-and-toolkit-scheme-uttar-pradesh": "Skill & Productivity",
  "common-facility-centre-cfc-scheme-uttar-pradesh": "Infrastructure & Technology",
};

const SCHEME_RIBBON_TEXT_HI: Record<string, string> = {
  "margin-money-scheme-uttar-pradesh": "वित्त एवं उद्यम",
  "marketing-development-assistance-scheme-uttar-pradesh": "ब्रांडिंग एवं बाजार पहुंच",
  "training-and-toolkit-scheme-uttar-pradesh": "कौशल एवं उत्पादकता",
  "common-facility-centre-cfc-scheme-uttar-pradesh": "अवसंरचना एवं प्रौद्योगिकी",
};

const SCHEME_BANNER_DIR = "/assets/img/Scheme";

function schemeBannerPath(filename: string) {
  return `${SCHEME_BANNER_DIR}/${encodeURIComponent(filename)}`;
}

const SCHEME_HEADER_IMAGE: Record<string, string> = {
  "margin-money-scheme-uttar-pradesh": schemeBannerPath("MARGIN MONEY SCHEME.png"),
  "marketing-development-assistance-scheme-uttar-pradesh": schemeBannerPath(
    "MARKETING DEVELOPMENT.png",
  ),
  "training-and-toolkit-scheme-uttar-pradesh": schemeBannerPath("TRAINING & TOOLKIT SCHEME.png"),
  "common-facility-centre-cfc-scheme-uttar-pradesh": schemeBannerPath(
    "COMMON FACILITY CENTRE.png",
  ),
};

const SCHEME_HEADER_TITLE_LINES: Record<string, string[]> = {
  "margin-money-scheme-uttar-pradesh": ["Margin Money Scheme"],
  "marketing-development-assistance-scheme-uttar-pradesh": [
    "Marketing Development",
    "Assistance Scheme",
  ],
  "training-and-toolkit-scheme-uttar-pradesh": ["Training & Toolkit Scheme"],
  "common-facility-centre-cfc-scheme-uttar-pradesh": [
    "Common Facility Centre",
    "(CFC) Scheme",
  ],
};

const SCHEME_HEADER_TITLE_LINES_HI: Record<string, string[]> = {
  "margin-money-scheme-uttar-pradesh": ["मार्जिन मनी योजना"],
  "marketing-development-assistance-scheme-uttar-pradesh": [
    "विपणन विकास",
    "सहायता योजना",
  ],
  "training-and-toolkit-scheme-uttar-pradesh": ["प्रशिक्षण एवं टूलकिट योजना"],
  "common-facility-centre-cfc-scheme-uttar-pradesh": [
    "सामान्य सुविधा केन्द्र",
    "(सीएफसी) योजना",
  ],
};

const SCHEME_HEADER_TITLE_CLASS: Record<string, string> = {
  "marketing-development-assistance-scheme-uttar-pradesh": "os-card-hero-title--marketing",
  "training-and-toolkit-scheme-uttar-pradesh": "os-card-hero-title--training",
  "common-facility-centre-cfc-scheme-uttar-pradesh": "os-card-hero-title--cfc",
};

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

function getSchemeCategory(scheme: Scheme, isHi: boolean) {
  const fromTag = isHi
    ? (scheme.introJsonHindi?.tag?.trim() || scheme.introJson?.tag?.trim())
    : scheme.introJson?.tag?.trim();
  if (fromTag) return cleanText(fromTag);
  if (isHi && SCHEME_CATEGORY_HI[scheme.slug]) return SCHEME_CATEGORY_HI[scheme.slug];
  if (SCHEME_CATEGORY[scheme.slug]) return SCHEME_CATEGORY[scheme.slug];

  const slug = scheme.slug.toLowerCase();
  if (slug.includes("margin-money") || slug.includes("financial")) {
    return "Finance & Enterprise";
  }
  if (slug.includes("marketing") || slug.includes("mda")) {
    return "Branding & Market Access";
  }
  if (slug.includes("training") || slug.includes("toolkit")) {
    return "Skill & Productivity";
  }
  if (slug.includes("cfc") || slug.includes("common-facility")) {
    return "Infrastructure & Technology";
  }
  return "ODOP Scheme";
}

function getSchemeRibbonText(scheme: Scheme, isHi: boolean) {
  if (isHi && SCHEME_RIBBON_TEXT_HI[scheme.slug]) return SCHEME_RIBBON_TEXT_HI[scheme.slug];
  return SCHEME_RIBBON_TEXT[scheme.slug] ?? getSchemeCategory(scheme, isHi);
}

function getSchemeHeaderImage(scheme: Scheme) {
  return (
    SCHEME_HEADER_IMAGE[scheme.slug] ??
    schemeBannerPath("odop schme banner 393x120.jpg")
  );
}

function getSchemeHeaderTitleLines(scheme: Scheme, fallbackName: string, isHi: boolean) {
  if (isHi && SCHEME_HEADER_TITLE_LINES_HI[scheme.slug]) {
    return SCHEME_HEADER_TITLE_LINES_HI[scheme.slug];
  }
  return SCHEME_HEADER_TITLE_LINES[scheme.slug] ?? [fallbackName];
}

function getSchemeHeaderTitleClass(scheme: Scheme) {
  return SCHEME_HEADER_TITLE_CLASS[scheme.slug] ?? "";
}

function sortSchemes(schemes: Scheme[]) {
  const orderMap = new Map(SCHEME_ORDER.map((slug, index) => [slug, index]));
  return [...schemes].sort((a, b) => {
    const aIndex = orderMap.get(a.slug as (typeof SCHEME_ORDER)[number]) ?? 99;
    const bIndex = orderMap.get(b.slug as (typeof SCHEME_ORDER)[number]) ?? 99;
    return aIndex - bIndex;
  });
}

function SchemeCard({ scheme, isHi }: { scheme: Scheme; isHi: boolean }) {
  const name = cleanText(isHi ? (scheme.nameHindi || scheme.name) : scheme.name);
  const description = getSchemeDescription(scheme, isHi);
  const focusAreas = getSchemeFocusAreas(isHi ? (scheme.highlightsJsonHindi || scheme.highlightsJson) : scheme.highlightsJson);
  const category = getSchemeCategory(scheme, isHi);
  const ribbonText = getSchemeRibbonText(scheme, isHi);
  const headerSrc = getSchemeHeaderImage(scheme);
  const headerTitleLines = getSchemeHeaderTitleLines(scheme, name, isHi);
  const headerTitleClass = getSchemeHeaderTitleClass(scheme);

  return (
    <article className="os-card reveal">
      <div className="os-card-hero">
        <Image
          src={headerSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
          quality={75}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL.light}
          className="os-card-hero-img"
        />
        <h3 className={`os-card-hero-title ${headerTitleClass}`.trim()}>
          {headerTitleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h3>

        <div className="os-category-ribbon os-category-ribbon--overlay" aria-label={category}>
          <Image src="/assets/img/icon/ribbon.png" alt="" width={360} height={38} />
          <span className="os-category-ribbon-label">{ribbonText}</span>
        </div>
      </div>

      <div className="os-card-body">
        {description && <p className="os-description">{description}</p>}

        {focusAreas.length > 0 && (
          <div className="os-focus">
            <h4 className="os-focus-heading">{isHi ? "मुख्य फोकस क्षेत्र" : "Key Focus Areas"}</h4>
            <ul className="os-focus-list">
              {focusAreas.map((area, i) => (
                <li key={`${scheme.slug}-focus-${i}`}>
                  {/* <Image src="/assets/img/icon/checkIcon.png" alt="Check" width={14} height={14} /> */}
                  <BsFillPatchCheckFill />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="os-card-footer">
        <Link href={`/odop-schemes/${scheme.slug}`} className="os-btn">
          {isHi ? "योजना का विवरण देखें" : "View Scheme Details"}
        </Link>
      </div>
    </article>
  );
}

export default async function OdopSchemesSection({ schemes }: { schemes: Scheme[] }) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  const displaySchemes = sortSchemes(schemes).slice(0, 4);

  if (displaySchemes.length === 0) return null;

  return (
    <section id="odop-schemes" className="os-section" aria-label="Our Schemes">
      <div className="container">
        {/* <div className="os-heading-pill reveal">
          <span className="os-heading-text">{isHi ? "ओडीओपी योजनाएं और नीतियां" : "ODOP Schemes & Policies"}</span>
        </div> */}

        <CapsuleHeading reveal>
        {isHi ? "ओडीओपी योजनाएं और नीतियां" : "ODOP Schemes & Policies"}
        </CapsuleHeading>

        <div className="os-grid">
          {displaySchemes.map((scheme) => (
            <SchemeCard key={scheme.id ?? scheme.slug} scheme={scheme} isHi={isHi} />
          ))}
        </div>
      </div>

      <style>{`
        .os-section {
          scroll-margin-top: 140px;
          background: transparent;
          padding: clamp(36px, 6vw, 50px) 0;
        }

        .os-section > .container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(24px, 4vw, 60px);
        }

        // .os-heading-pill {
        //   box-sizing: border-box;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: clamp(12px, 2vw, 22px) clamp(20px, 4vw, 40px);
        //   width: 100%;
        //   background: #8A231C;
        //   border: 1px solid rgba(179, 84, 0, 0.08);
        //   box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
        //   border-radius: 1000px;
        // }

        // .os-heading-text {
        //   font-family: "Montserrat", sans-serif;
        //   font-weight: 600;
        //   font-size: clamp(1rem, 2.2vw, 1.625rem);
        //   line-height: 135%;
        //   text-transform: uppercase;
        //   color: #ffffff;
        //   text-align: center;
        // }

        .os-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(14px, 2vw, 24px);
          width: 100%;
        }

        .os-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          min-height: 100%;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .os-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
        }

        .os-card-hero {
          position: relative;
          aspect-ratio: 393 / 120;
          width: 100%;
          container-type: inline-size;
          /* Allow the ribbon to overlap into the white card body. */
          overflow: visible;
          background: #eef0f3;
        }

        .os-card-hero-img {
          object-fit: cover;
          object-position: center;
        }

        .os-card-hero-title {
          position: absolute;
          left: 50%;
          top: 42%;
          z-index: 2;
          width: calc(100% - 28px);
          margin: 0;
          transform: translate(-50%, -50%);
          font-family: "Montserrat", sans-serif;
          font-size: clamp(1rem, 6.5cqi, 1.62rem);
          font-weight: 800;
          line-height: 1.5;
          color: #ffffff;
          text-align: center;
          text-transform: uppercase;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.38);
          pointer-events: none;
        }

        .os-card-hero-title span {
          display: block;
          white-space: nowrap;
        }

        .os-card-hero-title--marketing {
          font-size: clamp(0.9rem, 5.45cqi, 1.42rem);
        }

        .os-card-hero-title--training {
          font-size: clamp(0.86rem, 5.35cqi, 1.34rem);
        }

        .os-card-hero-title--cfc {
          font-size: clamp(0.86rem, 5.25cqi, 1.31rem);
        }

        .os-category-ribbon {
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .os-category-ribbon--overlay {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 50%);
            z-index: 3;
            width: 100%;
        }

       .os-category-ribbon img {
          width: 92%;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.18));
      }

      .os-category-ribbon-label {
          position: absolute;
          top: 12px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: 12px;
          line-height: normal;
          color: #ffffff;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
          white-space: nowrap;
      }

        .os-category-ribbon-wing {
          flex: 0 0 14px;
          background: #0056c9;
        }

        .os-category-ribbon-wing--left {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        .os-category-ribbon-wing--right {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }

        .os-category-ribbon-text {
          flex: 1;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 10px;
          background: #007bff;
          font-family: "Montserrat", sans-serif;
          font-weight: 700;
          font-size: 12px;
          line-height: 1.3;
          color: #ffffff;
          text-align: center;
        }

        .os-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 34px 16px 12px;
        }

        .os-description {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          font-weight: 500;
          line-height: normal;
          color: #111827;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
      }

        .os-focus {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .os-focus-heading {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-weight: 700;
          font-size: clamp(0.7rem, 1vw, 0.78rem);
          line-height: 1.35;
          color: #111827;
        }

        .os-focus-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .os-focus-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.625rem, 0.9vw, 0.75rem);
          line-height: 1.45;
          color: #374151;
        }

        .os-check-icon {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          margin-top: 1px;
          color: #c4c9d1;
        }

        .os-card-footer {
          padding: 0 16px 16px;
          margin-top: auto;
        }

        .os-btn {
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

        .os-btn:hover {
          background: #666666;
          color: #ffffff;
        }

        .os-btn:focus-visible {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        @media (max-width: 1200px) {
          .os-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(14px, 2vw, 20px);
          }
        }

        @media (max-width: 768px) {
          .os-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .os-description {
            font-size: 0.78rem;
          }

          .os-focus-list li {
            font-size: 0.6875rem;
          }
        }

        @media (max-width: 640px) {
          .os-section {
            padding: clamp(28px, 7vw, 48px) 0;
          }

          .os-section > .container {
            gap: clamp(20px, 5vw, 32px);
          }

          .os-heading-text {
            font-size: clamp(0.9rem, 4vw, 1.25rem);
          }

          .os-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .os-category-ribbon-text {
            font-size: clamp(0.625rem, 2.5vw, 0.6875rem);
          }
        }
      `}</style>
    </section>
  );
}
