import type { Metadata } from "next";
import { Suspense } from "react";

import VideoGallerySkeleton from "@/bones/VideoGallerySkeleton";
import VideoGalleryPageClient from "./VideoGalleryPageClient";

export const metadata: Metadata = {
 title: "Video Gallery | Events & Media | ODOP",
 description:
 "ODOP Video Gallery — watch Success Stories and CFC videos from One District One Product initiatives across districts.",
};

export default function VideoGalleryPage() {
 return (
  <Suspense fallback={<VideoGallerySkeleton />}>
   <VideoGalleryPageClient />
  </Suspense>
 );
}
