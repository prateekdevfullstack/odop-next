import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Minutes of Meeting | About ODOP", description: "Minutes of meetings held under the ODOP programme." };
export default function MinutesOfMeetingPage() {
 return (<main className="main-content schemes-page about-static-page policy-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Minutes of Meeting</span></div>
 </div>
 </div>
 </section>

 <div className="container">
 <section className="static-content-wrap">
 <article className="static-card">
 <p className="static-note">
 The source page also carries the message &quot;content will be available soon..&quot;.
 The following action-point files are available in page links.
 </p>
 <div className="policy-table-wrap">
 <table className="policy-table">
 <thead>
 <tr>
 <th>DOCUMENT</th>
 <th>ACCESS</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>Action point of ODOP Meeting on 13-03-18 at New Delhi</td>
 <td>
 <a 
 className="cfc-link-btn"
 href="/assets/document/pdf-attachment/20180405_Action_point_of_ODOP_Meeting_on_13-03-18_at_New_Delhi.pdf"
 target="_blank" 
 rel="noopener"
 >
 View / Download
 </a>
 </td>
 </tr>
 <tr>
 <td>Action point of ODOP Meeting on 14-03-18 at Varanasi</td>
 <td>
 <a 
 className="cfc-link-btn"
 href="/assets/document/pdf-attachment/20180405_Action_point_of_ODOP_Meeting_on_14-03-18_at_Varanasi.pdf"
 target="_blank" 
 rel="noopener"
 >
 View / Download
 </a>
 </td>
 </tr>
 <tr>
 <td>Action point of ODOP Meeting on 17-03-18 at Agra</td>
 <td>
 <a 
 className="cfc-link-btn"
 href="/assets/document/pdf-attachment/20180405_Action_point_of_ODOP_Meeting_on_17-03-18_at_Agra.pdf"
 target="_blank" 
 rel="noopener"
 >
 View / Download
 </a>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </article>
 </section>
 </div>
 </main>);
}

