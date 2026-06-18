"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolvePublicAssetUrl } from "@/lib/scheme-media";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import {
  SUPPLIER_CONNECT_BUTTONS,
  buildSupplierDirectoryHref,
} from "@/lib/supplier-directory-links";
import { SuccessStoryListModal } from "@/app/(public)/knowledge-base/success-story/SuccessStoryListModal";
import type { SuccessStory } from "@/app/(public)/knowledge-base/success-story/SuccessStoryListModal";
import type {
  DistrictDetailResponse,
  DistrictDetailProduct,
  DistrictDetailCfc,
  DistrictDetailType,
  DistrictDetailView,
  DistrictDetailSuccessStory,
  DistrictDetailDocumentary,
  DistrictDetailNablLab,
  DistrictDetailProjectReport,
  DistrictSchemesData,
} from "@/lib/api/districts.types";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export type DistrictProduct = DistrictDetailProduct;
export type DistrictType = DistrictDetailType;
export type District = DistrictDetailView;
export type DistrictResponse = DistrictDetailResponse;

function ProductConnectActions({
  districtId,
  productCategoryId,
  productName,
}: {
  districtId: number;
  productCategoryId: number;
  productName: string;
}) {
  return (
    <div className="connect-grid">
      {SUPPLIER_CONNECT_BUTTONS.map((btn) => (
        <Link
          key={btn.kind}
          href={buildSupplierDirectoryHref(
            districtId,
            btn.kind
          )}
          className="connect-card"
        >
          <div className="connect-icon">
            <i className={`fas ${btn.icon}`}></i>
          </div>

          <div className="connect-title">
            {btn.shortLabel}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProductImageGallery({
  images,
  productName,
  isHi,
}: {
  images: string[];
  productName: string;
  isHi: boolean;
}) {
  if (images.length === 0) return null;

  return (
    <div
      className="district-product-image-grid"
      aria-label={isHi ? `${productName} की छवियां` : `${productName} images`}
    >
      {images.map((src, idx) => (
        <div key={idx} className="district-product-image-item">
          <Image
            src={src}
            alt={`${productName} — image ${idx + 1}`}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL.light}
          />
        </div>
      ))}
    </div>
  );
}

function CfcCard({ cfc }: { cfc: DistrictDetailCfc }) {
  const detailHref = cfc.id ? `/resources/cfc-list/${cfc.id}` : null;

  return (
    <li className="district-product-cfc-row">
      {detailHref ? (
        <Link href={detailHref} className="district-product-cfc-row-link">
          <span className="district-product-cfc-row-name">{cfc.name}</span>
          <i className="fas fa-chevron-right district-product-cfc-row-arrow" aria-hidden></i>
        </Link>
      ) : (
        <span className="district-product-cfc-row-name district-product-cfc-row-name--static">
          {cfc.name}
        </span>
      )}
      {cfc.status && (
        <span
          className={`district-product-cfc-badge district-product-cfc-badge-status${cfc.status.toLowerCase() === "functional" ? " is-functional" : ""}`}
        >
          {cfc.status}
        </span>
      )}
    </li>
  );
}

function toModalStory(story: DistrictDetailSuccessStory): SuccessStory {
  return {
    id: story.id,
    name: story.name,
    businessName: story.businessName,
    shortDescription: story.shortDescription,
    fullStory: story.fullStory,
    profileImage: story.profileImage,
  };
}

function DistrictSuccessStoriesSection({
  stories,
  districtName,
  isHi,
}: {
  stories: DistrictDetailSuccessStory[];
  districtName: string;
  isHi: boolean;
}) {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  if (stories.length === 0) return null;

  return (
    <div className="district-portal-resource-block ">
      <header className="district-portal-resource-head">
        <h2 className="district-portal-resource-title">
          {isHi ? "सफलता की कहानियां" : "Success Stories"}
        </h2>
        <p className="district-portal-resource-subtitle">
          {isHi ? `${districtName} के उद्यमी और व्यवसाय` : `Entrepreneurs and businesses from ${districtName}`}
        </p>
      </header>
      <ul className="district-portal-compact-list district-portal-success-list">
        {stories.map((story) => (
          <li key={story.id}>
            <button
              type="button"
              className="district-portal-success-row"
              onClick={() => setSelectedStory(toModalStory(story))}
            >
              {story.profileImage ? (
                <Image
                  src={story.profileImage}
                  alt=""
                  className="district-portal-success-row-thumb"
                  width={80}
                  height={80}
                  sizes="80px"
                  quality={60}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                />
              ) : (
                <span className="district-portal-success-row-thumb district-portal-success-row-thumb-placeholder" aria-hidden>
                  <i className="fas fa-user"></i>
                </span>
              )}
              <span className="district-portal-success-row-main">
                <span className="district-portal-success-row-top">
                  <span className="district-portal-success-row-name">{story.name}</span>
                </span>
                <span className="district-portal-success-row-business">{story.businessName}</span>
              </span>
              <span className="district-portal-success-row-action">
                {isHi ? "कहानी पढ़ें" : "Read story"} <i className="fas fa-chevron-right" aria-hidden></i>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <SuccessStoryListModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}

function DistrictDocumentariesSection({ documentaries, districtDocumentaryThumbnail, isHi }: { documentaries: DistrictDetailDocumentary[]; districtDocumentaryThumbnail?: string; isHi: boolean }) {
  const [imageError, setImageError] = useState(false);
  const currentLang = isHi ? "hi" : "en";
  const langDocs = documentaries.filter((doc) => doc.language === currentLang);

  if (langDocs.length === 0) return null;

  return (
    <div className="district-portal-resource-block">
      <header className="district-portal-resource-head">
        <h2 className="district-portal-resource-title">
          {isHi ? "वृत्तचित्र" : "Documentaries"}
        </h2>
        <p className="district-portal-resource-subtitle">
          {isHi ? "जिला वृत्तचित्र वीडियो" : "District documentary videos"}
        </p>
      </header>
      <ul className="district-portal-compact-list">
        {langDocs.map((doc) => {
          const thumbSrc = doc.thumbnail || districtDocumentaryThumbnail || "";
          return (
            <li key={doc.id} className="district-portal-doc-row">

              {thumbSrc && !imageError ? (
                <Image
                  src={thumbSrc}
                  alt=""
                  className="district-portal-doc-row-thumb"
                  width={80}
                  height={80}
                  sizes="80px"
                  quality={60}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <span className="district-portal-doc-row-thumb district-portal-doc-row-thumb-placeholder" aria-hidden>
                  <i className="fas fa-film"></i>
                </span>
              )}
              <span className="district-portal-doc-row-title">{doc.title}</span>
              {doc.video_url && (
                <a
                  href={doc.video_url}
                  className="district-portal-inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-play-circle" aria-hidden></i> {isHi ? "देखें" : "Watch"}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DistrictNablLabsSection({ labs, districtName, isHi }: { labs: DistrictDetailNablLab[]; districtName: string; isHi: boolean }) {
  if (labs.length === 0) return null;

  return (
    <div className="district-portal-resource-block">
      <header className="district-portal-resource-head">
        <h2 className="district-portal-resource-title">
          {isHi ? "NABL प्रयोगशालाएं" : "NABL Labs"}
        </h2>
        <p className="district-portal-resource-subtitle">
          {isHi ? `${districtName} में परीक्षण प्रयोगशालाएं` : `Testing laboratories in ${districtName}`}
        </p>
      </header>
      <div className="district-portal-table-wrap">
        <table className="district-portal-data-table district-portal-nabl-table">
          <thead>
            <tr>
              <th>{isHi ? "प्रयोगशाला का नाम" : "Lab Name"}</th>
              <th>{isHi ? "कोड" : "Code"}</th>
              <th>{isHi ? "ओडीओपी श्रेणी" : "ODOP Category"}</th>
              <th>{isHi ? "अनुशासन" : "Discipline"}</th>
              {/* <th>{isHi ? "संपर्क" : "Contact"}</th> */}
              <th>{isHi ? "स्थिति" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id}>
                <td data-label={isHi ? "प्रयोगशाला का नाम" : "Lab Name"}>
                  <span className="district-portal-table-primary">{(isHi ? lab.lab_name_hindi || lab.lab_name : lab.lab_name)}</span>
                  {lab.address && (
                    <span className="district-portal-table-sub">{lab.address}</span>
                  )}
                </td>
                <td data-label={isHi ? "कोड" : "Code"}>{lab.lab_code || "—"}</td>
                <td data-label={isHi ? "ओडीओपी श्रेणी" : "ODOP Category"}>
                  {(isHi ? lab.product_name_hindi || lab.product_name : lab.product_name) || "—"}
                </td>
                <td data-label={isHi ? "अनुशासन" : "Discipline"}>
                  {lab.disciplines.length > 0
                    ? lab.disciplines.join(", ")
                    : (isHi ? lab.product_name_hindi || lab.product_name : lab.product_name) || "—"}
                </td>
                {/* <td data-label={isHi ? "संपर्क" : "Contact"}>
                  <div className="district-portal-table-contact">
                    {lab.contact_number && (
                      <a href={`tel:${lab.contact_number.replace(/[^\d+]/g, "")}`}>{lab.contact_number}</a>
                    )}
                    {lab.email && <a href={`mailto:${lab.email}`}>{lab.email}</a>}
                    {!lab.contact_number && !lab.email && "—"}
                  </div>
                </td> */}
                <td data-label={isHi ? "स्थिति" : "Status"}>
                  {lab.status ? (
                    <span className="district-portal-resource-badge district-portal-resource-badge-status">
                      {lab.status}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DistrictProjectReportsSection({ reports, isHi }: { reports: DistrictDetailProjectReport[]; isHi: boolean }) {
  if (reports.length === 0) return null;

  return (
    <div className="district-portal-resource-block">
      <header className="district-portal-resource-head">
        <h2 className="district-portal-resource-title">
          {isHi ? "परियोजना रिपोर्ट" : "Project Reports"}
        </h2>
        <p className="district-portal-resource-subtitle">
          {isHi ? "जिला परियोजना दस्तावेज़ीकरण" : "District project documentation"}
        </p>
      </header>
      <ul className="district-portal-compact-list">
        {reports.map((report) => {
          const detailHref = report.slug
            ? `/knowledge-base/project-report/${report.slug}`
            : report.file_url || undefined;

          return (
            <li key={report.id} className="district-portal-report-row">
              <span className="district-portal-report-row-icon" aria-hidden>
                <i className="fas fa-file-lines"></i>
              </span>
              <span className="district-portal-report-row-title">{report.title}</span>
              {detailHref ? (
                <Link href={detailHref} className="district-portal-inline-link">
                  {isHi ? "देखें" : "View"} <i className="fas fa-arrow-right" aria-hidden></i>
                </Link>
              ) : (
                <span className="district-portal-inline-muted">—</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CfcList({ cfcs, productName, isHi }: { cfcs: DistrictDetailCfc[]; productName: string; isHi: boolean }) {
  if (cfcs.length === 0) return null;
  return (
    <div className="district-product-cfc-section">
      <h4 className="district-product-cfc-heading">
        <i className="fas fa-industry" aria-hidden></i>
        {isHi ? `सामान्य सुविधा केंद्र${cfcs.length > 1 ? "" : ""}` : `Common Facility Centre${cfcs.length > 1 ? "s" : ""}`}
        <span className="district-product-cfc-heading-product">{productName}</span>
      </h4>
      <ul className="district-product-cfc-compact-list">
        {cfcs.map((cfc) => (
          <CfcCard key={cfc.id} cfc={cfc} />
        ))}
      </ul>
    </div>
  );
}

function getProductDisplayImage(product: DistrictDetailProduct): string {
  return product.images.find((image) => image.trim()) || product.thumbnail;
}

function DistrictSchemesSection({ schemes, isHi }: { schemes: DistrictSchemesData; isHi: boolean }) {
  const { connected_schemes } = schemes;
  if (!connected_schemes || connected_schemes.length === 0) return null;

  return (
    <div className="district-portal-resource-block">
      <header className="district-portal-resource-head">
        <h2 className="district-portal-resource-title">
          {isHi ? "संबंधित योजनाएं" : "Related Schemes"}
        </h2>
      </header>
      <div className="district-portal-table-wrap">
        <table className="district-portal-data-table district-portal-schemes-table">
          <thead>
            <tr>
              <th>{isHi ? "क्र.सं." : "S.No."}</th>
              <th>{isHi ? "विभाग" : "Department"}</th>
              <th>{isHi ? "योजना" : "Scheme"}</th>
            </tr>
          </thead>
          <tbody>
            {connected_schemes.map((scheme, idx) => (
              <tr key={idx}>
                <td data-label={isHi ? "क्र.सं." : "S.No."}>{idx + 1}</td>
                <td data-label={isHi ? "विभाग" : "Department"}>{scheme.department || "—"}</td>
                <td data-label={isHi ? "योजना" : "Scheme"}>
                  {scheme.scheme_hyperlink ? (
                    <a
                      href={scheme.scheme_hyperlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="district-portal-inline-link"
                    >
                      {scheme.scheme_name}
                    </a>
                  ) : (
                    scheme.scheme_name || "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DistrictDetailClientProps {
  data: DistrictDetailResponse;
  schemes?: DistrictSchemesData | null;
  isHi?: boolean;
}

export default function DistrictDetailClient({ data, schemes, isHi = false }: DistrictDetailClientProps) {
  const { district } = data;
  const products = useMemo(() => district.district_product ?? [], [district.district_product]);
  const successStories = district.success_stories || [];
  const documentaries = district.documentaries || [];
  const nablLabs = district.nabl_labs || [];
  const projectReports = district.project_reports || [];

  useEffect(() => {
    console.log("[District Detail] page product data", {
      district: {
        id: district.id,
        name: district.name,
        slug: district.slug,
      },
      products,
    });

    console.table(
      products.map((product, index) => ({
        index: index + 1,
        id: product.id,
        name: product.name,
        hindiName: product.hindi_name,
        displayImage: getProductDisplayImage(product),
        thumbnail: product.thumbnail,
        imagesCount: product.images.length,
        cfcCount: product.cfcs?.length ?? 0,
      }))
    );
  }, [district.id, district.name, district.slug, products]);

  const hasDistrictResources =
    successStories.length > 0 ||
    documentaries.length > 0 ||
    nablLabs.length > 0 ||
    projectReports.length > 0 ||
    (schemes?.connected_schemes?.length ?? 0) > 0;

  const getImageUrl = (path?: string) => {
    if (!path) return undefined;
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("/assets/")
    ) {
      return path;
    }
    return resolvePublicAssetUrl(path);
  };

  const heroImageUrl = getImageUrl(district.thumbnail);
  return (
    <BoneyardSkeleton name="district-detail" loading={false}>
      <main className="district-portal-page">
        <section className="district-hero-banner" aria-label={isHi ? (district.hindi_name || district.name) : district.name}>
          {heroImageUrl ? (
            <>
              <div className="district-hero-banner-slider">
                <Swiper
                  modules={[Autoplay]}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                >
                  {products.map((product, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        src={getProductDisplayImage(product)}
                        alt={isHi ? (product.hindi_name || product.name) : product.name}
                        className="district-hero-banner-img"
                        width={1200}
                        height={400}
                        sizes="100vw"
                        quality={80}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL.light}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="district-hero-banner-title">
                  <h1
                    id="district-intro-name"
                    className="district-portal-district-name district-intro-reveal district-intro-reveal--1"
                  >
                    {isHi ? (district.hindi_name || district.name) : district.name}
                  </h1>
                </div>

              </div>
            </>
          ) : (
            <div className="district-hero-banner-placeholder" />
          )}
        </section>

        <section className="district-portal-district-intro-section" aria-labelledby="district-intro-name">
          <div className="district-portal-tab-list" role="tablist">
            {products.map((product, idx) => (
              <button
                key={idx}
                className="eyebrow district-portal-tab active"
                type="button"
                role="tab"
                onClick={() => {
                  const el = document.getElementById(`product-section-${product.linkId ?? product.id ?? idx}`);
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
              >
                {isHi ? (product.hindi_name || product.name) : product.name}
              </button>
            ))}
          </div>
          <div className="container district-portal-district-intro-inner">
            {(() => {
              const desc = isHi
                ? (district.hindi_description || district.description)
                : district.description;
              const fallback = isHi
                ? (district.short_description || "इस ODOP जिले की अनूठी विरासत, उत्पादों और संस्कृति की खोज।")
                : (district.short_description || "Exploring the unique heritage, products, and culture of this ODOP district.");
              return desc ? (
                <div
                  className="district-portal-district-description district-intro-reveal district-intro-reveal--2"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              ) : (
                <p className="district-portal-district-description district-intro-reveal district-intro-reveal--2">
                  {fallback}
                </p>
              );
            })()}
          </div>
        </section>
        <section className="section district-portal-products">
          <div className="container">
            <div className="district-portal-product-stack district-portal-products-full">
              {products.length === 0 && (
                <p className="district-portal-empty">
                  {isHi ? "इस जिले के लिए अभी कोई उत्पाद सूचीबद्ध नहीं है।" : "No products listed for this district yet."}
                </p>
              )}

              {products.map((product, idx) => {
                const isEven = idx % 2 === 0;
                const productName = isHi ? (product.hindi_name || product.name) : product.name;
                const productDesc = isHi ? (product.hindi_description || product.description) : product.description;
                const productImage = getProductDisplayImage(product);
                return (
                  <article
                    key={product.linkId ?? product.id ?? idx}
                    id={`product-section-${product.linkId ?? product.id ?? idx}`}
                    className={`district-product-card ${isEven ? "layout-left" : "layout-right"
                      }`}
                  >
                    <div className="district-product-image-section">
                      <div className="product-image-wrapper">
                        <Image
                          src={productImage}
                          alt={productName}
                          fill
                          quality={75}
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL.light}
                          className="district-product-image"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>

                    <div className="district-product-content-section">
                      <h2 className="district-product-card-title">
                        {productName}
                      </h2>

                      {productDesc && (
                        <div
                          className="district-product-card-description"
                          dangerouslySetInnerHTML={{
                            __html: productDesc,
                          }}
                        />
                      )}

                      <div className="cus-actions">
                        <PillLink
                          href={buildSupplierDirectoryHref(district.id,  "artisan")}
                          iconSrc="/assets/img/icon/directory_1.png"
                        >
                          {isHi ? "कारीगर / बुनकर / शिल्पकार" : "Artisans / Weavers / Craftsmen"}
                        </PillLink>
                        <PillLink
                          href={buildSupplierDirectoryHref(district.id,  "manufacturer")}
                          iconSrc="/assets/img/icon/directory_2.png"
                        >
                          {isHi ? "निर्माता / थोक विक्रेता" : "Manufacturers / Wholesalers"}
                        </PillLink>
                        <PillLink
                          href={buildSupplierDirectoryHref(district.id,  "exporter")}
                          iconSrc="/assets/img/icon/directory_3.png"
                        >
                          {isHi ? "निर्यातक" : "Exporters"}
                        </PillLink>
                      </div>


                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {hasDistrictResources && (
          <section className="section district-portal-resources">
            <div className="container">
              <div className="district-portal-resources-panel">
                <div className="district-cfcs-resources">
                  {products.map((product, idx) => (
                    <CfcList
                      key={idx}
                      cfcs={product.cfcs}
                      productName={isHi ? (product.hindi_name || product.name) : product.name}
                      isHi={isHi}
                    />
                  ))}
                </div>
                <DistrictSuccessStoriesSection
                  stories={successStories}
                  districtName={isHi ? (district.hindi_name || district.name) : district.name}
                  isHi={isHi}
                />

                <DistrictDocumentariesSection
                  documentaries={documentaries}
                  districtDocumentaryThumbnail={district.documentaryThumbnail}
                  isHi={isHi}
                />

                <DistrictNablLabsSection
                  labs={nablLabs}
                  districtName={isHi ? (district.hindi_name || district.name) : district.name}
                  isHi={isHi}
                />

                <DistrictProjectReportsSection reports={projectReports} isHi={isHi} />

                {schemes && <DistrictSchemesSection schemes={schemes} isHi={isHi} />}
              </div>
            </div>
          </section>
        )}
      </main>
    </BoneyardSkeleton>
  );
}


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
