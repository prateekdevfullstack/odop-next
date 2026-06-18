"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function UserProfileSkeleton() {
  return (
    <BoneyardSkeleton
      name="user-profile"
      loading={true}
      fallback={
        <div className="panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div
              className="skeleton-line"
              style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton-line" style={{ width: 160, height: 18 }} />
              <div className="skeleton-line" style={{ width: 200, height: 14 }} />
            </div>
          </div>

          <dl className="grievance-info-grid">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="skeleton-line" style={{ width: 80, height: 12, marginBottom: 8 }} />
                <div className="skeleton-line" style={{ width: 140, height: 16 }} />
              </div>
            ))}
          </dl>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
