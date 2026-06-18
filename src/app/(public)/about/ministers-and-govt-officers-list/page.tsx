import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Ministers' & Officers' List | About ODOP", description: "List of ministers and government officers involved in ODOP programme administration." };
export default function MinistersOfficersListPage() {
 return (<main className="main-content schemes-page about-static-page">
 <section className="page-hero-section"><div className="page-hero-wrapper"><Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} /><div className="page-hero-overlay" /><div className="page-hero-content"><h1 className="page-hero-title">About</h1><div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Ministers&apos; &amp; Officers&apos; List</span></div></div></div></section>
 <div className="container"><div className="section-header"><span className="eyebrow">Administration</span><h2>Ministers &amp; Government Officers</h2><div className="divider"><span /><span /><span /></div></div><section className="static-content-wrap"><article className="static-card"><p>The list of ministers and government officers responsible for administration of the One District One Product (ODOP) programme is updated on a regular basis. Please visit the official ODOP portal for the latest information.</p></article></section></div>
 </main>);
}
