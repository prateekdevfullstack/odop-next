import { notFound } from "next/navigation";
import { getPublicDistrictDetailView, fetchDistrictSchemes } from "@/services/districts.service";
import DistrictDetailClient from "./DistrictDetailClient";
import { Suspense } from "react";
import DistrictDetailSkeleton from "@/bones/DistrictDetailSkeleton";
import { getLanguageServer } from "@/lib/language";

export const dynamic = "force-dynamic";

interface DistrictDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getDistrictDetail(slug: string) {
  try {
    return await getPublicDistrictDetailView(slug, {
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Error fetching district detail for ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: DistrictDetailPageProps) {
  const { slug } = await params;
  const [data, lang] = await Promise.all([getDistrictDetail(slug), getLanguageServer()]);
  const isHi = lang === "hi";

  if (!data) {
    return {
      title: isHi ? "जिला नहीं मिला | ODOP पोर्टल" : "District Not Found | ODOP Portal",
    };
  }

  const description = isHi
    ? (data.district.hindi_description || data.district.description)
    : data.district.description;

  const plainDescription = description
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const name = isHi ? (data.district.hindi_name || data.district.name) : data.district.name;
  const title = isHi ? (data.district.hindi_title || data.district.title) : data.district.title;

  return {
    title: `${name} - ${title} | ODOP Portal`,
    description: plainDescription?.substring(0, 160),
  };
}

async function DistrictDetailContent({ slug }: { slug: string }) {
  const [data, lang] = await Promise.all([getDistrictDetail(slug), getLanguageServer()]);

  if (!data) {
    notFound();
  }

  const schemes = await fetchDistrictSchemes(data.district.id, { cache: "no-store" });

  return <DistrictDetailClient data={data} schemes={schemes} isHi={lang === "hi"} />;
}

export default async function DistrictDetailPage({ params }: DistrictDetailPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<DistrictDetailSkeleton />}>
        <DistrictDetailContent slug={slug} />
      </Suspense>
    </main>
  );
}
