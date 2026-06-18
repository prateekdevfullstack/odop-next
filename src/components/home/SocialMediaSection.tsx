"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import InstagramTimelineWidget from "@/components/home/InstagramTimelineWidget";
import TwitterTimelineWidget from "@/components/home/TwitterTimelineWidget";
import { UP_ODOP_INSTAGRAM_PROFILE_URL } from "@/lib/instagram-posts";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import { useLanguage } from "@/hooks/useLanguage";

const AVATAR = "/assets/img/logo-o.png";

type PlatformId = "facebook" | "instagram" | "youtube" | "x";

// Dynamic embed sources (update once you have official URLs/IDs).
const FACEBOOK_PAGE_URL = "https://www.facebook.com/ODOPUP/";
// Set a YouTube channel uploads playlist (preferred) or a playlist ID.
// Example uploads playlist: "UUxxxxxxxxxxxxxxxxxxxxxx"
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@UP_ODOP";
// YouTube "uploads" playlist id is the channel id with UC -> UU.
const YOUTUBE_PLAYLIST_OR_UPLOADS = "UUbMFWymkEnsS22XuM1JMKxw";
const X_PROFILE_URL = "https://x.com/UP_ODOP";

type SocialCardConfig = {
  id: PlatformId;
  href: string;
  profileName: string;
  profileMeta: string;
};

const PLATFORM_BRAND_LOGOS: Partial<
  Record<PlatformId, { src: string; alt: string; width: number; height: number }>
> = {
  facebook: {
    src: "/assets/img/icon/fb.png",
    alt: "Facebook",
    width: 132,
    height: 28,
  },
  instagram: {
    src: "/assets/img/icon/insta.png",
    alt: "Instagram",
    width: 148,
    height: 32,
  },
  youtube: {
    src: "/assets/img/icon/youtube.png",
    alt: "YouTube",
    width: 140,
    height: 28,
  },
};

const X_TAB_ICON = { Icon: FaXTwitter, iconClass: "sms-platform__icon--x" };

const SOCIAL_CARDS: SocialCardConfig[] = [
  {
    id: "facebook",
    href: FACEBOOK_PAGE_URL,
    profileName: "One District One Product",
    profileMeta: "16k Followers · 2.7k Posts",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/up_odop/",
    profileName: "UP_ODOP",
    profileMeta: "9,408 Followers · 834 Posts",
  },
  {
    id: "youtube",
    href: YOUTUBE_CHANNEL_URL,
    profileName: "@UP_ODOP",
    profileMeta: "1.11K subscribers · 464 videos",
  },
  {
    id: "x",
    href: X_PROFILE_URL,
    profileName: "@UP_ODOP",
    profileMeta: "95 Following · 24.8K Followers",
  },
];

function IframeEmbed({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <div className="sms-embed">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
}

function FacebookEmbed() {
  const src = useMemo(() => {
    const href = encodeURIComponent(FACEBOOK_PAGE_URL);
    const width = 340;
    const height = 360;
    return `https://www.facebook.com/plugins/page.php?href=${href}&tabs=timeline&width=${width}&height=${height}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;
  }, []);

  return <IframeEmbed title="ODOP Facebook timeline" src={src} />;
}

function YouTubeEmbed() {
  const src = useMemo(() => {
    if (YOUTUBE_PLAYLIST_OR_UPLOADS.trim()) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
        YOUTUBE_PLAYLIST_OR_UPLOADS.trim(),
      )}`;
    }
    // Fallback: show the ODOP video gallery route.
    return "/media/video-gallery";
  }, []);

  return <IframeEmbed title="ODOP YouTube / videos" src={src} />;
}

function PlatformHeader({ platform }: { platform: PlatformId }) {
  const brand = PLATFORM_BRAND_LOGOS[platform];

  if (brand) {
    return (
      <div className="sms-platform sms-platform--brand">
        <Image
          src={brand.src}
          alt={brand.alt}
          width={brand.width}
          height={brand.height}
          className="sms-platform__brand instagram"
        />
      </div>
    );
  }

  const { Icon, iconClass } = X_TAB_ICON;

  return (
    <div className="sms-platform sms-platform--brand" aria-label="X">
      <span className={`sms-platform__icon ${iconClass}`} aria-hidden>
        <Icon />
      </span>
    </div>
  );
}

function ProfileRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="sms-profile">
      <div className="sms-profile__avatar">
        <Image
          src={AVATAR}
          alt=""
          width={48}
          height={48}
          className="sms-profile__avatar-img"
        />
      </div>
      <div className="sms-profile__text">
        <p className="sms-profile__name">{name}</p>
        <p className="sms-profile__meta">{meta}</p>
      </div>
    </div>
  );
}

function EmbedPlaceholder({ href, label }: { href: string; label: string }) {
  return (
    <div className="sms-embed sms-embed--placeholder" aria-hidden>
      <a
        className="sms-embed-placeholder__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
      >
        {label}
      </a>
    </div>
  );
}

function SocialCardEmbed({
  card,
  embedsReady,
}: {
  card: SocialCardConfig;
  embedsReady: boolean;
}) {
  if (!embedsReady) {
    return <EmbedPlaceholder href={card.href} label={`View on ${card.id}`} />;
  }

  if (card.id === "facebook") return <FacebookEmbed />;
  if (card.id === "instagram") {
    return <InstagramTimelineWidget profileUrl={UP_ODOP_INSTAGRAM_PROFILE_URL} />;
  }
  if (card.id === "youtube") return <YouTubeEmbed />;
  return <TwitterTimelineWidget profileUrl={X_PROFILE_URL} />;
}

function SocialCard({
  card,
  embedsReady,
}: {
  card: SocialCardConfig;
  embedsReady: boolean;
}) {
  return (
    <div className="sms-card reveal" aria-label={`${card.profileName} on ${card.id}`}>
      <div className="sms-card__shell">
        <PlatformHeader platform={card.id} />
        <div className="sms-card__content">
          <ProfileRow name={card.profileName} meta={card.profileMeta} />
          <SocialCardEmbed card={card} embedsReady={embedsReady} />
        </div>
      </div>
    </div>
  );
}

