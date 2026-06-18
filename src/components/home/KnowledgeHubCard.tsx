"use client";

import Image from "next/image";
import { FaFilePdf, FaGlobe } from "react-icons/fa6";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { API_CONFIG } from "@/lib/api/config";
import type { KnowledgeHubScrollItem } from "@/lib/api/knowledge-hub-scroll.types";
import type { Language } from "@/hooks/useLanguage";

const KH_IMAGE_DIR = "/assets/img/knowledge-hub";

const ODOP_LOGO: Record<Language, string> = {
  en: "/assets/img/odop-logo.png",
  hi: "/assets/img/odop-logo-h.png",
};

const OPEN_RESOURCE: Record<Language, string> = {
  en: "Open Resource",
  hi: "संसाधन खोलें",
};

type KnowledgeHubCardProps = {
  item: KnowledgeHubScrollItem;
  lang: Language;
};

export function getKnowledgeHubResourceUrl(item: KnowledgeHubScrollItem): string | null {
  if (item.hyperlink) return item.hyperlink;
  if (item.attachment) return `${API_CONFIG.API_URL}${item.attachment}`;
  return null;
}

export default function KnowledgeHubCard({ item, lang }: KnowledgeHubCardProps) {
  const resourceUrl = getKnowledgeHubResourceUrl(item);
  const isPdf = !item.hyperlink && Boolean(item.attachment);
  const ActionIcon = isPdf ? FaFilePdf : FaGlobe;

  const title = lang === "hi" ? item.titleHindi || item.title : item.title;
  const description = lang === "hi" ? item.descriptionHindi || item.description : item.description;
  const department = lang === "hi" ? item.departmentHindi || item.department : item.department;

  const Wrapper: "a" | "div" = resourceUrl ? "a" : "div";
  const wrapperProps = resourceUrl
    ? { href: resourceUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="kh-card reveal"
      aria-label={`${title} — open resource`}
    >
      <div className="kh-card-thumb">
        <Image
          src={`${KH_IMAGE_DIR}/KH-Backdrop.png`}
          alt=""
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 20vw"
          quality={75}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL.light}
          className="kh-card-bg"
          aria-hidden="true"
        />

        <div className="kh-card-content">
          <div className="kh-card-logo">
            <Image
              src={ODOP_LOGO[lang]}
              alt="ODOP — One District One Product, Uttar Pradesh"
              width={620}
              height={320}
              sizes="(max-width: 640px) 45vw, 12vw"
              quality={85}
            />
          </div>

          <div className="kh-card-title">
            <span className="kh-card-title-main">{title}</span>
          </div>

          {description && <p className="kh-card-subtitle">{description}</p>}

          <div className="kh-card-divider">
            <Image
              src={`${KH_IMAGE_DIR}/element.png`}
              alt=""
              fill
              sizes="(max-width: 640px) 60vw, 14vw"
              quality={75}
              aria-hidden="true"
            />
          </div>

          {department && <p className="kh-card-department">{department}</p>}
        </div>

        {resourceUrl && (
          <span className="kh-card-overlay">
            <span className="kh-card-link-pill">{OPEN_RESOURCE[lang]}</span>
            <span className="kh-card-action" aria-hidden="true">
              <ActionIcon />
            </span>
          </span>
        )}
      </div>
    </Wrapper>
  );
}
