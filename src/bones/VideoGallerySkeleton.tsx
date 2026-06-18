"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function VideoCardSkeleton() {
  return (
    <div
      style={{
        minWidth: "280px",
        width: "280px",
        borderRadius: "12px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        className="skeleton-line"
        style={{ width: "100%", height: "360px", borderRadius: "12px" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div className="skeleton-line" style={{ width: "70%", height: "16px", borderRadius: "4px", background: "rgba(255,255,255,0.3)" }} />
        <div className="skeleton-line" style={{ width: "90%", height: "12px", borderRadius: "4px", background: "rgba(255,255,255,0.3)" }} />
        <div className="skeleton-line" style={{ width: "50%", height: "12px", borderRadius: "4px", background: "rgba(255,255,255,0.3)" }} />
      </div>
    </div>
  );
}

export default function VideoGallerySkeleton() {
  return (
    <BoneyardSkeleton
      name="video-gallery-page"
      loading={true}
      fallback={
        <>
          <section className="page-hero gallery-hero mt-0 mt-sm-0">
            <div className="page-hero-overlay" />
          </section>

          <main className="main-content gallery-page">
            <section className="section gallery-content-section">
              <div className="section-header gallery-page-intro">
                <div className="skeleton-line" style={{ width: "280px", height: "32px", margin: "0 auto 12px" }} />
                <div className="divider">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="container gallery-container">
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    overflow: "hidden",
                    paddingBottom: "8px",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <VideoCardSkeleton key={i} />
                  ))}
                </div>
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
