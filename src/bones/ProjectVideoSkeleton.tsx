"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function ProjectVideoSkeleton() {
  return (
    <BoneyardSkeleton
      name="project-videos"
      loading={true}
      fallback={
        <div className="kb-pv-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="kb-pv-card" style={{ height: "250px", position: "relative", backgroundColor: "#f0f0f0", borderRadius: "12px", border: "none", overflow: "hidden", display: "block" }}>
              <div className="skeleton-media" style={{ margin: 0, height: "100%", width: "100%", borderRadius: 0 }}></div>
              <div className="kb-pv-card__inner" style={{ position: "absolute", bottom: "15px", left: "15px", right: "15px", zIndex: 3, display: "flex", flexDirection: "column" }}>
                <div className="skeleton-line" style={{ width: "30%", height: "12px", marginBottom: "8px" }}></div>
                <div className="skeleton-line" style={{ width: "70%", height: "16px", marginBottom: "8px" }}></div>
                <div className="skeleton-line" style={{ width: "40%", height: "12px", marginBottom: 0 }}></div>
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
