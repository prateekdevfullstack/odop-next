"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function EventDetailSkeleton() {
  return (
    <BoneyardSkeleton
      name="event-detail-page"
      loading={true}
      fallback={
        <div className="event-detail-page">
          <section className="page-hero events-hero event-detail-hero">
            <div className="container page-hero-content">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" }}>
                <div className="skeleton-line" style={{ width: "180px", height: "22px", borderRadius: "20px" }} />
                <div className="skeleton-line" style={{ width: "340px", height: "40px" }} />
                <div className="skeleton-line" style={{ width: "100%", height: "16px" }} />
                <div className="skeleton-line" style={{ width: "85%", height: "16px" }} />
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-line" style={{ width: "140px", height: "14px" }} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "40px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-line" style={{ height: "100px", borderRadius: "8px" }} />
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="skeleton-line" style={{ width: "220px", height: "28px" }} />
                <div className="skeleton-line" style={{ width: "100%", height: "320px", borderRadius: "8px" }} />
              </div>
            </div>
          </section>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
