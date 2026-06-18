"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function DistrictCardSkeleton() {
  return (
    <div className="district-card" aria-hidden="true">
      <div className="district-card-link">
        <div className="district-card-hero">
          <div className="district-card-img">
            <div className="skeleton-media" style={{ height: "100%", marginTop: 0, borderRadius: 0 }} />
          </div>
          <div className="district-card-thumb">
            <div
              className="skeleton-media"
              style={{ width: "100%", height: "100%", marginTop: 0, borderRadius: "50%" }}
            />
          </div>
        </div>

        <div className="district-card-body">
          <div className="skeleton-line title" style={{ width: "55%", height: "20px", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            <div className="skeleton-line desc" style={{ width: "70px", height: "14px", marginBottom: 0 }} />
            <div className="skeleton-line desc" style={{ width: "90px", height: "14px", marginBottom: 0 }} />
            <div className="skeleton-line desc" style={{ width: "60px", height: "14px", marginBottom: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DistrictsListSkeleton() {
  return (
    <BoneyardSkeleton
      name="districts-list"
      loading={true}
      fallback={
        <section className="section" aria-busy="true" aria-label="Loading districts">
          <div className="container">
            <div className="district-products-capsule-heading-wrap">
              <div
                className="skeleton-line"
                style={{ width: "min(420px, 80%)", height: "40px", margin: "0 auto", borderRadius: "8px" }}
              />
            </div>

            <div className="district-list-search">
              <div className="district-search-wrap" style={{ pointerEvents: "none" }}>
                <div
                  className="skeleton-line"
                  style={{ flex: 1, height: "20px", margin: "0 12px 0 48px", borderRadius: "999px" }}
                />
                <div
                  className="skeleton-line"
                  style={{ width: "44px", height: "44px", borderRadius: "50%", marginBottom: 0, flexShrink: 0 }}
                />
              </div>
              <div
                className="skeleton-line"
                style={{ width: "220px", height: "14px", margin: "14px auto 0", borderRadius: "4px" }}
              />
            </div>

            <div className="districts-grid">
              {Array.from({ length: 12 }, (_, i) => (
                <DistrictCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
