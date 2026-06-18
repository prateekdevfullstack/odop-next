"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function SupplierCardSkeleton() {
  return (
    <div style={{ border: "1px solid #e8edf2", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div className="skeleton-line" style={{ width: "60px", height: "60px", borderRadius: "8px", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="skeleton-line" style={{ width: "70%", height: "18px" }} />
          <div className="skeleton-line" style={{ width: "50%", height: "14px" }} />
        </div>
      </div>
      <div className="skeleton-line" style={{ width: "100%", height: "12px" }} />
      <div className="skeleton-line" style={{ width: "80%", height: "12px" }} />
      <div style={{ display: "flex", gap: "8px" }}>
        <div className="skeleton-line" style={{ width: "80px", height: "28px", borderRadius: "20px" }} />
        <div className="skeleton-line" style={{ width: "80px", height: "28px", borderRadius: "20px" }} />
      </div>
    </div>
  );
}

export default function SuppliersSkeleton() {
  return (
    <BoneyardSkeleton
      name="suppliers-list"
      loading={true}
      fallback={
        <div className="container" style={{ paddingTop: "32px", paddingBottom: "48px" }}>
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Filter sidebar */}
            <div style={{ width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="skeleton-line" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="skeleton-line" style={{ width: "100%", height: "36px", borderRadius: "6px" }} />
                  ))}
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", alignContent: "start" }}>
              {Array.from({ length: 6 }, (_, i) => (
                <SupplierCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
