"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SupplierSubNav from "@/components/shared/SupplierSubNav";
import { AppToaster } from "@/components/ui/AppToaster";
import "@/styles/spacing.css";
import "@/styles/responsive.css";
import "./supplier-dashboard.css";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role_name?.toLowerCase() === "supplier") {
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        router.push("/");
      }
    } else {
      router.push("/login/supplier");
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
            <>
              <SupplierSubNav />
              <div className="container pt-4 lg:pt-8 pb-16">{children}</div>
            </>
          ) : null}
        </main>
        <Footer />
      </div>
      <AppToaster />
      <ChatWidget />
    </LanguageProvider>
  );
}
