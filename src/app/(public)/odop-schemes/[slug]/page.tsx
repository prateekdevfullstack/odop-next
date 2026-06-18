import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Scheme } from '@/lib/schemes'
import { FaArrowUpRightFromSquare, FaCircleCheck } from 'react-icons/fa6'
import { API_CONFIG } from '@/lib/api'
import { fetchSchemeDetail } from '@/services/schemes.service'
import { SchemeType } from '@/components/schemes/MDAReportChart'
import SchemeAboutActions from '@/components/schemes/SchemeAboutActions'
import { getSchemeFaqs, videoUrls, detailedVideoUrls } from './faq'
import { Suspense } from 'react'
import SchemeDetailSkeleton from '@/bones/SchemeDetailSkeleton'
import { getLanguageServer } from '@/lib/language'
import { pickLocalized } from '@/lib/locale'
import PageBanner from '@/components/shared/PageBanner'

interface PageProps {
    params: Promise<{ slug: string }>
}

const SCHEME_COPY = {
    en: {
        about: 'About the Scheme',
        keyFocusAreas: 'Key Focus Areas:',
        eligibility: 'Eligibility Criteria',
        subsidy: 'Subsidy Structure',
        applyNow: 'Apply Now',
        faq: 'Frequently Asked Questions',
    },
    hi: {
        about: 'योजना के बारे में',
        keyFocusAreas: 'मुख्य फोकस क्षेत्र:',
        eligibility: 'पात्रता मापदंड',
        subsidy: 'सब्सिडी संरचना',
        applyNow: 'अभी आवेदन करें',
        faq: 'अक्सर पूछे जाने वाले प्रश्न',
    },
} as const

