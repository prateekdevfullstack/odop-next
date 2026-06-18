import type { Metadata } from "next";
import Image from "next/image";
import { mouRecords } from "@/lib/mou-data";
import "@/styles/mous-list.css";

export const metadata: Metadata = {
 title: "MOUs and GOs | Partnerships | ODOP",
 description: "Official list of ODOP memorandums of understanding with signed dates and downloadable attachments.",
};

export default function MousListPage() {
 return (<div className="mous-list-page">
 <section className="page-hero mous-hero relative">
 <div className="page-hero-overlay"></div>
 <div className="container page-hero-content relative z-10">
 <h1 className="page-hero-title">MOUs and GOs</h1>
 <p className="page-hero-subtitle">
 Official ODOP MOU documents with signed dates and downloadable attachments.
 </p>
 </div>
 </section>

 <section className="about-section">
 <div className="container">
 <div className="about-overview-grid">
 <div className="about-overview-visual">
 <div className="about-image-stack">
 <Image
 src="/assets/img/up.png"
 alt="ODOP Partnerships"
 className="about-main-image !object-contain !bg-white !p-8"
 width={600}
 height={400}
 />
 </div>
 </div>
 <div className="about-overview-content">
 <div className="section-eyebrow">Strategic Partnerships</div>
 <h2 className="section-title">Memorandums of Understanding</h2>
 <p>
 The One District One Product (ODOP) program collaborates with various
 national and international organizations, financial institutions, and
 e-commerce platforms through Memorandums of Understanding (MOUs). These
 partnerships aim to strengthen the ecosystem for local artisans and
 manufacturers by providing better market access, financial support,
 and technical expertise.
 </p>

 <p>
 <strong>Objective:</strong> To create a robust support system for
 ODOP stakeholders through strategic alliances that foster innovation,
 quality improvement, and global reach.
 </p>
 <div className="about-highlights-list">
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>
 Market Linkages: Partnering with e-commerce giants to take ODOP
 products to global consumers.
 </span>
 </div>
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>
 Financial Inclusion: Collaborating with banks to provide easy
 credit and financial schemes for MSMEs.
 </span>
 </div>
 <div className="about-highlight-item">
 <i className="fas fa-check-circle"></i>
 <span>
 Knowledge Transfer: Engaging with academic and research
 institutions for skill development and product design.
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <main className="mous-page section">
 <div className="container">
 <section className="mous-section">
 <div className="section-header">
 <span className="eyebrow">Official Documents</span>
 <h2>List of MOUs</h2>
 <div className="divider"><span></span><span></span><span></span></div>
 <p className="mt-4">
 This section provides a comprehensive list of official ODOP Memorandums of
 Understanding along with their signed dates and direct links to the
 original documents.
 </p>
 </div>

 <div className="mous-table-scroll">
 <table className="mous-table">
 <thead>
 <tr>
 <th>Sr. No.</th>
 <th>MOU Title</th>
 <th>Signed On</th>
 <th>Action</th>
 </tr>
 </thead>
 <tbody>
 {mouRecords.length === 0 ? (<tr>
 <td colSpan={4} className="text-center py-10 text-gray-500">
 No MOUs found.
 </td>
 </tr>) : (mouRecords.map((mou, index) => (<tr key={mou.slug}>
 <td>{index + 1}</td>
 <td className="font-semibold text-gray-900">{mou.title}</td>
 <td>
 <span className="mous-badge">
 {mou.signedOn}
 </span>
 </td>
 <td>
 <a
 href={mou.attachmentPath}
 target="_blank"
 rel="noopener noreferrer"
 className="mous-link-btn"
 >
 <i className="fas fa-file-pdf"></i> View Attachment
 </a>
 </td>
 </tr>)))}
 </tbody>
 </table>
 </div>
 </section>
 </div>
 </main>
 </div>);
}
