import type { Metadata } from "next";
import { Suspense } from "react";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";
import ContactTabs from "./ContactTabs";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "संपर्क करें | ओडीओपी - एक जिला एक उत्पाद",
      description:
        "ओडीओपी से संपर्क करें - एक जिला एक उत्पाद पोर्टल, आपूर्तिकर्ता पंजीकरण, सरकारी योजनाओं और अन्य विषयों पर पूछताछ के लिए।",
    };
  }
  return {
    title: "Contact Us | ODOP - One District One Product",
    description:
      "Contact ODOP - Reach out for queries about the One District One Product portal, supplier registration, government schemes, and more.",
  };
}

export default async function ContactUsPage() {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <div className="contact-us-page">
      <PageBanner
        imageSrc="/assets/img/banner/contact_us.png"
        eyebrow={isHi ? "संपर्क करें" : "Contact Us"}
        current={isHi ? "संपर्क करें" : "Contact Us"}
      />

      <Suspense fallback={null}>
        <ContactTabs isHi={isHi} />
      </Suspense>
    </div>
  );
}
