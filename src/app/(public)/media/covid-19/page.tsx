import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Covid-19 | Events & Media | ODOP", description: "ODOP response and activities during the Covid-19 pandemic." };
export default function Covid19Page() {
 return (<main className="main-content schemes-page">
 <section className="page-hero-section"><div className="page-hero-wrapper"><Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} /><div className="page-hero-overlay" /><div className="page-hero-content"><h1 className="page-hero-title">Media</h1><div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Covid-19</span></div></div></div></section>
 <div className="container"><div className="section-header"><span className="eyebrow">Pandemic Response</span><h2>ODOP &amp; Covid-19</h2><div className="divider"><span /><span /><span /></div></div><section className="static-content-wrap"><article className="static-card"><p>Information about ODOP&apos;s response and support activities during the Covid-19 pandemic is available on the official ODOP portal at <a href="https://odopup.in" target="_blank" rel="noopener noreferrer">odopup.in</a>.</p></article></section></div>
 </main>);
}
