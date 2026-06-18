import type { Metadata } from "next";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import CapsuleHeading from "@/components/shared/CapsuleHeading";
import CharkhaSection from "@/components/about/CharkhaSection";
import Breadcrumb from "@/components/shared/Breadcrumb";
import T from "@/components/shared/T";

export const metadata: Metadata = {
  title: "About ODOP | One District One Product",
  description:
    "About ODOP – Learn about the One District One Product initiative, its objectives, impact, and district-wise product mapping.",
};

export default function AboutIntroductionPage() {
  return (<main className="main-content schemes-page about-static-page policy-page">
    {/* ===== PAGE HERO BANNER ===== */}
    <section style={{ position: "relative", width: "100%", height: "250px", lineHeight: 0, overflow: "hidden" }}>
      <Image src="/assets/img/banner/Mask_group_img.png" alt="" aria-hidden={true} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} width={1920} height={480} />
      <Image src="/assets/img/banner/metal-craft.png" alt="" aria-hidden={true} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "auto", maxWidth: "48%", height: "100%", objectFit: "contain", objectPosition: "bottom right", zIndex: 2 }} width={800} height={600} />
      <div style={{ position: "absolute", left: "clamp(16px, 5vw, 80px)", bottom: 40, zIndex: 3, lineHeight: "normal" }}>
        <h1 className="media-heading"><T en="About" hi="परिचय" /></h1>
        <Breadcrumb en="About ODOP" hi="ओडीओपी के बारे में" />
      </div>
    </section>

    {/* ===== WHAT IS ODOP SECTION ===== */}
    <section className="about-section">
      <div className="container">
        <div className="about-overview-grid about-overview-grid--full">
          <div className="about-overview-content">
            <h1 className="resource-heading-common"><T en="About ODOP Programme" hi="ओडीओपी कार्यक्रम के बारे में" /></h1>
            <p style={{ textAlign: "center", fontWeight: 500 }}>
              <T
                en={<>The <strong>One District One Product (ODOP)</strong> Programme is a flagship initiative of the Government of
                  Uttar Pradesh aimed at promoting and developing the unique traditional products and industries of each district.
                  The programme focuses on preserving heritage crafts, generating employment, empowering artisans and entrepreneurs,
                  and strengthening market access through financial assistance, skill development, branding, infrastructure, and export promotion.</>}
                hi={<>उत्तर प्रदेश सरकार की प्रमुख पहल <strong>एक जनपद एक उत्पाद (ओडीओपी)</strong> कार्यक्रम का उद्देश्य प्रत्येक जनपद के
                  अनूठे पारंपरिक उत्पादों और उद्योगों को बढ़ावा देना और विकसित करना है। यह कार्यक्रम पारंपरिक शिल्प के संरक्षण,
                  रोजगार सृजन, शिल्पकारों एवं उद्यमियों के सशक्तिकरण, तथा वित्तीय सहायता, कौशल विकास, ब्रांडिंग, अवसंरचना और
                  निर्यात प्रोत्साहन के माध्यम से बाजार पहुंच को मजबूत करने पर केंद्रित है।</>}
              />
            </p>
          </div>
        </div>
      </div>
    </section>

 {/* ===== CHARKHA WHEEL SECTION ===== */}
 <section className="about-section" style={{ paddingTop: 0, paddingBottom: 32 }}>
 <div className="container">
 <CharkhaSection />
 </div>
 </section>

 </main>);
}
