import type { Metadata } from "next";
import { Suspense } from "react";

import EventDetailSkeleton from "@/bones/EventDetailSkeleton";
import EventDetailClient from "./EventDetailClient";

export const metadata: Metadata = {
 title: " ODOP Exhibition 2026 | Event Details",
 description:
 "Review official details for the ODOP Exhibition 2026, compare stall categories and request participation through the ODOP Portal.",
};

export default function EventDetailPage() {
 return (
  <Suspense fallback={<EventDetailSkeleton />}>
   <EventDetailClient />
  </Suspense>
 );
}
