import React from "react";
import Image from "next/image";
import FeatureGridLink from "@/components/home/FeatureGridLink";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { getLanguageServer } from "@/lib/language";

interface FeatureItem {
  title: string;
  titleHi?: string;
  link: string;
  imageSrc: string;
  isExternal?: boolean;
  label?: React.ReactNode;
  labelHi?: React.ReactNode;
  badge?: string;
}

const CARD_WIDTH = 870;
const CARD_HEIGHT = 670;

function cardImage(index: number) {
  return `/assets/img/Cards/${index}_card.png`;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: "District wise ODOP Products",
    titleHi: "जिलेवार ओडीओपी उत्पाद",
    labelHi: "जिलेवार ओडीओपी उत्पाद",
    link: "#district-products",
    imageSrc: cardImage(1),
    badge: "/assets/img/Cards/1_district_location.png",
  },
  {
    title: "Brand ODOP",
    titleHi: "ब्रांड ओडीओपी",
    labelHi: "ब्रांड ओडीओपी",
    link: "#odop-brand",
    imageSrc: cardImage(2),
  },
  {
    title: "Leadership",
    titleHi: "नेतृत्व",
    labelHi: "नेतृत्व",
    link: "#leadership-desk",
    imageSrc: cardImage(3),
  },
  {
    title: "ODOP Schemes & Policies",
    titleHi: "ओडीओपी योजनाएं और नीतियां",
    labelHi: "ओडीओपी योजनाएं और नीतियां",
    link: "#odop-schemes",
    imageSrc: cardImage(4),
  },
  {
    title: "MSME Schemes & Policies",
    titleHi: "एमएसएमई योजनाएं और नीतियां",
    labelHi: "एमएसएमई योजनाएं और नीतियां",
    link: "#msme-schemes",
    imageSrc: cardImage(5),
  },
  {
    title: "ODOP E-MARKET",
    titleHi: "ओडीओपी ई-मार्केट",
    labelHi: "ओडीओपी ई-मार्केट",
    link: "https://odopmart.up.gov.in/",
    isExternal: true,
    imageSrc: cardImage(6),
  },
  {
    title: "Common Facility Centres (CFCs)",
    titleHi: "सामान्य सुविधा केंद्र (सीएफसी)",
    labelHi: "सामान्य सुविधा केंद्र (सीएफसी)",
    link: "/resources/cfc-list",
    imageSrc: cardImage(7),
  },
  {
    title: "Success Stories",
    titleHi: "सफलता की कहानियां",
    labelHi: "सफलता की कहानियां",
    link: "#success-stories",
    imageSrc: cardImage(8),
  },
  {
    title: "Exhibitions & Fairs",
    titleHi: "प्रदर्शनियां और मेले",
    labelHi: "प्रदर्शनियां और मेले",
    link: "/media/upcoming-events",
    imageSrc: cardImage(9),
  },
  {
    title: "ODOP Directory",
    titleHi: "ओडीओपी निर्देशिका",
    labelHi: "ओडीओपी निर्देशिका",
    link: "/suppliers",
    imageSrc: cardImage(10),
  },
  {
    title: "ODOP on Social Media",
    titleHi: "सोशल मीडिया पर ओडीओपी",
    labelHi: "सोशल मीडिया पर ओडीओपी",
    link: "#social-media",
    imageSrc: cardImage(11),
  },
  {
    title: "Contact Us",
    titleHi: "संपर्क करें",
    labelHi: "संपर्क करें",
    link: "#contact-us",
    imageSrc: cardImage(12),
  },
];

const CARD_BASE =
  "group relative block overflow-hidden rounded-2xl border border-black/10 bg-slate-100 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.2)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(15,23,42,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600] focus-visible:ring-offset-2";

function GlossyButton({
  title,
  titleHi,
  label,
  labelHi,
  badge,
  isHi,
}: {
  title: string;
  titleHi?: string;
  label?: React.ReactNode;
  labelHi?: React.ReactNode;
  badge?: string;
  isHi: boolean;
}) {
  const displayContent = isHi
    ? (labelHi ?? titleHi ?? label ?? title)
    : (label ?? title);

  return (
    <div className="absolute inset-x-[4px] top-1/2 z-10 -translate-y-1/2">
      <div
        className="relative flex h-[40px] w-full items-center justify-center rounded-[10px] px-3 shadow-[0_6px_18px_rgba(0,0,0,0.55)] md:h-[50px]"
        style={{
          background: "linear-gradient(90deg, #932C27 0%, #FD6500 100%)",
          border: "1.5px solid rgba(255,255,255,0.65)",
        }}
      >
        <div
          className="button-highlight"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            clipPath: "polygon(20% 0%, 16% 2%, 13% 4%, 10% 7%, 7% 11%, 4% 17%, 2% 25%, 1% 34%, 0.3% 41%, 0% 47%, 0% 18%, 0.2% 14%, 0.5% 11%, 1.2% 8%, 2.5% 5%, 4% 3%, 6% 1.2%, 8% 0.3%, 10% 0%)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 80%, rgba(255,255,255,0) 100%)",
          }}
        />
        {badge && (
          <Image
            src={badge}
            alt=""
            width={20}
            height={20}
            className="pointer-events-none absolute left-1/2 top-0 z-20 h-[20px] w-[20px] -translate-x-1/2 -translate-y-[70%] rounded-full object-cover shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          />
        )}
        <span
          className={`relative z-10 text-center font-bold leading-tight text-white${badge ? " mt-0" : ""}`}
          style={{
            fontFamily: "'Poppins', 'Montserrat', sans-serif",
            fontSize: "clamp(0.75rem, 1.4vw, 0.90rem)",
            fontWeight: "600",
            letterSpacing: "0.01em",
          }}
        >
          {displayContent}
        </span>
      </div>
    </div>
  );
}

function CardInner({ item, priority, isHi }: { item: FeatureItem; priority?: boolean; isHi: boolean }) {
  return (
    <>
      <Image
        src={item.imageSrc}
        alt={isHi ? (item.titleHi ?? item.title) : item.title}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        preload={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16.6vw"
        quality={80}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL.light}
        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <GlossyButton
        title={item.title}
        titleHi={item.titleHi}
        label={item.label}
        labelHi={item.labelHi}
        badge={item.badge}
        isHi={isHi}
      />
    </>
  );
}

function FeatureCard({ item, priority, isHi }: { item: FeatureItem; priority?: boolean; isHi: boolean }) {
  const ariaLabel = isHi ? (item.titleHi ?? item.title) : item.title;

  if (item.isExternal) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ariaLabel} (opens in a new tab)`}
        className={CARD_BASE}
      >
        <CardInner item={item} priority={priority} isHi={isHi} />
      </a>
    );
  }

  return (
    <FeatureGridLink href={item.link} aria-label={ariaLabel} className={CARD_BASE}>
      <CardInner item={item} priority={priority} isHi={isHi} />
    </FeatureGridLink>
  );
}

export default async function FeatureGrid() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <section className="section section-surface-white bg-white md:py-24 py-12 " aria-label="ODOP services">

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-[14px]">
          {FEATURE_ITEMS.map((item, index) => (
            <FeatureCard key={item.title} item={item} priority={index < 6} isHi={isHi} />
          ))}
        </div>
      </div>
    </section>
  );
}
