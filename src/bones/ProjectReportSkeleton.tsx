"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function ProjectReportSkeleton() {
  return (
    <BoneyardSkeleton
      name="project-reports"
      loading={true}
      fallback={
        <div className="kb-pr-grid" role="list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="kb-pr-card skeleton-card">
              <div className="skeleton-line district"></div>
              <div className="skeleton-line title"></div>
              <div className="skeleton-line desc"></div>
              <div className="skeleton-media"></div>
            </div>
          ))}
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
