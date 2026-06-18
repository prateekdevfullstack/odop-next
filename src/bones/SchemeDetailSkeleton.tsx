"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function SchemeDetailSkeleton() {
  return (
    <BoneyardSkeleton
      name="scheme-detail"
      loading={true}
      fallback={
        <div className="about-static-page policy-page scheme-detail-page">
          <section className="page-hero scheme-detail-hero">
            <div className="page-hero-overlay" />
            <div className="container page-hero-content" style={{ display: "flex", justifyContent: "center" }}>
              <div className="skeleton-line" style={{ width: "140px", height: "44px", borderRadius: "6px" }} />
            </div>
          </section>

          <main className="main-content schemes-page about-static-page policy-page">
            <div className="container">
              <div className="section-header">
                <div className="skeleton-line" style={{ width: "80px", height: "14px", marginBottom: "12px" }} />
                <div className="skeleton-line" style={{ width: "50%", height: "32px", marginBottom: "12px" }} />
                <div className="skeleton-line" style={{ width: "70%", height: "16px", marginBottom: "8px" }} />
                <div className="skeleton-line" style={{ width: "55%", height: "16px", marginBottom: "24px" }} />
              </div>

              <section className="static-content-wrap">
                <div className="event-detail-about-shell mb-10">
                  <div className="event-detail-sidebar">
                    <div
                      className="event-detail-about-media scheme-about-media-panel"
                      style={{ height: "100%", minHeight: "unset" }}
                    >
                      <div className="skeleton-media" style={{ height: "260px", borderRadius: "8px" }} />
                    </div>
                  </div>
                  <article className="static-card mb-0">
                    <div className="skeleton-line" style={{ width: "40%", height: "24px", marginBottom: "16px" }} />
                    <div className="skeleton-line" style={{ width: "100%", height: "14px", marginBottom: "8px" }} />
                    <div className="skeleton-line" style={{ width: "98%", height: "14px", marginBottom: "8px" }} />
                    <div className="skeleton-line" style={{ width: "92%", height: "14px", marginBottom: "8px" }} />
                    <div className="skeleton-line" style={{ width: "85%", height: "14px", marginBottom: "8px" }} />
                    <div className="skeleton-line" style={{ width: "70%", height: "14px" }} />
                  </article>
                </div>

                <article className="static-card mb-0">
                  <div className="skeleton-line" style={{ width: "35%", height: "24px", marginBottom: "20px" }} />
                  <div className="scheme-highlight-grid">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="skeleton-media"
                        style={{ height: "120px", borderRadius: "8px" }}
                      />
                    ))}
                  </div>
                </article>

                <article className="static-card">
                  <div className="skeleton-line" style={{ width: "40%", height: "24px", marginBottom: "16px" }} />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                      <div className="skeleton-line" style={{ width: "18px", height: "18px", flexShrink: 0, borderRadius: "50%" }} />
                      <div className="skeleton-line" style={{ flex: 1, height: "14px" }} />
                    </div>
                  ))}
                </article>

                <article className="static-card scheme-cta-card">
                  <div className="scheme-cta-copy">
                    <div className="skeleton-line" style={{ width: "80px", height: "12px", marginBottom: "10px" }} />
                    <div className="skeleton-line" style={{ width: "55%", height: "28px", marginBottom: "10px" }} />
                    <div className="skeleton-line" style={{ width: "70%", height: "14px" }} />
                  </div>
                  <div className="scheme-cta-actions" style={{ display: "flex", gap: "12px" }}>
                    <div className="skeleton-line" style={{ width: "130px", height: "44px", borderRadius: "6px" }} />
                    <div className="skeleton-line" style={{ width: "160px", height: "44px", borderRadius: "6px" }} />
                  </div>
                </article>
              </section>
            </div>
          </main>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
