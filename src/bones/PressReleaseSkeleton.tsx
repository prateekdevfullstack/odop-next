"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function PressReleaseSkeleton() {
  return (
    <BoneyardSkeleton
      name="press-release-page"
      loading={true}
      fallback={
        <>
          <section className="page-hero gallery-hero mt-0 mt-sm-0">
            <div className="page-hero-overlay" />
          </section>

          <main className="main-content gallery-page">
            <section className="section gallery-content-section">
              <div className="container gallery-container">
                <div className="section-header gallery-page-intro">
                  <div className="skeleton-line" style={{ width: "260px", height: "32px", margin: "0 auto 12px" }} />
                  <div className="divider">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="masonry-header mt-md-60 mt-30 mb-md-40 mb-20" style={{ justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["All", "National", "International", "Regional"].map((_, i) => (
                      <div key={i} className="skeleton-line" style={{ width: "90px", height: "34px", borderRadius: "20px" }} />
                    ))}
                  </div>
                </div>

                <section className="masonry-container">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="pin-card">
                      <div
                        className="media-container skeleton-line"
                        style={{ width: "100%", height: "240px", borderRadius: "8px" }}
                      />
                    </div>
                  ))}
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
