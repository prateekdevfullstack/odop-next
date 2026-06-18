"use client";

import { useLanguage } from "@/hooks/useLanguage";

type TProps = {
  en: React.ReactNode;
  hi: React.ReactNode;
};

/** Renders the Hindi node when the active locale is `hi`, otherwise English. */
export default function T({ en, hi }: TProps) {
  return <>{useLanguage() === "hi" ? hi : en}</>;
}
