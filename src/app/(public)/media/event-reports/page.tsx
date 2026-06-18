import type { Metadata } from "next";
import "@/styles/cfc-list.css";
import { Suspense } from "react";
import EventReportsClient from "./EventReportsClient";
import EventReportsSkeleton from "@/bones/EventReportsSkeleton";

export const metadata: Metadata = {
  title: "Event Reports | ODOP - One District One Product",
  description:
    "Event Reports provide a concise summary of events under ODOP. View and download official event report PDFs.",
};

export default function EventReportsPage() {
  return (
    <Suspense fallback={<EventReportsSkeleton />}>
      <EventReportsClient />
    </Suspense>
  );
}
