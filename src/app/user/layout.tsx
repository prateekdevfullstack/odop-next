"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AppToaster } from "@/components/ui/AppToaster";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { isPortalUser, isUserLoggedIn } from "@/services/auth.service";
import "@/styles/spacing.css";
import "@/styles/responsive.css";
import "./user-dashboard.css";
import ChatWidget from "@/components/ChatWidget";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/");
      setIsLoading(false);
      return;
    }

    if (isPortalUser()) {
      setIsAuthorized(true);
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  return (
    <LanguageProvider initialLang="en">
      <div className="min-w-0 overflow-x-clip flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {isLoading ? (
            <div className="container min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Verifying access...</p>
              </div>
            </div>
          ) : isAuthorized ? (
            <div className="container pt-4 lg:pt-8 pb-16">{children}</div>
          ) : null}
        </main>
        <Footer />
      </div>
      <AppToaster />
      <ChatWidget />
    </LanguageProvider>
  );
}
