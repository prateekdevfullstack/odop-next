"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function StoryCardSkeleton() {
  return (
    <div style={{ border: "1px solid #e8edf2", borderRadius: "12px", overflow: "hidden" }}>
      <div className="skeleton-line" style={{ width: "100%", height: "180px" }} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton-line" style={{ width: "50%", height: "14px" }} />
        <div className="skeleton-line" style={{ width: "80%", height: "18px" }} />
        <div className="skeleton-line" style={{ width: "95%", height: "13px" }} />
        <div className="skeleton-line" style={{ width: "75%", height: "13px" }} />
      </div>
    </div>
  );
}

export default function SuccessStorySkeleton() {
  return (
    <BoneyardSkeleton
      name="success-story-page"
      loading={true}
      fallback={
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {Array.from({ length: 4 }, (_, i) => (
              <StoryCardSkeleton key={i} />
            ))}
          </div>
          <div className="skeleton-line" style={{ width: "200px", height: "24px", marginBottom: "16px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 6 }, (_, i) => (
              <StoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
