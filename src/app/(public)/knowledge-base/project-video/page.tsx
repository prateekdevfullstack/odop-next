import type { Metadata } from "next";
import { fetchProjectVideos } from "@/services";
import { ProjectVideoList, ProjectVideo } from "./ProjectVideoList";
import { decrypt128 } from "@/lib/api";
import { Suspense } from "react";
import ProjectVideoSkeleton from "@/bones/ProjectVideoSkeleton";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";

export interface SubCategory {
  id: number;
  prv_id: number | null;
  category_id: number;
  course_id: number;
  personality_id: number | null;
  name: string;
  hindi_name: string;
  title: string;
  hindi_title: string;
  short_description: string;
  hindi_short_description: string | null;
  thumbnail: string;
  hindi_thumbnail: string;
  slug: string;
  description: string;
  hindi_description: string;
  total_duration: string;
  mandatory_percentage: number;
  url: string;
  assessment_questions: number;
  type: string | null;
  price: number | null;
  associate_amount: number | null;
  status: number;
  created_by: number;
  updated_by: number;
  deleted_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectVideos {
  id: number;
  prv_id: number | null;
  category_id: number;
  sub_category_id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  thumbnail: string;
  hindi_thumbnail: string;
  short_description: string;
  hindi_short_description: string | null;
  description: string;
  hindi_description: string;
  type: string | null;
  price: number | null;
  associate_amount: number | null;
  status: string;
  created_by: number;
  updated_by: number;
  deleted_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  sub_category: SubCategory;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "उत्पाद वीडियो | ज्ञान आधार | ओडीओपी पोर्टल",
      description: "ओडीओपी उत्पाद वीडियो — जिला स्तरीय दस्तावेज़ीकरण और कार्यक्रम की मुख्य विशेषताएं।",
    };
  }
  return {
    title: "Product Video | Knowledge Base | ODOP Portal",
    description: "ODOP product videos — district-level documentations and programme highlights.",
  };
}

function getYouTubeId(url: string | undefined | null): string {
  if (!url || url === "null") return "";
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url;
}

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

async function getProjectVideos(isHi: boolean): Promise<ProjectVideo[]> {
  try {
    const response = await fetchProjectVideos();

    let data: any;
    if ((response.data as any)?.body && typeof (response.data as any).body === "string") {
      const decryptedData = await decrypt128((response.data as any).body);
      data = typeof decryptedData === "string" ? JSON.parse(decryptedData) : decryptedData;
    } else {
      data = response.data;
    }

    const items = data?.data?.product || data?.data || data || [];
    if (!Array.isArray(items)) return [];

    return items.map((item: ProjectVideos) => {
      const title = isHi 
        ? (item.sub_category?.hindi_title || item.sub_category?.title || item.hindi_name || item.name)
        : (item.sub_category?.title || item.name);
      const district = isHi ? (item.hindi_name || item.name) : item.name;
      const city_name = isHi
        ? (item.sub_category?.hindi_name || item.sub_category?.name || item.hindi_name || item.name)
        : (item.sub_category?.name || item.name);
      const description = isHi
        ? (item.hindi_description || item.description || item.hindi_short_description || item.short_description || item.sub_category?.hindi_description || item.sub_category?.description)
        : (item.description || item.short_description || item.sub_category?.description);
      const thumbnailField = isHi
        ? (item.hindi_thumbnail || item.thumbnail || item.sub_category?.hindi_thumbnail || item.sub_category?.thumbnail)
        : (item.thumbnail || item.sub_category?.thumbnail);

      return {
        id: item.id || Math.random().toString(),
        title: cleanText(title) || (isHi ? "उत्पाद वीडियो" : "Product Video"),
        district: cleanText(district) || "",
        city_name: cleanText(city_name) || "",
        description: description || (isHi ? "विवरण उपलब्ध नहीं है।" : "Description not available."),
        thumbnail: thumbnailField || "",
        video_url: getYouTubeId(item.sub_category?.url || item.type),
        slug: item.slug,
        sub_category_slug: item.sub_category?.slug
      };
    });
  } catch (error) {
    console.error("Error fetching Product videos:", error);
    return [];
  }
}

