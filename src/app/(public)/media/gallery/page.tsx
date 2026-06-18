import type { Metadata } from "next";
import { Suspense } from "react";

import PhotoGallerySkeleton from "@/bones/PhotoGallerySkeleton";
import { getLanguageServer } from "@/lib/language";
import GalleryPageClient from "./GalleryPageClient";

export async function generateMetadata(): Promise<Metadata> {
 const lang = await getLanguageServer();

 if (lang === "hi") {
  return {
   title: "फोटो गैलरी | कार्यक्रम एवं मीडिया | ओडीओपी",
   description:
    "ओडीओपी फोटो गैलरी - कार्यशालाओं, कार्यक्रमों और वन डिस्ट्रिक्ट वन प्रोडक्ट पहल की तस्वीरें देखें।",
  };
 }

 return {
  title: "Gallery | Events & Media | ODOP",
  description:
   "ODOP Gallery - workshops, conclaves, press coverage and artisan success stories from One District One Product initiatives across districts.",
 };
}

export default function GalleryPage() {
 return (
  <Suspense fallback={<PhotoGallerySkeleton />}>
   <GalleryPageClient />
  </Suspense>
 );
}
