"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function UpcomingEventsSkeleton() {
  return (
    <BoneyardSkeleton
      name="upcoming-events-page"
      loading={true}
      fallback={
        <>
          <section className="page-hero events-hero upcoming-events-hero">
            <div className="page-hero-overlay" />
            <div className="container page-hero-content">
              <h1 className="page-hero-title">ODOP Event Notices and Exhibition Highlights</h1>
              <p className="page-hero-subtitle">
                Review official ODOP event posters, exhibition notices and programme visuals related to 
                districts, product showcases and public outreach activities.
              </p>
            </div>
          </section>

          <div className="upcoming-events-container">
            <header className="upcoming-events-header">
              <span className="upcoming-events-pill">Official Updates</span>
              <h1 className="upcoming-events-title">Upcoming Events</h1>
              <p className="upcoming-events-subtitle">
                Track policy announcements, district milestones, trade participation, and export-led progress across the ODOP programme.
              </p>
              <div className="upcoming-events-decorator">
                <span className="upcoming-events-line short" />
                <span className="upcoming-events-line long" />
                <span className="upcoming-events-line short" />
              </div>
            </header>

            <div className="upcoming-events-grid">
              <aside className="upcoming-events-sidebar">
                <span className="sidebar-category-tag">Browse By Category</span>
                <h2 className="sidebar-title">Filter Updates</h2>
                <p className="sidebar-desc">
                  Choose a category to focus on domestic activity, national exposure, or international ODOP highlights.
                </p>

                <nav className="sidebar-categories-list">
                  <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                  <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                  <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                  <div className="skeleton-line" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
                </nav>
              </aside>

              <main className="upcoming-events-content">
                <div className="upcoming-events-scroll-container">
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                  <article className="event-list-card">
                    <div className="event-card-header">
                      <div className="skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "6px" }} />
                      <div className="skeleton-line" style={{ width: "120px", height: "16px" }} />
                    </div>
                    <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
                  </article>
                </div>
              </main>
            </div>
          </div>
        </>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
