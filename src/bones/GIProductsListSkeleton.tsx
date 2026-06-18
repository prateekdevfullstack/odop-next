"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function GIProductCardSkeleton() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "335px",
        background: "#ffffff",
        border: "0.5px solid #e2e8f0",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(18, 29, 48, 0.06)",
      }}
    >
      {/* Banner image */}
      <div
        className="skeleton-line"
        style={{ width: "100%", height: "clamp(140px, 20vw, 164px)", borderRadius: "22px 22px 0 0" }}
      />
      {/* Circular thumb overlapping the banner */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(clamp(140px, 20vw, 164px) - 55px)",
          transform: "translateX(-50%)",
          width: "clamp(88px, 12vw, 109px)",
          height: "clamp(88px, 12vw, 109px)",
          borderRadius: "50%",
          border: "4px solid #ffffff",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(18, 29, 48, 0.12)",
          zIndex: 3,
        }}
      >
        <div className="skeleton-line" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
      </div>
      {/* Card body: title + subtitle */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "67px 20px 20px",
        }}
      >
        <div className="skeleton-line" style={{ width: "72%", height: "18px", borderRadius: "6px" }} />
        <div className="skeleton-line" style={{ width: "48%", height: "13px", borderRadius: "6px" }} />
      </div>
    </div>
  );
}

export default function GIProductsListSkeleton() {
  return (
    <BoneyardSkeleton
      name="gi-products-list"
      loading={true}
      fallback={
        <section className="section">
          <div className="container">
            {/* Page heading */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "0 0 28px",
              }}
            >
              <div
                className="skeleton-line"
                style={{ width: "min(620px, 90%)", height: "clamp(36px, 5vw, 56px)", borderRadius: "12px" }}
              />
            </div>

            {/* Search bar + meta text */}
            <div style={{ maxWidth: "640px", margin: "0 auto 36px" }}>
              <div
                className="skeleton-line"
                style={{ width: "100%", height: "56px", borderRadius: "999px" }}
              />
              <div
                className="skeleton-line"
                style={{ width: "220px", height: "14px", borderRadius: "6px", margin: "14px auto 0" }}
              />
            </div>

            {/* Cards grid */}
            <div className="gi-products-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <GIProductCardSkeleton key={i} />
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
