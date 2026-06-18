"use client";

import { useLanguage } from "@/hooks/useLanguage";

type BreadcrumbProps = {
  en: string;
  hi: string;
};

export default function Breadcrumb({ en, hi }: BreadcrumbProps) {
  const isHi = useLanguage() === "hi";
  return (
    <div className="breadcrumb">
      <span className="text-white">{isHi ? "होम" : "Home"}</span>
      <span className="separator">&gt;</span>
      <span className="active">{isHi ? hi : en}</span>
    </div>
  );
}
