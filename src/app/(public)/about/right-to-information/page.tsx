import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Right to Information (RTI) | About ODOP", description: "Right to Information RTI details for ODOP programme." };
export default function RightToInformationPage() {
 return (<>

 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Right to Information (RTI)</span></div>
 </div>
 </div>
 </section>

 <main className="main-content schemes-page policy-page rti-page">
 <div className="container">
 <div className="section-header"><span className="eyebrow">Transparency</span>
 <h2>RTI Documents</h2>
 <div className="divider"><span></span><span></span><span></span></div>
 </div>
 <section className="static-content-wrap">
 <article className="static-card">
 <h3>Available Files</h3>
 <div className="policy-table-wrap">
 <table className="policy-table">
 <thead>
 <tr>
 <th>Document</th>
 <th>Language</th>
 <th>Size</th>
 <th>Uploaded On</th>
 <th>Access</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>List of Public Authorities, State Public Information Officers and First
 Appellate Officers.</td>
 <td>Hindi</td>
 <td>251 KB</td>
 <td>06-07-2019</td>
 <td><a className="cfc-link-btn"
 href="/assets/document/pdf-attachment/639172226368366239.pdf" target="_blank"
 rel="noopener noreferrer">View</a></td>
 </tr>
 <tr>
 <td>Right to Information Act, 2005</td>
 <td>Hindi</td>
 <td>389 KB</td>
 <td>09-08-2018</td>
 <td><a className="cfc-link-btn"
 href="/assets/document/pdf-attachment/639172227396341643.pdf" target="_blank"
 rel="noopener noreferrer">View</a></td>
 </tr>
 </tbody>
 </table>
 </div>
 </article>
 </section>
 </div>
 </main>
 
 </>);
}
