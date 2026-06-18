import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Officers' List | About ODOP", description: "List of officers involved in ODOP programme." };
export default function DirectorateOfficersListPage() {
 return (<main className="main-content schemes-page about-static-page">

 <section className="page-hero-section"><div className="page-hero-wrapper"><Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} /><div className="page-hero-overlay" /><div className="page-hero-content"><h1 className="page-hero-title">About</h1><div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Officers&apos; List</span></div></div></div></section>


 <div className="container policy-page policy-table-wrap">
 <div className="section-header"><span className="eyebrow">State Leadership</span><h2>Ministers &amp; Government Officers</h2><div className="divider"><span /><span /><span /></div></div>
 <table className="policy-table">
 <thead>
 <tr>
 <th>Officer Name</th>
 <th>Designation</th>
 <th>District Assigned</th>
 <th>Product Category</th>
 </tr>
 </thead>
 <tbody>
 <tr className="no-data">
 <td colSpan={4} style={{ textAlign: "center" }}>No Data Available</td>
 </tr>
 </tbody>
 </table>

 </div>

 <div className="container policy-page policy-table-wrap mb-4">
 <div className="section-header"><span className="eyebrow">Key Offcials</span><h2>Directorate Officers</h2><div className="divider"><span /><span /><span /></div></div>


 <table className="policy-table">
 <thead>
 <tr>
 <th>Officer Name</th>
 <th>Designation</th>
 <th>District Assigned</th>
 <th>Product Category</th>
 </tr>
 </thead>
 <tbody>
 <tr className="no-data">
 <td colSpan={4} style={{ textAlign: "center" }}>No Data Available</td>
 </tr>
 </tbody>
 </table>

 </div>


 </main>);
}
