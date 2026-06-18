import type { Metadata } from "next";
import { Suspense } from "react";

import PressReleaseSkeleton from "@/bones/PressReleaseSkeleton";
import PressReleaseClient from "./PressReleaseClient";

export const metadata: Metadata = {
  title: "ODOP in News | Press Release | Media",
  description:
    "ODOP in the news — browse press coverage, media highlights and official press releases from One District One Product initiatives across Uttar Pradesh.",
};

export default function PressReleasePage() {
  return (
    <Suspense fallback={<PressReleaseSkeleton />}>
      <PressReleaseClient />
    </Suspense>
  );
}
