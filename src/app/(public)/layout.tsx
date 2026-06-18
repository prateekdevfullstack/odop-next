import "@/styles/spacing.css";
import "@/styles/responsive.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AppToaster } from "@/components/ui/AppToaster";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { getLanguageServer } from "@/lib/language";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguageServer();

  return (
    <>
      <LanguageProvider initialLang={lang}>
        <div className="min-w-0 overflow-x-clip">
          <Navbar />
          {children}
          <Footer />
        </div>
        <AppToaster />
        <ChatWidget />
      </LanguageProvider>
    </>
  );
}