async function SchemeDetailContent({ slug }: { slug: string }) {
    const lang = await getLanguageServer()
    const isHi = lang === 'hi'
    const copy = isHi ? SCHEME_COPY.hi : SCHEME_COPY.en
    const FAQs = getSchemeFaqs(slug, lang)
    let scheme: Scheme | null = null

    try {
        const response = await fetchSchemeDetail(slug)
        if (response?.data) {
            scheme = response.data as Scheme
        }
    } catch (error) {
        console.error("Failed to fetch scheme detail on server:", error)
    }

    if (!scheme) {
        notFound()
    }

   const schemeDash: Record<string, SchemeType> =  {
    "common-facility-centre-cfc-scheme-uttar-pradesh": "CFC",
    "marketing-development-assistance-scheme-uttar-pradesh": "MDA",
    "training-and-toolkit-scheme-uttar-pradesh": "TTS",
    "margin-money-scheme-uttar-pradesh": "MMS",
  }
    const { dynamicSectionsJson } = scheme

    const schemeName = pickLocalized(isHi, scheme.nameHindi, scheme.name)
    const longDescription = pickLocalized(
        isHi,
        scheme.longDescriptionHindi || scheme.shortDescriptionHindi,
        scheme.longDescription || scheme.shortDescription,
    )
    const highlightsJson = isHi
        ? (scheme.highlightsJsonHindi || scheme.highlightsJson)
        : scheme.highlightsJson
    const eligibilityJson = isHi
        ? (scheme.eligibilityJsonHindi || scheme.eligibilityJson)
        : scheme.eligibilityJson
    const subsidyJson = isHi
        ? (scheme.subsidyJsonHindi || scheme.subsidyJson)
        : scheme.subsidyJson
    const ctaJson = isHi
        ? (scheme.ctaJsonHindi || scheme.ctaJson)
        : scheme.ctaJson

    return (
        <div className={`about-static-page policy-page scheme-detail-page${scheme.slug === 'margin-money-scheme-uttar-pradesh' ? ' scheme-mms-page' : ''}`}>
            <PageBanner
                imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New1.png"
                eyebrow={isHi ? "योजनाएं एवं नीतियां" : "Schemes & Policies"}
                current={schemeName}
            />

            <main className="main-content schemes-page about-static-page policy-page">
                <div className="container">
                    {dynamicSectionsJson.intro && (
                        <div className="scheme-detail-capsule-heading-wrap">
                            <h1 className="resource-heading-common">{schemeName}</h1>
                            {/* <p>{scheme.shortDescription}</p> */}
                        </div>
                    )}

                    <section className="static-content-wrap">
                        <div className="event-detail-about-shell mb-10">
                            <div className="event-detail-sidebar">
                                <div className="event-detail-about-media scheme-about-media-panel">
                                    <SchemeAboutActions
                                        slug={scheme.slug}
                                        thumbnailUrl={
                                            scheme.logo
                                                ? API_CONFIG.NEW_BASE_URL + scheme.logo
                                                : ''
                                        }
                                        fallbackBriefVideoId={
                                            videoUrls[scheme.slug as keyof typeof videoUrls] ?? ''
                                        }
                                        fallbackDetailedVideoId={
                                            detailedVideoUrls[
                                                scheme.slug as keyof typeof detailedVideoUrls
                                            ] ?? ''
                                        }
                                        schemeType={schemeDash[scheme.slug]}
                                        schemeName={schemeName}
                                    />
                                </div>
                            </div>
                            <div className="scheme-detail-about-content">
                                <article className="static-card mb-0">
                                    <h2>{copy.about}</h2>
                                    <p className='text-md'>{longDescription}</p>
                                </article>
                                {scheme.slug === 'common-facility-centre-cfc-scheme-uttar-pradesh' && (
                                    <div className="scheme-apply-button-row mb-0">
                                        <div className="scheme-cta-actions">
                                            <Link href="/resources/cfc-list" className="os-btn">
                                                View CFC list
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                            {dynamicSectionsJson.highlights && (
                                <article className="static-card mb-0">
                                    <h2 className='mb-4'>{copy.keyFocusAreas}</h2>
                                    <ul className="static-list">
                                        {highlightsJson.map((highlight, index) => (
                                            <li key={index}>
                                                <FaCircleCheck className="text-primary mt-1" />
                                                <span>
                                                    {highlight.title ? (
                                                        <>
                                                            <strong>{highlight.title}</strong>
                                                            {highlight.description ? `: ${highlight.description}` : null}
                                                        </>
                                                    ) : (
                                                        highlight.description
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            )}

                        

                        {dynamicSectionsJson.eligibility && (
                            <article className="static-card">
                                <h2 className=''>{copy.eligibility}</h2>
                                <ul className="static-list">
                                    {eligibilityJson.points.map((item, index) => (
                                        <li key={index}>
                                            <FaCircleCheck className="text-primary mt-1" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {eligibilityJson.note && (
                                    <p className="scheme-inline-note">{eligibilityJson.note}</p>
                                )}
                            </article>
                        )}

                        {dynamicSectionsJson.subsidy && (
                            <article className="static-card">
                                <h2>{copy.subsidy}</h2>
                                <div className="policy-table-wrap">
                                    <table className="policy-table">
                                        <thead>
                                            <tr>
                                                {subsidyJson.columns.map(col => (
                                                    <th key={col.id}>{col.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subsidyJson.rows.map((row, index) => (
                                                <tr key={index}>
                                                    {subsidyJson.columns.map(col => (
                                                        <td key={col.id}>{row[col.id]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {subsidyJson.footnote && (
                                    <p className="static-note">{subsidyJson.footnote}</p>
                                )}
                            </article>
                        )}



                        {dynamicSectionsJson.cta && (
                            <div className="scheme-apply-button-row">
                                <div className="scheme-cta-actions">
                                    <a
                                        href={ctaJson.apply_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="os-btn"
                                    >
                                        <FaArrowUpRightFromSquare className="mr-2" /> {copy.applyNow}
                                    </a>
                                </div>
                            </div>
                        )}

                        <section id="scheme-faq-section" className="faq-section scheme-detail-faq">
                            <div className="scheme-detail-capsule-heading-wrap">
                                <h1 className="resource-heading-common">{copy.faq}</h1>
                            </div>
                            <div className="faq-grid">
                                {FAQs.map((faq, index) => (
                                    <article className="static-card !mb-2" key={index}>
                                        <h3>{faq.question}</h3>
                                        <p>{faq.answer}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </section>
                </div>
            </main>

        </div>
    )
}

export default async function SchemeDetailPage({ params }: PageProps) {
    const { slug } = await params

    return (
        <Suspense fallback={<SchemeDetailSkeleton />}>
            <SchemeDetailContent slug={slug} />
        </Suspense>
    )
}
