"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

function ProductTabSkeleton() {
  return (
    <div
      className="skeleton-line"
      style={{
        minWidth: "130px",
        height: "45px",
        marginBottom: 0,
        borderRadius: "30px",
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}

function ProductPillSkeleton() {
  return (
    <div className="cus-pill" style={{ pointerEvents: "none" }} aria-hidden="true">
      <span className="cus-pill__icon">
        <span className="skeleton-media" style={{ width: 34, height: 34, marginTop: 0, borderRadius: "50%" }} />
      </span>
      <span className="skeleton-line" style={{ width: "80%", height: "10px", marginBottom: 0 }} />
    </div>
  );
}

function ProductCardSkeleton({ layout }: { layout: "left" | "right" }) {
  return (
    <article
      className={`district-product-card layout-${layout}`}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <div className="district-product-image-section">
        <div className="product-image-wrapper">
          <div className="skeleton-media" style={{ width: "100%", height: "100%", marginTop: 0, borderRadius: "12px" }} />
        </div>
      </div>

      <div className="district-product-content-section">
        <div className="skeleton-line title" style={{ width: "45%", height: "28px", marginBottom: "16px" }} />
        <div className="skeleton-line desc" style={{ width: "100%", height: "14px", marginBottom: "8px" }} />
        <div className="skeleton-line desc" style={{ width: "95%", height: "14px", marginBottom: "8px" }} />
        <div className="skeleton-line desc" style={{ width: "88%", height: "14px", marginBottom: "20px" }} />

        <div className="cus-actions">
          <ProductPillSkeleton />
          <ProductPillSkeleton />
          <ProductPillSkeleton />
        </div>
      </div>
    </article>
  );
}

function ResourceRowSkeleton() {
  return (
    <li aria-hidden="true">
      <div className="district-portal-success-row" style={{ pointerEvents: "none" }}>
        <span className="skeleton-media district-portal-success-row-thumb" style={{ width: 52, height: 52, marginTop: 0, borderRadius: "50%" }} />
        <span className="district-portal-success-row-main" style={{ flex: 1 }}>
          <span className="skeleton-line" style={{ width: "40%", height: "14px", marginBottom: "6px" }} />
          <span className="skeleton-line desc" style={{ width: "60%", height: "12px", marginBottom: 0 }} />
        </span>
        <span className="skeleton-line" style={{ width: "72px", height: "12px", marginBottom: 0, flexShrink: 0 }} />
      </div>
    </li>
  );
}

function ResourceBlockSkeleton() {
  return (
    <div className="district-portal-resource-block" aria-hidden="true">
      <header className="district-portal-resource-head">
        <div className="skeleton-line title" style={{ width: "220px", height: "24px", marginBottom: "8px" }} />
        <div className="skeleton-line desc" style={{ width: "320px", height: "14px", marginBottom: 0 }} />
      </header>
      <ul className="district-portal-compact-list district-portal-success-list">
        <ResourceRowSkeleton />
        <ResourceRowSkeleton />
      </ul>
    </div>
  );
}

export default function DistrictDetailSkeleton() {
  return (
    <BoneyardSkeleton
      name="district-detail"
      loading={true}
      fallback={
        <main className="district-portal-page" aria-busy="true" aria-label="Loading district details">
          <section className="district-hero-banner">
            <div className="district-hero-banner-slider">
              <div
                className="skeleton-media"
                style={{ width: "100%", height: "min(52vh, 520px)", minHeight: "280px", marginTop: 0, borderRadius: 0 }}
              />
              <div className="district-hero-banner-title">
                <div className="skeleton-line" style={{ width: "min(360px, 70vw)", height: "48px", margin: "0 auto", borderRadius: "8px" }} />
              </div>
            </div>
          </section>

          <section className="district-portal-district-intro-section">
            <div className="district-portal-tab-list" role="presentation">
              <ProductTabSkeleton />
              <ProductTabSkeleton />
              <ProductTabSkeleton />
            </div>
            <div className="container district-portal-district-intro-inner">
              <div className="skeleton-line desc" style={{ width: "100%", height: "16px", marginBottom: "8px" }} />
              <div className="skeleton-line desc" style={{ width: "92%", height: "16px", marginBottom: "8px", marginLeft: "auto", marginRight: "auto" }} />
              <div className="skeleton-line desc" style={{ width: "78%", height: "16px", marginBottom: 0, marginLeft: "auto", marginRight: "auto" }} />
            </div>
          </section>

          <section className="section district-portal-products">
            <div className="container">
              <div className="district-portal-product-stack district-portal-products-full">
                <ProductCardSkeleton layout="left" />
                <ProductCardSkeleton layout="right" />
              </div>
            </div>
          </section>

          <section className="section district-portal-resources">
            <div className="container">
              <div className="district-portal-resources-panel">
                <ResourceBlockSkeleton />
                <div className="district-portal-resource-block" aria-hidden="true">
                  <header className="district-portal-resource-head">
                    <div className="skeleton-line title" style={{ width: "180px", height: "24px", marginBottom: "8px" }} />
                    <div className="skeleton-line desc" style={{ width: "260px", height: "14px", marginBottom: 0 }} />
                  </header>
                  <div className="district-portal-table-wrap">
                    <div style={{ padding: "16px" }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-line desc" style={{ width: "100%", height: "14px", marginBottom: i < 3 ? "10px" : 0 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
