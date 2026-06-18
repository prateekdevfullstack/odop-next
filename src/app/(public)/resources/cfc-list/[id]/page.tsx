import type { Metadata } from "next";
import "@/styles/cfc-list.css";
import Image from "next/image";
import { fetchCfcDetail } from "@/services/schemes.service";
import { notFound } from "next/navigation";
import { API_CONFIG } from "@/lib/api";
import type { PaginatedResponse } from "@/lib/api/types";
import type { CfcItem } from "@/lib/api/cfc.types";
import CfcMonthlyReportCharts from "@/components/cfc/CfcMonthlyReportCharts";
import CfcRecentActivities from "@/components/cfc/CfcRecentActivities";
import CfcRecentEvents from "@/components/cfc/CfcRecentEvents";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import PageBanner from "@/components/shared/PageBanner";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { getLanguageServer } from "@/lib/language";
import { pickLocalized, resolveProductCategoryLabel } from "@/lib/locale";

function unwrapCfcDetailPayload(body: unknown): CfcItem | null {
 if (!body || typeof body !== "object") return null;
 const record = body as PaginatedResponse<CfcItem> | CfcItem;
 if ("data" in record && Array.isArray((record as PaginatedResponse<CfcItem>).data)) {
 const first = (record as PaginatedResponse<CfcItem>).data[0];
 return first ?? null;
 }
 return record as CfcItem;
}

const CFC_IMAGE_FALLBACK = "/assets/img/CFC.png";

function absoluteMediaUrl(path: string): string {
 const p = path.trim();
 if (!p) return "";
 return p.startsWith("http") ? p : `${API_CONFIG.NEW_BASE_URL}${p}`;
}

function resolveThumbnailSrc(thumbnail: string | null | undefined): string {
 const t = thumbnail?.trim();
 if (!t || t === "null") return CFC_IMAGE_FALLBACK;
 return absoluteMediaUrl(t);
}

function resolveVideoSrc(videoUrl: string | null | undefined): string | null {
 const v = videoUrl?.trim();
 if (!v || v === "null") return null;
 return absoluteMediaUrl(v);
}

function getYouTubeEmbedId(url: string): string | null {
 const u = url.trim();
 if (!u.includes("/") && /^[a-zA-Z0-9_-]{6,}$/.test(u)) return u;
 const embed = u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
 if (embed?.[1]) return embed[1];
 const vParam = u.match(/[?&]v=([a-zA-Z0-9_-]+)/);
 if (vParam?.[1]) return vParam[1];
 const shortLink = u.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
 if (shortLink?.[1]) return shortLink[1];
 const shorts = u.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
 if (shorts?.[1]) return shorts[1];
 return null;
}

function isLikelyDirectVideoFile(url: string): boolean {
 return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
}

function CfcDetailVisualMedia({
 videoUrl,
 thumbnail,
 alt,
 variant,
}: {
 videoUrl?: string | null;
 thumbnail?: string | null;
 alt: string;
 variant: "about" | "contact";
}) {
 const thumbSrc = resolveThumbnailSrc(thumbnail);
 const videoSrc = resolveVideoSrc(videoUrl);

 if (videoSrc) {
 const ytId = getYouTubeEmbedId(videoSrc);
 if (ytId) {
 return (<div
 className={
 variant === "about"
 ? "cfc-detail-visual-embed cfc-detail-visual-embed--about"
 : "cfc-detail-visual-embed cfc-detail-visual-embed--contact"
 }
 >
 <iframe
 src={`https://www.youtube-nocookie.com/embed/${ytId}`}
 title={alt}
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
 allowFullScreen
 loading="lazy"
 />
 </div>);
 }
 if (isLikelyDirectVideoFile(videoSrc)) {
 return (<video
 src={videoSrc}
 controls
 playsInline
 preload="metadata"
 className={variant === "about" ? "about-main-image" : "cfc-detail-contact-video"}
 />);
 }
 }

  return (
  <Image
  src={thumbSrc}
  alt={alt}
  className={variant === "about" ? "about-main-image" : undefined}
  width={600}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 600px"
  quality={80}
  placeholder="blur"
  blurDataURL={BLUR_DATA_URL.light}
  preload={variant === "about"}
  />);
}

