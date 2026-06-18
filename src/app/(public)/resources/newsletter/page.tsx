import type { Metadata } from "next";
export const metadata: Metadata = {
 title: "Newsletter | Resources | ODOP",
 description:
 "ODOP newsletters — official publications and updates from the One District One Product programme.",
};
export default function NewsletterPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">Newsletter</h1>
 <p className="page-hero-subtitle">
 Official newsletters and publications from the One District One
 Product programme.
 </p>
 </div>
 </section>
 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Publications</span>
 <h2>ODOP Newsletter</h2>
 <div className="divider">
 <span />
 <span />
 <span />
 </div>
 </div>
 <section className="static-content-wrap mb-30">
 <article className="static-card">
 <p>
 ODOP newsletters are currently not available on the portal.
 </p>
 </article>
 </section>
 </div>
 </main>);
}
