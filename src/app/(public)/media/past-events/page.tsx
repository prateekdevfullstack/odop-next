import type { Metadata } from "next";
import PastEventsClient from "./PastEventsClient";
import { Suspense } from "react";
import PastEventsSkeleton from "@/bones/PastEventsSkeleton";

export const metadata: Metadata = {
 title: "Past Events | ODOP Portal",
 description:
 "Browse past ODOP fairs, exhibitions and district outreach events with highlights, outcomes and archive summaries.",
};

export default function PastEventsPage() {
 return (
  <Suspense fallback={<PastEventsSkeleton />}>
   <PastEventsClient />
  </Suspense>
 );
}