export async function generateMetadata({
 params,
}: {
 params: Promise<{ id: string }>;
}): Promise<Metadata> {
 const { id } = await params;
 const lang = await getLanguageServer();
 const isHi = lang === "hi";
 try {
 const response = await fetchCfcDetail(id);
 const cfc = unwrapCfcDetailPayload(response.data);
 if (!cfc) throw new Error("CFC not found");
 const productName = resolveProductCategoryLabel(cfc.productCategory, isHi);

 return {
 title: isHi
   ? `${cfc.city.districtName} सीएफसी | ओडीओपी - एक जिला एक उत्पाद`
   : `${cfc.city.districtName} CFC | ODOP - One District One Product`,
 description: isHi
   ? `${cfc.city.districtName} सीएफसी - ओडीओपी के अंतर्गत ${productName} सामान्य सुविधा केंद्र।`
   : `${cfc.city.districtName} CFC - ${productName} Common Facility Centre under ODOP.`,
 };
 } catch {
 return {
 title: isHi ? "सीएफसी विवरण | ओडीओपी" : "CFC Detail | ODOP",
 };
 }
}

export default async function CfcDetailPage({
 params,
}: {
 params: Promise<{ id: string }>;
}) {
 const { id } = await params;
 const lang = await getLanguageServer();
 const isHi = lang === "hi";
 
 let cfc: CfcItem | null = null;
 try {
 const response = await fetchCfcDetail(id);
 cfc = unwrapCfcDetailPayload(response.data);
 } catch (error) {
 console.error("Error fetching CFC detail:", error);
 return notFound();
 }

 if (!cfc) {
 return notFound();
 }

 const productCategoryName = resolveProductCategoryLabel(cfc.productCategory, isHi);
 const interventionLabel = pickLocalized(isHi, cfc.intervention_hindi, cfc.intervention);

 return (<div className="cfc-detail-page-wrapper">
 <PageBanner
 imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
 eyebrow={isHi ? "नॉलेज हब" : "Knowledge Hub"}
 current={isHi ? "सीएफसी विवरण" : "CFC Detail"}
 />

 <div className="container">
 <div className="cfc-capsule-heading-wrap">
 <h1 className="resource-heading-common">{cfc.city.districtName} {isHi ? "सीएफसी" : "CFC"}</h1>
 </div>
 </div>

 <section className="about-section">
 <div className="container">
 <div className="about-overview-grid">
 <div className="about-overview-visual">
 <div className="about-image-stack">
 <CfcDetailVisualMedia
 videoUrl={cfc.video_url}
 thumbnail={cfc.thumbnail}
 alt={cfc.name}
 variant="about"
 />
 </div>
 </div>
 <div className="about-overview-content">
 <p>
 {isHi ? (
 <>
 यह सीएफसी {productCategoryName} पारिस्थितिकी तंत्र को मजबूत करने के लिए बनाया गया है, जो{" "}
 {interventionLabel} के लिए सामान्य अवसंरचना प्रदान करता है। यह ओडीओपी निर्माताओं, किसानों
 और एमएसएमई इकाइयों का समर्थन करता है, लागत बाधाओं को कम करके तथा बाजार और निर्यात तत्परता के
 लिए गुणवत्ता परिणामों में सुधार करके।
 </>
 ) : (
 <>
 This CFC is designed to strengthen the {productCategoryName} ecosystem by providing common
 infrastructure for {interventionLabel.toLowerCase()}. It supports ODOP manufacturers, farmers,
 and MSME units by reducing cost barriers and improving quality outcomes for market and export
 readiness.
 </>
 )}
 </p>

 <p>
 {isHi ? (
 <>
 <strong>सीएफसी का उद्देश्य:</strong> राज्य में ओडीओपी निर्माताओं और एमएसएमई के लिए
 अत्याधुनिक तकनीकी अवसंरचना विकसित करना।
 </>
 ) : (
 <>
 <strong>Objective of CFCs:</strong> To develop state-of-the-art
 technical infrastructure for ODOP manufacturers and MSMEs in the
 state.
 </>
 )}
 </p>
 <div className="about-highlights-list">
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>{isHi ? "ओडीओपी प्राथमिकता क्लस्टर" : "ODOP Priority Cluster"}</span>
 </div>
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>
 {isHi ? `${productCategoryName} मूल्य श्रृंखला` : `${productCategoryName} Value Chain`}
 </span>
 </div>
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>{isHi ? "एमएसएमई और किसान सहायता" : "MSME and Farmer Support"}</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <main className="cfc-page section">
 <div className="container">
 {/* Basic Information Section */}
 <section className="cfc-section">
 <h2>
 {isHi ? "मूल जानकारी - सरकारी सीएफसी योजना" : "Basic Information - Government CFC Scheme"}
 <span> </span>
 <span className={`status-chip ${cfc.status === "FUNCTIONAL" ? "functional" : "implementation"}`}>
 {isHi ? (cfc.status === "FUNCTIONAL" ? "कार्यात्मक" : "कार्यान्वयनाधीन") : cfc.status}
 </span>
 </h2>
 <div className="cfc-detail-info-grid">
 <div className="cfc-detail-info-item">
 <strong>{isHi ? "ओडीओपी उत्पाद" : "ODOP Product"}</strong>
 <span>{productCategoryName}</span>
 </div>
 <div className="cfc-detail-info-item">
 <strong>{isHi ? "एसपीवी नाम" : "SPV Name"}</strong>
 <span>{cfc.spv_name}</span>
 </div>
 <div className="cfc-detail-info-item">
 <strong>{isHi ? "पता" : "Address"}</strong>
 <span>{cfc.address}</span>
 </div>
 <div className="cfc-detail-info-item">
 <strong>{isHi ? "हस्तक्षेप" : "Intervention"}</strong>
 <span>{interventionLabel}</span>
 </div>
 </div>
 </section>

 {/* Charts Section */}
 <CfcMonthlyReportCharts cfcId={id} />

 {/* Recent Events */}
 <CfcRecentEvents cfcId={id} cfcName={cfc.name} isHi={isHi} />

 {/* Recent Activities */}
 <CfcRecentActivities cfcId={id} cfcName={cfc.name} isHi={isHi} />

 {/* Contact Information Section */}
 <section className="cfc-section">
 <h2>{isHi ? "संपर्क जानकारी" : "Contact Information"}</h2>
 <div className="cfc-detail-contact-card">
 <div className="cfc-detail-contact-left">
 <div className="cfc-detail-contact-visual">
 <CfcDetailVisualMedia
 videoUrl={cfc.video_url}
 thumbnail={cfc.thumbnail}
 alt="CFC office infrastructure"
 variant="contact"
 />
 </div>
 <div className="cfc-detail-contact-person">
 <div className="cfc-detail-contact-person-icon">
 <i className="fas fa-user-circle fa-4x" style={{ color: '#d8e2ee' }}></i>
 </div>
 <div>
 <strong>{isHi ? "संचालन समन्वयक" : "Operations Coordinator"}</strong>
 <span>{isHi ? "जिला सीएफसी प्रतिनिधि" : "District CFC Representative"}</span>
 </div>
 </div>
 <div className="cfc-detail-contact-item">
 <i className="fas fa-building"></i>
 <div>
 <strong>{isHi ? "कार्यालय का पता" : "Office Address"}</strong>
 <span>{cfc.address}</span>
 </div>
 </div>
 <div className="cfc-detail-contact-item">
 <i className="fas fa-phone-alt"></i>
 <div>
 <strong>{isHi ? "मोबाइल नंबर" : "Mobile Number"}</strong>
 <span>{cfc.contact_number}</span>
 </div>
 </div>
 </div>
 <div className="cfc-detail-contact-map">
 <iframe
 title={isHi ? `${cfc.city.districtName} सीएफसी स्थान मानचित्र` : `${cfc.city.districtName} CFC Location Map`}
 src={`https://maps.google.com/maps?q=${encodeURIComponent(cfc.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 ></iframe>
 </div>
 </div>
 </section>

 

 <section className="cfc-section">
 <h2>{isHi ? "उपयोगकर्ता शुल्क मैट्रिक्स (सांकेतिक)" : "User Charge Matrix (Indicative)"}</h2>
 <p className="cfc-detail-note">
 {isHi
 ? "यह अनुभाग जिला सीएफसी दस्तावेज़ की शुल्क तालिका दर्शाता है। पूर्ण दरों और शर्तों के लिए, आधिकारिक पीडीएफ देखें।"
 : "This section represents the charge table from the district CFC document. For complete rates and terms, view the official PDF."}
 </p>
 {cfc.pdf_link && (<div className="cfc-detail-actions">
 <a
 className="cfc-pdf-btn"
 href={cfc.pdf_link}
 target="_blank"
 rel="noopener noreferrer"
 >
 <i className="fas fa-file-pdf"></i> {isHi ? "और देखें / पीडीएफ डाउनलोड करें" : "View More / Download PDF"}
 </a>
 </div>)}
 </section>
 </div>
 </main>
 </div>);
}
