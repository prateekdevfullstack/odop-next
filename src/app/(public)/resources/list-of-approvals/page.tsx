import type { Metadata } from "next";
export const metadata: Metadata = {
 title: "List of Approvals | Resources | ODOP",
 description:
 "List of approvals granted under the ODOP programme.",
};
export default function ListOfApprovalsPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">List of Approvals</h1>
 <p className="page-hero-subtitle">
 Official list of approvals granted under the One District One
 Product programme.
 </p>
 </div>
 </section>
 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Official Records</span>
 <h2>ODOP Approvals</h2>
 <div className="divider">
 <span />
 <span />
 <span />
 </div>
 </div>
 <section className="static-content-wrap mb-30">
 <article className="static-card">
 <p>
 The approvals directory under the ODOP programme is currently not available on the portal.
 </p>
 </article>
 </section>
 </div>
 </main>);
}
