import Link from 'next/link'
import Image from 'next/image'
import ScrollRevealInitializer from '@/components/home/ScrollRevealInitializer'
import type { Highlight as HighlightItem, Scheme } from '@/lib/schemes'
import { getLanguageServer } from '@/lib/language'
import { fetchSchemesList } from '@/services/schemes.service'
import { resolvePublicAssetUrl } from '@/lib/scheme-media'
import { BLUR_DATA_URL } from '@/lib/image-placeholders'
import PageBanner from '@/components/shared/PageBanner'
import "@/styles/schemes-infographic.css"

export const dynamic = "force-dynamic"

const MSME_APPLY_URL = "https://msme.up.gov.in/login/Registration_Login"

const cleanText = (text: string | null | undefined): string => {
  if (!text) return ""
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
}

function getHighlightText(highlight: HighlightItem) {
  const title = cleanText(highlight.title)
  const description = cleanText(highlight.description)
  const hasTitle = Boolean(title && title !== "=>")

  if (hasTitle && description) {
    return `${title}: ${description}`
  }

  return hasTitle ? title : description || null
}

function getSchemeFocusAreas(highlights: HighlightItem[] | null | undefined) {
  if (!Array.isArray(highlights)) {
    return []
  }
  return highlights
    .map(getHighlightText)
    .filter((item): item is string => Boolean(item))
    .slice(0, 5)
}

function getSchemeDescription(scheme: Scheme, isHi: boolean) {
  const desc = isHi
    ? (scheme.longDescriptionHindi || scheme.shortDescriptionHindi || scheme.introJsonHindi?.description || scheme.longDescription || scheme.shortDescription || scheme.introJson?.description)
    : (scheme.longDescription || scheme.shortDescription || scheme.introJson?.description)
  return cleanText(desc) || null
}

function getLogoSrc(scheme: Scheme) {
  if (!scheme.logo?.trim()) return null
  return resolvePublicAssetUrl(scheme.logo)
}

function SchemeCard({ scheme, isHi }: { scheme: Scheme; isHi: boolean }) {
  const name = cleanText(isHi ? (scheme.nameHindi || scheme.name) : scheme.name)
  const description = getSchemeDescription(scheme, isHi)
  const focusAreas = getSchemeFocusAreas(isHi ? (scheme.highlightsJsonHindi || scheme.highlightsJson) : scheme.highlightsJson)
  const logoSrc = getLogoSrc(scheme)

  return (
    <article className="ms-card">
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
  )
}

async function getMsmeSchemes(): Promise<Scheme[]> {
  try {
    const response = await fetchSchemesList()
    if (Array.isArray(response?.data)) {
      const schemesData = Object.groupBy(response.data, (scheme) => scheme.schemeType)
      return schemesData.OTHER || []
    }
    return []
  } catch (error) {
    console.error("Failed to fetch MSME schemes:", error)
    return []
  }
}

export default async function MsmeSchemes() {
  const [schemes, lang] = await Promise.all([getMsmeSchemes(), getLanguageServer()])
  const isHi = lang === "hi"

  return (
    <>
      <ScrollRevealInitializer />

      <PageBanner
        imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New2.png"
        eyebrow={isHi ? "योजनाएं एवं नीतियां" : "Schemes & Policies"}
        current={isHi ? "एमएसएमई योजनाएं" : "MSME Schemes"}
        className="mt-0 mt-sm-0"
      />

      <main className="main-content schemes-page msme-schemes-page">
        <div className="container">
          <div className="resource-capsule-heading-wrap">
            <h1 className="resource-heading-common">
              {isHi ? "एमएसएमई योजनाएं और नीतियां" : "MSME Schemes & Policies"}
            </h1>
          </div>

          <div className="ms-grid" style={{ paddingBottom: "40px" }}>
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} isHi={isHi} />
            ))}
          </div>
        </div>
        <style>{`
          .msme-schemes-page > .container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: clamp(24px, 4vw, 48px);
          }

          .msme-schemes-page .ms-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: clamp(14px, 2vw, 24px);
            width: 100%;
          }

          .msme-schemes-page .ms-card {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
            overflow: hidden;
            min-height: 100%;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }

          .msme-schemes-page .ms-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
          }

          .msme-schemes-page .ms-card-hero {
            position: relative;
            aspect-ratio: 393 / 120;
            width: 100%;
            overflow: visible;
            background: #8A231C;
          }

          .msme-schemes-page .ms-card-hero-img {
            object-fit: contain;
            object-position: center;
            padding: 8px;
          }

          .msme-schemes-page .ms-card-hero-fallback {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          }

          .msme-schemes-page .ms-card-hero-title {
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

          .msme-schemes-page .ms-card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 18px 16px 20px;
          }

          .msme-schemes-page .ms-description {
            margin: 0;
            font-family: "Poppins", sans-serif;
            font-size: clamp(0.7rem, 1vw, 0.75rem);
            line-height: 1.6;
            color: #6b7280;
          }

          .msme-schemes-page .ms-focus {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .msme-schemes-page .ms-focus-heading {
            margin: 0;
            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-size: clamp(0.7rem, 1vw, 0.75rem);
            line-height: 1.35;
            color: #111827;
          }

          .msme-schemes-page .ms-focus-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .msme-schemes-page .ms-focus-list li {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-family: "Poppins", sans-serif;
            font-size: clamp(0.625rem, 0.9vw, 0.6875rem);
            line-height: 1.45;
            color: #9ca3af;
          }

          .msme-schemes-page .ms-scheme-name {
            margin: 0;
            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-size: clamp(0.75rem, 1.1vw, 0.875rem);
            line-height: 1.35;
            color: #111827;
          }

          .msme-schemes-page .ms-card-footer {
            padding: 0 16px 16px;
            margin-top: auto;
          }

          .msme-schemes-page .ms-btn {
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

          .msme-schemes-page .ms-btn:hover {
            background: #666666;
            color: #ffffff;
          }

          .msme-schemes-page .ms-btn:focus-visible {
            outline: 2px solid #007bff;
            outline-offset: 2px;
          }

          @media (max-width: 1200px) {
            .msme-schemes-page .ms-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: clamp(14px, 2vw, 20px);
            }
          }

          @media (max-width: 768px) {
            .msme-schemes-page .ms-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
            }

            .msme-schemes-page .ms-description {
              font-size: 0.75rem;
            }

            .msme-schemes-page .ms-focus-list li {
              font-size: 0.6875rem;
            }
          }

          @media (max-width: 640px) {
            .msme-schemes-page .ms-grid {
              grid-template-columns: 1fr;
              gap: 14px;
            }
          }
        `}</style>
      </main>
    </>
  )
}
