"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export function MasonrySkeleton({ count }: { count: number }) {
  return (
    <section className="masonry-container">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="pin-card">
          <div
            className="media-container skeleton-line"
            style={{ width: "100%", height: "220px", borderRadius: "8px" }}
          />
        </div>
      ))}
    </section>
  );
}

export function EventCardsSkeleton() {
  return (
    <div className="events-wrapper">
      <div className="cards-container">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="event-card">
            <div className="skeleton-line" style={{ width: "58px", height: "58px", borderRadius: "50%", margin: 0 }} />
            <div className="skeleton-line" style={{ width: "70%", height: "20px", marginTop: "16px" }} />
          </div>
        ))}
      </div>

      <div className="month-tabs">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="skeleton-line" style={{ width: "70px", height: "48px", borderRadius: "999px", margin: 0 }} />
        ))}
      </div>
    </div>
  );
}

export default function PhotoGallerySkeleton() {
  return (
    <BoneyardSkeleton
      name="photo-gallery-page"
      loading={true}
      fallback={
        <div className="gallery-page">
          <section className="odop-intrinsic-banner">
            <div className="skeleton-line" style={{ width: "100%", height: "260px", margin: 0, borderRadius: 0 }} />
            <div className="odop-intrinsic-banner-overlay" />
            <div className="odop-intrinsic-banner-content">
              <div className="skeleton-line" style={{ width: "180px", height: "32px" }} />
              <div className="skeleton-line" style={{ width: "220px", height: "16px", marginBottom: 0 }} />
            </div>
          </section>

          <main className="main-content">
            <section className="section gallery-content-section">
              <div className="container gallery-container">
                <div className="resource-heading-box gallery-page-heading">
                  <div className="skeleton-line" style={{ width: "260px", height: "32px", margin: 0 }} />
                </div>

                <EventCardsSkeleton />

                {/* Workshops block */}
                <div className="skeleton-line" style={{ width: "200px", height: "24px" }} />
                <MasonrySkeleton count={7} />
              </div>
            </section>
          </main>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
