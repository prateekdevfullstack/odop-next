import type { Metadata } from "next";
import Image from "next/image";
import OdopCellSection from "@/components/about/OdopCellSection";
import { ODOP_CONTACT } from "@/lib/odop-contact";
import Breadcrumb from "@/components/shared/Breadcrumb";
import T from "@/components/shared/T";

export const metadata: Metadata = {
  title: "ODOP Cell | About ODOP",
  description:
    "ODOP Cell — dedicated institutional cell for ODOP implementation, coordination, and promotion in Uttar Pradesh.",
};

export default function OdopCellPage() {
  return (
    <main className="main-content schemes-page about-static-page policy-page">
      {/* ===== PAGE HERO BANNER ===== */}
      <section style={{ position: "relative", width: "100%", height: "250px", lineHeight: 0, overflow: "hidden" }}>
        <Image src="/assets/img/banner/Mask_group_img.png" alt="" aria-hidden={true} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} width={1920} height={480} />
        <Image src="/assets/img/banner/metal-craft.png" alt="" aria-hidden={true} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "auto", maxWidth: "48%", height: "100%", objectFit: "contain", objectPosition: "bottom right", zIndex: 2 }} width={800} height={600} />
        <div style={{ position: "absolute", left: "clamp(16px, 5vw, 80px)", bottom: 40, zIndex: 3, lineHeight: "normal" }}>
          <h1 className="media-heading"><T en="About" hi="परिचय" /></h1>
          <Breadcrumb en="ODOP Cell" hi="ओडीओपी सेल" />
        </div>
      </section>

      {/* ===== WHAT IS ODOP CELL SECTION ===== */}
      <section className="about-section">
        <div className="container">
          <div className="about-overview-grid about-overview-grid--full">
            <div className="about-overview-content">
              <h1 className="resource-heading-common"><T en="ODOP Cell" hi="ओडीओपी सेल" /></h1>
              <p style={{ textAlign: "center", fontWeight: 500 }}>
                <T
                  en={<>The <strong>ODOP Cell</strong> functions as the dedicated
                    implementation and coordination unit for the ODOP Programme in
                    Uttar Pradesh. It works towards policy support, branding,
                    promotion, stakeholder coordination, market development, and
                    execution of various ODOP initiatives to strengthen district
                    products and artisan ecosystems across the state.</>}
                  hi={<><strong>ओडीओपी प्रकोष्ठ</strong> उत्तर प्रदेश में ओडीओपी कार्यक्रम के लिए समर्पित
                    क्रियान्वयन एवं समन्वय इकाई के रूप में कार्य करता है। यह राज्य भर में जनपदीय उत्पादों
                    और शिल्पकार पारिस्थितिकी तंत्र को सुदृढ़ करने हेतु नीतिगत सहयोग, ब्रांडिंग, प्रचार-प्रसार,
                    हितधारक समन्वय, बाजार विकास तथा विभिन्न ओडीओपी पहलों के क्रियान्वयन की दिशा में कार्य करता है।</>}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY FUNCTIONS WHEEL SECTION ===== */}
      <section className="about-section" style={{ paddingTop: 0, paddingBottom: 32 }}>
        <div className="container">
          <OdopCellSection />
        </div>
      </section>

      {/* ===== CONTACT INFORMATION ===== */}
      

      {/* ===== PDF DOWNLOAD SECTION ===== */}
      <section className="about-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            flexWrap: "wrap",
            paddingTop: "16px",
          }}>
            <a
              className="cfc-link-btn"
              href="/assets/document/pdf-attachment/639171395811652465.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 22px",
                borderRadius: "10px",
                background: "#fff5e9",
                border: "1px solid rgba(179, 84, 0, 0.12)",
                color: "#363b42",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 0 30px rgba(15, 23, 42, 0.06)",
                transition: "opacity 0.2s ease",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-file-pdf" aria-hidden="true" />
              <T en="View / Download PDF" hi="पीडीएफ देखें / डाउनलोड करें" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