/** Home social feeds — Figma-style platform cards; heading matches ODOP section pills. */
export default function SocialMediaSection() {
  const isHi = useLanguage() === "hi";
  const sectionRef = useRef<HTMLElement>(null);
  const [embedsReady, setEmbedsReady] = useState(false);

  useScrollReveal([embedsReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEmbedsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="social-media"
      className="sms-section"
      aria-label={isHi ? "सोशल मीडिया पर ओडीओपी" : "ODOP on social media"}
    >
      <div className="container sms-inner">
        <CapsuleHeading>{isHi ? "सोशल मीडिया पर ओडीओपी" : "ODOP ON SOCIAL MEDIA"}</CapsuleHeading>

        <div className="sms-cards" role="list" aria-label="Social media platform previews">
          {SOCIAL_CARDS.map((card) => (
            <div key={card.id} role="listitem" id={card.id === "x" ? "sms-card-x" : undefined}>
              <SocialCard card={card} embedsReady={embedsReady} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sms-section {
          scroll-margin-top: 140px;
          background: #f3f4f6;
          padding: clamp(36px, 5vw, 56px) 0 clamp(32px, 4vw, 48px);
        }

        .sms-inner {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(24px, 3.5vw, 40px);
          overflow: visible;
        }

        .sms-top-posts {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
        }

        .sms-top-posts__heading {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-weight: 600;
          font-size: clamp(0.9rem, 1.6vw, 1.125rem);
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #363b42;
        }

        .sms-top-posts__list {
          display: flex;
          flex-wrap: nowrap;
          gap: 12px;
          margin: 0;
          padding: 4px 2px 8px;
          list-style: none;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }

        .sms-top-posts__item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          flex: 0 0 auto;
          width: min(300px, 82vw);
          min-height: 118px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .sms-top-posts__item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .sms-top-posts__item--active {
          border-color: rgba(179, 84, 0, 0.45);
          box-shadow: 0 0 0 2px rgba(255, 245, 233, 0.9), 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .sms-top-posts__badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          font-family: "Montserrat", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .sms-top-posts__badge--facebook {
          background: rgba(24, 119, 242, 0.12);
          color: #1877f2;
        }

        .sms-top-posts__badge--instagram {
          background: rgba(225, 48, 108, 0.12);
          color: #c13584;
        }

        .sms-top-posts__badge--youtube {
          background: rgba(255, 0, 0, 0.1);
          color: #ff0000;
        }

        .sms-top-posts__badge--x {
          background: rgba(15, 23, 42, 0.1);
          color: #0f172a;
        }

        .sms-top-posts__title {
          font-family: "Poppins", sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.45;
          color: #111827;
        }

        .sms-top-posts__date {
          margin-top: auto;
          font-family: "Poppins", sans-serif;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .sms-cards {
          --sms-tab-fold: 10px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 2.5vw, 28px);
          width: calc(100% + (var(--sms-tab-fold) * 2));
          margin-inline: calc(var(--sms-tab-fold) * -1);
          overflow: visible;
        }

        .sms-cards > [role="listitem"] {
          overflow: visible;
          min-width: 0;
        }

        .sms-card {
          display: block;
          color: inherit;
          min-width: 0;
          padding-top: 14px;
          overflow: visible;
        }

        .sms-card__shell {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: 411px;
          max-height: 411px;
          padding-top: 30px;
          border-radius: 0 0 10px 10px;
          background: #DADDD8;
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.14);
          overflow: visible;
        }


        .sms-card__content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          padding: 8px 12px 0;
          // background: #e5e7eb;
          // background: orange;
          border-radius: inherit;
          overflow: hidden;
        }

        .sms-platform__brand {
          display: block;
          width: 7rem;
        }

        .sms-platform {
          --sms-tab-fold: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          gap: 12px;
          padding: 10px 16px;
          position: absolute;
          top: 7px;
          left: 50%;
          width: calc(100% - (var(--sms-tab-fold) * 2));
          max-width: 100%;
          min-height: 50px;
          max-height: 50px;
          transform: translate(-50%, -50%);
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 0px 0px 8px 8px;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
          z-index: 3;
        }

        .sms-platform::before,
        .sms-platform::after {
          content: "";
          position: absolute;
          top: 1px;
          width: 10px;
          height: 20px;
          pointer-events: none;
        }

        .sms-platform::before {
          right: 100%;
          background-color:#BABABA;
          clip-path: polygon(100% 0, 0% 100%, 100% 100%);
          // border-right: var(--sms-tab-fold) solid #d1d5db;
          // border-top: 48px solid transparent;
        }

        .sms-platform::after {
          left: 100%;
          background-color:#BABABA;
          clip-path: polygon(0 0, 0% 100%, 100% 100%);
          // border-left: var(--sms-tab-fold) solid #d1d5db;
          // border-top: 48px solid transparent;
        }

        .sms-platform__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .sms-platform__icon--x {
          background: #0f172a;
          font-size: 0.85rem;
        }

        .sms-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 4px 12px;
        }

        .sms-profile__avatar {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .sms-profile__avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sms-profile__name {
          margin: 0;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.3;
          color: #111827;
        }

        .sms-profile__meta {
          margin: 2px 0 0;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.78rem;
          line-height: 1.35;
          color: #6b7280;
        }

        .sms-embed {
          flex: 1;
          margin: 0 -12px;
          min-height: 0;
          background: #ffffff;
          border-radius: 0 0 10px 10px;
        }

        .sms-embed:not(.sms-embed--widget) {
          overflow: hidden;
        }

        .sms-embed iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
          background: #ffffff;
        }

        .sms-embed--widget {
          display: flex;
          flex-direction: column;
          padding: 8px 10px 12px;
          background: #ffffff;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .sms-embed--x,
        .sms-embed--instagram {
          min-height: 360px;
        }

        .sms-embed--x iframe {
          min-height: 300px !important;
          width: 100% !important;
        }

        .sms-embed-fallback {
          flex: 1;
          margin: 0 -12px;
          padding: 16px 12px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          font-family: "Poppins", sans-serif;
          font-size: 0.85rem;
          color: #6b7280;
          text-align: center;
        }

        .sms-embed--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: #f9fafb;
        }

        .sms-embed-placeholder__link {
          font-family: "Poppins", sans-serif;
          font-size: 0.85rem;
          color: #9ca3af;
          text-decoration: none;
          pointer-events: none;
        }

        .sms-card:hover .sms-card__shell {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        @media (min-width: 1024px) {
          .sms-top-posts__list {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            overflow: visible;
          }

          .sms-top-posts__item {
            width: 100%;
          }
        }

        @media (max-width: 1200px) {
          .sms-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            width: 100%;
            margin-inline: 0;
            overflow-x: visible;
          }

          .sms-cards > [role="listitem"] {
            width: 100%;
          }

        }

        @media (max-width: 640px) {
          .sms-cards {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
