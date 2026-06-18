import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "MOU Report | Partnerships | ODOP",
 description: "Comprehensive reports on the outcomes of MOUs signed under the ODOP initiative.",
};

export default function MouReportPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">MOU Report</h1>
 <p className="page-hero-subtitle">
 Tracking the progress and impact of strategic partnerships.
 </p>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Reports</span>
 <h2>Partnership Impact</h2>
 <div className="divider"><span /><span /><span /></div>
 </div>
 <section className="static-content-wrap">
 <article className="static-card">
 <h3>Implementation Status</h3>
 <p>
 These reports detail the tangible outcomes achieved through our collaborative efforts with public and private sector partners, ensuring transparency and accountability in the ODOP ecosystem.
 </p>
 <p>
 Reports will be uploaded and updated periodically.
 </p>
 </article>
 </section>
 </div>
 </main>);
}
