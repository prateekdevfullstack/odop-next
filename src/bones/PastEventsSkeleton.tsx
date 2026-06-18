"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function PastEventsSkeleton() {
  return (
    <BoneyardSkeleton
      name="past-events-page"
      loading={true}
      fallback={
        <>
          <section className="page-hero events-hero past-events-hero mt-0 mt-sm-0">
            <div className="page-hero-overlay" />
            <div className="container page-hero-content">
              <h1 className="page-hero-title">Past ODOP Events Archive</h1>
              <p className="page-hero-subtitle">
                Browse completed fairs, showcases, district campaigns and buyer outreach programs with concise summaries of
                participation, impact and follow-up outcomes.
              </p>
            </div>
          </section>

          <main className="main-content event-page past-event-page">
            <section className="section event-main-section">
              <div className="container">
                <div className="section-header centered-header">
                  <span className="section-eyebrow past-events-eyebrow">Past Events</span>
                  <h2 className="section-title">Showcasing Uttar Pradesh to the World</h2>
                  <p className="section-subtitle">
                    The ODOP Programme actively participates in national and international fairs, exhibitions,
                    buyer-seller meets, and trade expos to promote Uttar Pradesh's iconic district products, connect
                    artisans and enterprises with new markets, and enhance global visibility for traditional industries.
                  </p>
                  <div className="past-events-tags-row">
                    <span className="section-eyebrow past-events-eyebrow">National Trade Fairs</span>
                    <span className="section-eyebrow past-events-eyebrow">International Expos</span>
                    <span className="section-eyebrow past-events-eyebrow">ODOP Pavilions</span>
                    <span className="section-eyebrow past-events-eyebrow">Buyer-Seller Meets</span>
                    <span className="section-eyebrow past-events-eyebrow">Cultural & Craft Exhibitions</span>
                    <span className="section-eyebrow past-events-eyebrow">GI & Handloom Showcases</span>
                  </div>
                </div>
                <div className="divider">
                  <span />
                  <span />
                  <span />
                </div>

                <section className="eventlab-popular-area">
                  <div className="eventlab-card-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <article key={i} className="eventlab-card">
                        <div className="eventlab-card-thumb" style={{ backgroundColor: "#f0f0f0", height: "200px" }} />
                        <div className="eventlab-card-content">
                          <div className="eventlab-card-info" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <div className="skeleton-line" style={{ width: "80px", height: "14px" }} />
                            <div className="skeleton-line" style={{ width: "80px", height: "14px" }} />
                          </div>
                          <div className="skeleton-line" style={{ width: "60%", height: "20px", marginBottom: "10px" }} />
                          <div className="skeleton-line" style={{ width: "90%", height: "14px", marginBottom: "6px" }} />
                          <div className="skeleton-line" style={{ width: "80%", height: "14px", marginBottom: "15px" }} />
                          <div className="eventlab-card-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div className="skeleton-line" style={{ width: "100px", height: "16px" }} />
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div className="skeleton-line" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
                              <div className="skeleton-line" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </main>
        </>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
