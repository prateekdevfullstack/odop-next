"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function DocumentarySkeleton() {
  return (
    <BoneyardSkeleton
      name="documentaries"
      loading={true}
      fallback={
        <div className="kb-ss-grid" role="list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="kb-doc-card">
              <div className="kb-doc-card__surface" style={{ height: "250px", position: "relative", backgroundColor: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
                <div className="skeleton-media" style={{ margin: 0, height: "100%", width: "100%", borderRadius: 0 }}></div>
                <div className="kb-doc-card__body" style={{ bottom: "15px", left: "15px", right: "15px", position: "absolute", zIndex: 3 }}>
                  <div className="skeleton-line" style={{ width: "60%", height: "18px", marginBottom: 0 }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
