"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCircleQuestion, FaFilePdf, FaYoutube, FaChartLine, FaGavel, FaXmark, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { VideoModal } from "@/components/ui/VideoModal";
import { fetchSchemeDetail } from "@/services/schemes.service";
import type { Scheme } from "@/lib/schemes";
import { brochurePublicPathForSlug } from "@/lib/scheme-brochures";
import { extractSchemeMedia, toYoutubeVideoId } from "@/lib/scheme-media";
import MDAReportChart, { SchemeType } from "@/components/schemes/MDAReportChart";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

interface SvgLine { x1: number; y1: number; x2: number; y2: number }

export interface SchemeAboutActionsProps {
  slug: string;
  /** Absolute URL to scheme thumbnail (e.g. NEW_BASE_URL + scheme.logo) */
  thumbnailUrl: string;
  fallbackBriefVideoId: string;
  fallbackDetailedVideoId: string;
  schemeType?: SchemeType;
  schemeName?: string;
}

export default function SchemeAboutActions({
  slug,
  thumbnailUrl,
  fallbackBriefVideoId,
  fallbackDetailedVideoId,
  schemeType,
  schemeName,
}: SchemeAboutActionsProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showGovOrders, setShowGovOrders] = useState(false);

  // SVG connecting lines
  const layoutRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [svgLines, setSvgLines] = useState<SvgLine[]>([]);

  const computeLines = useCallback(() => {
    const layout = layoutRef.current;
    const ring = ringRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!layout || !ring || !leftCol || !rightCol) return;

    const lRect = layout.getBoundingClientRect();
    const rRect = ring.getBoundingClientRect();
    const cx = rRect.left - lRect.left + rRect.width / 2;
    const cy = rRect.top - lRect.top + rRect.height / 2;
    const radius = rRect.width / 2;

    const lines: SvgLine[] = [];

    const addLines = (col: HTMLDivElement, isLeft: boolean) => {
      col.querySelectorAll<HTMLElement>(".scheme-orbit-item").forEach((item) => {
        const iRect = item.getBoundingClientRect();
        const edgeX = isLeft ? iRect.right - lRect.left : iRect.left - lRect.left;
        const centerY = iRect.top - lRect.top + iRect.height / 2;
        const dy = centerY - cy;
        const sq = radius * radius - dy * dy;
        if (sq < 0) return;
        const ringX = isLeft ? cx - Math.sqrt(sq) : cx + Math.sqrt(sq);
        lines.push({ x1: edgeX, y1: centerY, x2: ringX, y2: centerY });
      });
    };

    addLines(leftCol, true);
    addLines(rightCol, false);
    setSvgLines(lines);
  }, []);

  useLayoutEffect(() => {
    computeLines();
    const layout = layoutRef.current;
    if (!layout) return;
    const ro = new ResizeObserver(computeLines);
    ro.observe(layout);
    return () => ro.disconnect();
  }, [computeLines, schemeType]);

  const govOrdersByScheme: Record<SchemeType, { subject: string; dateOfIssue: string; href: string }[]> = {
    CFC: [
    
      {
        subject: "Regarding partial amendment in Government Order dated 06-11-2018, regarding starting of Common Facility Centre Promotion Scheme under 'One District One Product' Scheme",
        dateOfIssue: "2023",
        href: "/assets/document/GO/GO_CFC_2023.pdf",
      },
    ],
    MDA: [
  
      {
        subject: "Regarding amendment in the 'One District One Product Marketing Promotion Scheme",
        dateOfIssue: "2020",
        href: "/assets/document/GO/GO_MDA_2020.pdf",
      },
    ],
    TTS: [
      {
        subject: "Regarding starting of efficiency/skill development/entrepreneurship development training and toolkit distribution scheme under One District One Product Programme",
        dateOfIssue: "2020",
        href: "/assets/document/GO/GO_Training_%26_Toolkit_2020.pdf",
      },
    ],
    MMS: [
      {
        subject: "Approval to operate a financial assistance scheme under the 'One District One Product' program",
        dateOfIssue: "24-09-2018",
        href: "/assets/document/GO/GO_Margin_Money_2018.pdf",
      },
    ],
  };

  const resolveYoutubeId = useCallback(
    (kind: "brief" | "detailed", scheme: (Scheme & Record<string, unknown>) | undefined) => {
      const media = scheme ? extractSchemeMedia(scheme) : null;
      if (kind === "brief") {
        return toYoutubeVideoId(media?.brief) ?? toYoutubeVideoId(fallbackBriefVideoId);
      }
      return (
        toYoutubeVideoId(media?.detailed) ??
        toYoutubeVideoId(fallbackDetailedVideoId) ??
        toYoutubeVideoId(media?.brief) ??
        toYoutubeVideoId(fallbackBriefVideoId)
      );
    },
    [fallbackBriefVideoId, fallbackDetailedVideoId]
  );

  const openVideo = useCallback(
    async (kind: "brief" | "detailed") => {
      setBusy(true);
      try {
        const res = await fetchSchemeDetail(slug);
        const scheme = res?.data as (Scheme & Record<string, unknown>) | undefined;
        const id = resolveYoutubeId(kind, scheme);
        if (id) setActiveVideoId(id);
      } catch {
        const id =
          kind === "brief"
            ? toYoutubeVideoId(fallbackBriefVideoId)
            : toYoutubeVideoId(fallbackDetailedVideoId) ?? toYoutubeVideoId(fallbackBriefVideoId);
        if (id) setActiveVideoId(id);
      } finally {
        setBusy(false);
      }
    },
    [slug, resolveYoutubeId, fallbackBriefVideoId, fallbackDetailedVideoId]
  );

  const openBrochure = useCallback(() => {
    const path = brochurePublicPathForSlug(slug);
    if (path) window.open(encodeURI(path), "_blank", "noopener,noreferrer");
  }, [slug]);

  const scrollToFaq = useCallback(() => {
    document
      .getElementById("scheme-faq-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const hasThumb = Boolean(thumbnailUrl?.trim());

  return (
    <>
      <div ref={layoutRef} className="scheme-orbit-layout">
        {/* SVG overlay: connecting lines from cards to ring */}
        <svg
          className="scheme-orbit-svg"
          aria-hidden="true"
        >
          {svgLines.map((line, i) => (
            <g key={i}>
              <line
                x1={line.x1} y1={line.y1}
                x2={line.x2} y2={line.y2}
                stroke="rgba(26,68,128,0.28)"
                strokeWidth="1.8"
                strokeDasharray="5 4"
              />
              <circle cx={line.x2} cy={line.y2} r="5" fill="#1a4480" />
            </g>
          ))}
        </svg>

        {/* Left column: 2 video buttons */}
        <div ref={leftColRef} className="scheme-orbit-col scheme-orbit-col--left">
          <button
            type="button"
            className="scheme-orbit-item scheme-orbit-item--video"
            onClick={() => openVideo("brief")}
            disabled={busy}
            aria-label="Play brief overview video"
          >
            <span className="scheme-orbit-item__body">
              <strong className="scheme-orbit-item__title">Overview</strong>
              <span className="scheme-orbit-item__sub">Brief Video</span>
            </span>
            <span className="scheme-orbit-item__icon scheme-orbit-item__icon--video">
              <FaYoutube className="scheme-orbit-yt-icon" />
            </span>
          </button>

          <button
            type="button"
            className="scheme-orbit-item scheme-orbit-item--video"
            onClick={() => openVideo("detailed")}
            disabled={busy}
            aria-label="Play detailed ODOP walkthrough"
          >
            <span className="scheme-orbit-item__body">
              <strong className="scheme-orbit-item__title">Deep Dive</strong>
              <span className="scheme-orbit-item__sub">Detailed Video</span>
            </span>
            <span className="scheme-orbit-item__icon scheme-orbit-item__icon--video">
              <FaYoutube className="scheme-orbit-yt-icon" />
            </span>
          </button>

          {schemeType && (
            <button
              type="button"
              className="scheme-orbit-item scheme-orbit-item--faq"
              onClick={() => setShowChart(true)}
              aria-label="View scheme statistics chart"
            >
              <span className="scheme-orbit-item__body">
                <strong className="scheme-orbit-item__title">Statistics</strong>
                <span className="scheme-orbit-item__sub">View Chart</span>
              </span>
              <span className="scheme-orbit-item__icon">
                <FaChartLine />
              </span>
            </button>
          )}
        </div>

        {/* Center: scheme photo */}
        <div className="scheme-orbit-center">
          <div ref={ringRef} className="scheme-orbit-ring-outer">
            <div className="scheme-orbit-ring-inner">
              {hasThumb ? (
                <Image
                  src={thumbnailUrl}
                  alt="Scheme"
                  className="scheme-orbit-img"
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 240px, 400px"
                  quality={80}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                />
              ) : (
                <span className="scheme-orbit-img-placeholder" aria-hidden />
              )}
            </div>
          </div>
        </div>

        {/* Right column: FAQ + Flyer */}
        <div ref={rightColRef} className="scheme-orbit-col scheme-orbit-col--right">
          <button
            type="button"
            className="scheme-orbit-item scheme-orbit-item--faq"
            onClick={scrollToFaq}
            aria-label="Scroll to FAQ section"
          >
            <span className="scheme-orbit-item__icon">
              <FaCircleQuestion />
            </span>
            <span className="scheme-orbit-item__body">
              <strong className="scheme-orbit-item__title">FAQ</strong>
              <span className="scheme-orbit-item__sub">On this page</span>
            </span>
          </button>

          <button
            type="button"
            className="scheme-orbit-item scheme-orbit-item--flyer"
            onClick={openBrochure}
            aria-label="Download scheme Flyer PDF"
          >
            <span className="scheme-orbit-item__icon">
              <FaFilePdf />
            </span>
            <span className="scheme-orbit-item__body">
              <strong className="scheme-orbit-item__title">Flyer</strong>
              <span className="scheme-orbit-item__sub">Official PDF</span>
            </span>
          </button>

          {schemeType && (
            <button
              type="button"
              className="scheme-orbit-item scheme-orbit-item--flyer"
              onClick={() => setShowGovOrders(true)}
              aria-label="View government orders for this scheme"
            >
              <span className="scheme-orbit-item__icon">
                <FaGavel />
              </span>
              <span className="scheme-orbit-item__body">
                <strong className="scheme-orbit-item__title">Govt. Orders</strong>
                <span className="scheme-orbit-item__sub">Official GOs</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {busy && (
        <p className="scheme-orbit-busy" aria-live="polite">
          Loading…
        </p>
      )}

      <VideoModal videoId={activeVideoId} onClose={() => setActiveVideoId(null)} />

      {/* Government Orders modal */}
      <div
        className={`modal-overlay${showGovOrders ? ' active' : ''}`}
        onClick={() => setShowGovOrders(false)}
      >
        <div
          className="modal-box modal-lg"
          style={{ maxWidth: 720 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">
              {schemeName ? `${schemeName} — Govt. Orders` : 'Government Orders'}
            </h2>
            <button
              className="modal-close"
              onClick={() => setShowGovOrders(false)}
              aria-label="Close modal"
            >
              <FaXmark />
            </button>
          </div>
          <div className="modal-body" style={{ padding: '16px 24px 24px' }}>
            {schemeType && govOrdersByScheme[schemeType].map((go, i) => (
              <div
                key={go.href}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '14px 0',
                  borderBottom: i < govOrdersByScheme[schemeType].length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#1b3c72', lineHeight: 1.4 }}>
                    {go.subject}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    Date of Issue: <strong>{go.dateOfIssue}</strong>
                  </p>
                </div>
                <a
                  href={go.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    background: '#fff5e9',
                    border: '1px solid rgba(179, 84, 0, 0.12)',
                    borderRadius: 6,
                    color: '#363b42',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  <FaFilePdf style={{ fontSize: '0.85rem' }} />
                  View PDF
                  <FaArrowUpRightFromSquare style={{ fontSize: '0.7rem' }} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics chart modal */}
      <div
        className={`modal-overlay${showChart ? ' active' : ''}`}
        onClick={() => setShowChart(false)}
      >
        <div
          className="modal-box modal-lg"
          style={{ maxWidth: 780 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">
              {schemeName ? `${schemeName} — Statistics` : 'Scheme Statistics'}
            </h2>
            <button
              className="modal-close"
              onClick={() => setShowChart(false)}
              aria-label="Close modal"
            >
              <FaXmark />
            </button>
          </div>
          <div className="modal-body" style={{ padding: '20px 24px 24px' }}>
            {showChart && schemeType && (
              <MDAReportChart viewType="yearly" scheme={schemeType} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
