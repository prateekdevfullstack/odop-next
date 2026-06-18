"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function EventReportsSkeleton() {
  return (
    <BoneyardSkeleton
      name="event-reports-page"
      loading={true}
      fallback={
        <>
          <section className="page-hero cfc-hero relative">
            <div className="page-hero-overlay" />
            <div className="container page-hero-content relative z-10">
              <h1 className="page-hero-title">Event Reports</h1>
              <p className="page-hero-subtitle">
                Event Reports provide a concise summary of an event.
              </p>
            </div>
          </section>

          <main className="cfc-page section">
            <div className="container">
              <section className="cfc-section">
                <h2>Event Reports</h2>
                <div className="cfc-table-scroll">
                  <table className="cfc-table cfc-master-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Subjects</th>
                        <th>Status / Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          <td>
                            <div className="skeleton-line" style={{ width: "20px", height: "14px" }} />
                          </td>
                          <td>
                            <div className="skeleton-line" style={{ width: "200px", height: "16px", marginBottom: "6px" }} />
                            <div className="skeleton-line" style={{ width: "150px", height: "12px" }} />
                          </td>
                          <td>
                            <div className="skeleton-line" style={{ width: "90px", height: "24px", borderRadius: "4px" }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        </>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
