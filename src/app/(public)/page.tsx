import HeroSlider from "@/components/ui/HeroSlider";
import ScrollRevealInitializer from "@/components/home/ScrollRevealInitializer";
import type { PublicDistrict } from "@/lib/api/districts.types";
import {
  fetchGIProductCards,
  fetchPublicSuccessStories,
  fetchSchemesList,
  getPublicDistrictCards,
} from "@/services";
import { Scheme } from "@/lib/schemes";
import type { PublicSuccessStory } from "@/lib/success-stories";
import { getLanguageServer } from "@/lib/language";
import type { GIProductCardData } from "@/services/gi-products.service";
import OdopBrandCarousel from "@/components/home/OdopBrandCarousel";
import FeatureGrid from "@/components/home/FeatureGrid";
import LeadershipDesk from "@/components/home/LeadershipDesk";
import OdopSchemesSection from "@/components/home/OdopSchemesSection";
import MsmeSchemesSection from "@/components/home/MsmeSchemesSection";
import DistrictProductsSection from "@/components/home/DistrictProductsSection";
import GIProductsSection from "@/components/home/GIProductsSection";
import KnowledgeHubSection from "@/components/home/KnowledgeHubSection";
import SuccessStoriesSection from "@/components/home/SuccessStoriesSection";
import ContactUsSection from "@/components/home/ContactUsSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";

export const dynamic = "force-dynamic";

async function getDistricts(): Promise<PublicDistrict[]> {
  try {
    const { items } = await getPublicDistrictCards({
      page: 1,
      limit: 100,
      sort_by: "district_name",
      sort_order: "asc",
    });

    return items;
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
}

async function getSchemes(): Promise<Scheme[]> {
  try {
    const response = await fetchSchemesList();
    if (Array.isArray(response?.data)) {
      return response.data.filter(s => s.schemeType === 'ODOP').slice(0, 4);
    }
    return [];
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
}

async function getMsmeSchemes(): Promise<Scheme[]> {
  try {
    const response = await fetchSchemesList();
    if (Array.isArray(response?.data)) {
      const schemesData = Object.groupBy(response.data, (scheme) => scheme.schemeType);
      return (schemesData.OTHER || []).slice(0, 4);
    }
    return [];
  } catch (error) {
    console.error("Error fetching MSME schemes:", error);
    return [];
  }
}

async function getSuccessStories(): Promise<PublicSuccessStory[]> {
  try {
    return await fetchPublicSuccessStories(undefined, 8);
  } catch (error) {
    console.error("Error fetching public success stories:", error);
    return [];
  }
}

async function getGIProducts(isHi: boolean): Promise<GIProductCardData[]> {
  try {
    return await fetchGIProductCards(isHi, 4);
  } catch (error) {
    console.error("Error fetching GI products:", error);
    return [];
  }
}

export default async function Home() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  const [districtData, schemesData, msmeSchemesData, successStories, giProducts] =
    await Promise.all([
      getDistricts(),
      getSchemes(),
      getMsmeSchemes(),
      getSuccessStories(),
      getGIProducts(isHi),
    ]);

  return (
    <main>
      <ScrollRevealInitializer />

      <HeroSlider />
      <FeatureGrid />

      <LeadershipDesk />

      <OdopBrandCarousel />

      <OdopSchemesSection schemes={schemesData} />

      <MsmeSchemesSection schemes={msmeSchemesData} />

      <DistrictProductsSection districts={districtData} />

      <GIProductsSection products={giProducts} />

      <KnowledgeHubSection />

      <ContactUsSection />

      <SuccessStoriesSection stories={successStories} />

      <SocialMediaSection />

    </main>);
}




