"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AppToaster } from "@/components/ui/AppToaster";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import CfcPortalSidebar from "@/components/cfc/CfcPortalSidebar";
import { cfcLoginPath } from "@/lib/cfc/routes";
import { getCfcUser, isCfcUserLoggedIn } from "@/lib/cfc/session";
import { cfcLogout } from "@/services/cfc-auth.service";
import "@/styles/spacing.css";
import "@/styles/responsive.css";
import "../cfc-portal.css";

export default function CfcPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cfcName, setCfcName] = useState("");
  const [districtName, setDistrictName] = useState("");

  useEffect(() => {
    if (!isCfcUserLoggedIn()) {
      router.replace(cfcLoginPath());
      setIsLoading(false);
      return;
    }
    const user = getCfcUser();
    if (!user) {
      router.replace(cfcLoginPath());
      setIsLoading(false);
      return;
    }
    setCfcName(user.cfc_name ?? "");
    setDistrictName(user.district_name ?? "");
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    cfcLogout();
    router.replace(cfcLoginPath());
  };

  return (
    <LanguageProvider initialLang="en">
      <div className="min-w-0 overflow-x-clip flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {isLoading ? (
            <div className="container min-h-[400px] flex items-center justify-center">
              <div className="cfc-portal-loading">Verifying CFC access…</div>
            </div>
          ) : isAuthorized ? (
            <div className="container pt-4 lg:pt-8 pb-16">
              <div className="cfc-portal-shell">
                <CfcPortalSidebar
                  cfcName={cfcName}
                  districtName={districtName}
                  onLogout={handleLogout}
                />
                <div className="cfc-portal-main">{children}</div>
              </div>
            </div>
          ) : null}
        </main>
        <Footer />
      </div>
      <AppToaster />
    </LanguageProvider>
  );
}
