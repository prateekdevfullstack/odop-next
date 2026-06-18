import PageBanner from "@/components/shared/PageBanner"

function SchemeCardSkeleton() {
  return (
    <div className="ms-card ms-card--skeleton" aria-hidden="true">
      <div className="ms-card-hero msk-hero" />

      <div className="ms-card-body">
        <div className="msk-line msk-name" />

        <div className="msk-desc">
          <div className="msk-line msk-line--full" />
          <div className="msk-line msk-line--three-quarters" />
        </div>

        <div className="ms-focus">
          <div className="msk-line msk-focus-heading" />
          <ul className="ms-focus-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="msk-focus-item">
                <div className="msk-dot" />
                <div className="msk-line msk-line--variable" style={{ width: `${60 + (i % 3) * 15}%` }} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ms-card-footer">
        <div className="msk-btn" />
      </div>
    </div>
  )
}

export default function MsmeSchemesSkeleton() {
  return (
    <>
      <PageBanner
        imageSrc="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New2.png"
        eyebrow="Schemes & Policies"
        current="MSME Schemes"
        className="mt-0 mt-sm-0"
      />

      <main className="main-content schemes-page msme-schemes-page">
        <div className="container">
          <div className="resource-capsule-heading-wrap">
            <h1 className="resource-heading-common">MSME Schemes & Policies</h1>
          </div>

          <div className="ms-grid" style={{ paddingBottom: '40px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SchemeCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <style>{`
          .msme-schemes-page > .container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: clamp(24px, 4vw, 48px);
          }

          .msme-schemes-page .ms-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: clamp(14px, 2vw, 24px);
            width: 100%;
          }

          .msme-schemes-page .ms-card {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
            overflow: hidden;
            min-height: 100%;
          }

          .msme-schemes-page .ms-card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 34px 16px 20px;
          }

          .msme-schemes-page .ms-focus {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .msme-schemes-page .ms-focus-list {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .msme-schemes-page .ms-card-footer {
            padding: 0 16px 16px;
            margin-top: auto;
          }

          @keyframes msk-shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }

          .msk-hero,
          .msk-line,
          .msk-dot,
          .msk-btn {
            background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
            background-size: 800px 100%;
            animation: msk-shimmer 1.4s infinite linear;
            border-radius: 6px;
          }

          .msk-hero {
            aspect-ratio: 393 / 120;
            width: 100%;
            border-radius: 0;
          }

          .msk-name {
            height: 16px;
            width: 75%;
          }

          .msk-desc {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .msk-line {
            height: 11px;
          }

          .msk-line--full        { width: 100%; }
          .msk-line--three-quarters { width: 72%; }

          .msk-focus-heading {
            height: 11px;
            width: 45%;
          }

          .msk-focus-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .msk-dot {
            flex-shrink: 0;
            width: 14px;
            height: 14px;
            border-radius: 50%;
          }

          .msk-btn {
            height: clamp(38px, 4vw, 42px);
            width: 100%;
            border-radius: 10px;
          }

          @media (max-width: 1200px) {
            .msme-schemes-page .ms-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: clamp(14px, 2vw, 20px);
            }
          }

          @media (max-width: 640px) {
            .msme-schemes-page .ms-grid {
              grid-template-columns: 1fr;
              gap: 14px;
            }
          }
        `}</style>
      </main>
    </>
  )
}
