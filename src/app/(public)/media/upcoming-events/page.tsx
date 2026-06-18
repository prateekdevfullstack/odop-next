import type { Metadata } from "next";
import UpcomingEventsClient from "./UpcomingEventsClient";
import { Suspense } from "react";
import UpcomingEventsSkeleton from "@/bones/UpcomingEventsSkeleton";

export const metadata: Metadata = {
 title: "Upcoming Events | ODOP Portal",
 description:
 "Explore upcoming ODOP fairs, buyer-seller meets, workshops and district outreach events across districts.",
};

export default function UpcomingEventsPage() {
 return (
  <Suspense fallback={<UpcomingEventsSkeleton />}>
   <UpcomingEventsClient />
  </Suspense>
 );
}
