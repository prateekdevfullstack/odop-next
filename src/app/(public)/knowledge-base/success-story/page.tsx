import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchSuccessStories } from "@/services";
import { fetchSuccessStoriyList } from "@/services/success-story.service";
import { SuccessStoryVideoList, SuccessStory } from "./SuccessStoryVideoList";
import { decrypt128, API_CONFIG } from "@/lib/api";
import { SuccessStoryList } from "./SuccessStoryList";
import SuccessStorySkeleton from "@/bones/SuccessStorySkeleton";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";

export interface SuccessStoryFromForm {
  id: number;
  title: string;
  title_hindi: string;
  district: string;
  district_hindi: string;
  video_url: string;
  thumbnail: string;
  hindi_thumbnail: string;
  discription: string;
  Hindi_discription: string;
  status: string;
  created_by: number;
  updated_by: number;
  deleted_by: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
  status: number;
}

export interface City {
  id: number;
  districtName: string;
  state_id: number;
  status: number;
}

export interface SuccessStoryListApi {
  id: number;
  name: string;
  name_hindi: string | null;
  businessName: string;
  business_name_hindi: string | null;
  state_id: number;
  city_id: number;
  shortDescription: string;
  short_description_hindi: string | null;
  fullStory: string;
  full_story_hindi: string | null;
  profileImage: string;
  status: number;
  isFeatured: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  state: State;
  city: City;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "सफलता की कहानी | ज्ञान आधार | ओडीओपी पोर्टल",
      description: "जिलों के ओडीओपी कारीगरों और उद्यमियों की प्रेरक सफलता की कहानियां।",
    };
  }
  return {
    title: "Success Story | Knowledge Base | ODOP Portal",
    description: "Inspiring success stories of ODOP artisans and entrepreneurs from across districts.",
  };
}

async function getSuccessStories(): Promise<any> {
  try {
    const response = await fetchSuccessStories();
    let decryptedData: any = await decrypt128((response.data as any).body);
    let data = decryptedData?.data?.data || decryptedData?.data || decryptedData;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const arrayVal = Object.values(data).find(val => Array.isArray(val));
      if (arrayVal) data = arrayVal;
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return [];
  }
}

async function getSuccessStoriyList() {
  try {
    const response: any = await fetchSuccessStoriyList();
    const data = response?.data?.data || [];
    return data;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return [];
  }
}

async function SuccessStoryContent() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  const [storiesFromApi, storiesListApi] = await Promise.all([
    getSuccessStories(),
    getSuccessStoriyList(),
  ]);


  const getYouTubeId = (url: string | undefined | null): string => {
    if (!url || url === "null") return "";
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : url;
  };

  const cleanContent = (text: string | null | undefined): string => {
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

  const stories: SuccessStory[] = (storiesFromApi || []).map((item: SuccessStoryFromForm) => {
    const title = isHi ? (item.title_hindi || item.title) : item.title;
    const description = isHi ? (item.Hindi_discription || item.discription) : item.discription;
    const district = isHi ? (item.district_hindi || item.district) : item.district;
    const thumbnailField = isHi ? (item.hindi_thumbnail || item.thumbnail) : item.thumbnail;
    const thumbnail = thumbnailField ? `${API_CONFIG.IMAGE_BASE_URL}${thumbnailField}` : "/assets/img/placeholder.jpg";
    return {
      id: item.id,
      title: cleanContent(title) || (isHi ? "सफल उद्यमी" : "Successful Entrepreneur"),
      description: cleanContent(description) || (isHi ? "सफलता की कहानी" : "Success Story"),
      district: cleanContent(district) || "",
      thumbnail,
      video_id: getYouTubeId(item.video_url),
      video_url: item.video_url || "",
    };
  });

  const storieslist: any = (storiesListApi || []).map((item: SuccessStoryListApi) => {
    const name = isHi ? (item.name_hindi || item.name) : item.name;
    const businessName = isHi ? (item.business_name_hindi || item.businessName) : item.businessName;
    const shortDescription = isHi ? (item.short_description_hindi || item.shortDescription) : item.shortDescription;
    const fullStory = isHi ? (item.full_story_hindi || item.fullStory) : item.fullStory;
    const profileImage = item.profileImage ? `${API_CONFIG.NEW_BASE_URL}${item.profileImage}` : "/assets/img/placeholder.jpg";
    return {
      id: item.id,
      name: cleanContent(name) || (isHi ? "सफल उद्यमी" : "Successful Entrepreneur"),
      businessName: cleanContent(businessName) || "",
      shortDescription: cleanContent(shortDescription) || (isHi ? "सफलता की कहानी" : "Success Story"),
      fullStory: cleanContent(fullStory) || "",
      profileImage,
      state: item.state,
      city: item.city,
    };
  });

  return (
    <>
      <SuccessStoryList storieslist={storieslist} />
      <SuccessStoryVideoList stories={stories} />
    </>
  );
}

export default async function SuccessStoryPage() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <main className="main-content schemes-page kb-ss-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "सफलता की कहानियां" : "Success Stories"}
      />

      <div className="container">
        <div className="kb-capsule-heading-wrap">
          <h1 className="resource-heading-common">
            {isHi ? "सफलता की कहानियां" : "Success Stories"}
          </h1>
        </div>
        <Suspense fallback={<SuccessStorySkeleton />}>
          <SuccessStoryContent />
        </Suspense>
      </div>
    </main>
  );
}
