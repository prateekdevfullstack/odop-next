import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Tenders | Resources | ODOP",
 description: "Tenders under ODOP — official invitations for bids from vendors for goods or services.",
};

export default function TendersPage() {
 return (<main className="main-content schemes-page">
 {/* ===== PAGE HERO ===== */}
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">Tenders</h1>
 <p className="page-hero-subtitle">
 Tenders are official invitations issued by organizations or governments to invite bids from vendors for
 supplying goods or services under specified terms and conditions.
 </p>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Tender Programme</span>
 <h2>Latest Tenders</h2>
 <div className="divider"><span /><span /><span /></div>
 </div>
 <section className="static-content-wrap mb-30">
 <article className="static-card">
 <h3>Tender Notice</h3>
 <p>Currently no latest Tenders is available, to view Archived Tenders please click on the Archive button.</p>
 <p><a className="cfc-link-btn" href="/resources/tenders/archive">Archive</a></p>
 </article>
 </section>
 </div>
 </main>);
}