async function ProjectVideoContent() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";
  const videos = await getProjectVideos(isHi);

  const displayVideos = videos.length > 0 ? videos : [
    {
      id: "agra-shoe",
      title: isHi ? "चमड़े के जूते" : "Leather Shoe",
      district: isHi ? "आगरा" : "Agra",
      city_name: isHi ? "आगरा" : "Agra",
      description: isHi ? "भारत चीन के बाद चमड़े के जूते का दूसरा सबसे बड़ा निर्माता है..." : "India is the second largest manufacturer of leather shoes after China...",
      thumbnail: "/assets/img/knowledge-base/product-video/agra.png",
      video_url: "x4yQU1nxa_Q",
      slug: "leather-shoe",
      sub_category_slug: "leather-shoe"
    },
    {
      id: "mainpuri-tarkashi",
      title: isHi ? "तारकशी" : "Tarkashi",
      district: isHi ? "मैनपुरी" : "Mainpuri",
      city_name: isHi ? "मैनपुरी" : "Mainpuri",
      description: isHi ? "तारकशी के कारीगरों ने अपने चांदी के तार की जड़ाई के जादू को फैलाया है..." : "The artisans of Taarkashi have stretched the magic of their silver wire inlay...",
      thumbnail: "/assets/img/knowledge-base/product-video/mainpuri.png",
      video_url: "x4yQU1nxa_Q",
      slug: "tarkashi",
      sub_category_slug: "tarkashi"
    },
    {
      id: "firozabad-bangels",
      title: isHi ? "कांच की चूड़ियाँ" : "Bangels",
      district: isHi ? "फ़िरोज़ाबाद" : "Firozabad",
      city_name: isHi ? "फ़िरोज़ाबाद" : "Firozabad",
      description: isHi ? "कांच कला और शिल्प की अभिव्यक्ति के लिए एक अनूठी सामग्री है..." : "Glass is a unique material for the expression of art and craft...",
      thumbnail: "/assets/img/knowledge-base/product-video/firozabad.png",
      video_url: "x4yQU1nxa_Q",
      slug: "bangels",
      sub_category_slug: "bangels"
    },
    {
      id: "lucknow-chikan",
      title: isHi ? "चिकनकारी और जरी जरदोजी" : "Chikankari & Zari Zardozi",
      district: isHi ? "लखनऊ" : "Lucknow",
      city_name: isHi ? "लखनऊ" : "Lucknow",
      description: isHi ? "लखनऊ दुनिया भर में अपनी चिकनकारी और जरी-जरदोजी के काम के लिए प्रसिद्ध है..." : "Lucknow is well known for its Chikankari and zari-zardozi work across the world...",
      thumbnail: "/assets/img/knowledge-base/product-video/lucknow.jpg",
      video_url: "x4yQU1nxa_Q",
      slug: "chikankari-zari-zardozi",
      sub_category_slug: "chikankari-zari-zardozi"
    },
    {
      id: "azamgarh-pottery",
      title: isHi ? "काली मिट्टी के बर्तन" : "Black Pottery",
      district: isHi ? "आजमगढ़" : "Azamgarh",
      city_name: isHi ? "आजमगढ़" : "Azamgarh",
      description: isHi ? "आजमगढ़ के काली मिट्टी के बर्तन एक लंबी मिट्टी और भट्टी परंपरा को दर्शाते हैं..." : "Black clay pottery from Azamgarh reflects a long soil-and-kiln tradition...",
      thumbnail: "/assets/img/knowledge-base/product-video/azamgarh.png",
      video_url: "x4yQU1nxa_Q",
      slug: "black-pottery",
      sub_category_slug: "black-pottery"
    },
    {
      id: "chitrakoot-toy",
      title: isHi ? "लकड़ी के खिलौने" : "Wooden Toy",
      district: isHi ? "चित्रकूट" : "Chitrakoot",
      city_name: isHi ? "चित्रकूट" : "Chitrakoot",
      description: isHi ? "चित्रकूट लकड़ी के हस्तशिल्प, विशेष रूप से खिलौनों के लिए जाना जाता है..." : "Chitrakoot is known for wooden handicraft, toys in particular...",
      thumbnail: "/assets/img/knowledge-base/product-video/chitrakoot.png",
      video_url: "x4yQU1nxa_Q",
      slug: "wooden-toy",
      sub_category_slug: "wooden-toy"
    }
  ];

  return (
    <BoneyardSkeleton name="project-videos" loading={false}>
      <ProjectVideoList videos={displayVideos} />
    </BoneyardSkeleton>
  );
}

export default async function ProjectVideoPage() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <main className="main-content schemes-page kb-pv-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "उत्पाद वीडियो" : "Project Video"}
      />

      <div className="container">
        <div className="kb-capsule-heading-wrap">
          <h1 className="resource-heading-common">
            {isHi ? "उत्पाद वीडियो" : "Product Video"}
          </h1>
        </div>

        <Suspense fallback={<ProjectVideoSkeleton />}>
          <ProjectVideoContent />
        </Suspense>
      </div>
    </main>
  );
}
