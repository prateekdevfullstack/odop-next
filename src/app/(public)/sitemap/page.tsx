import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
 title: "Sitemap | One District One Product",
 description: "Sitemap for ODOP website.",
};

const sitemapSections: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
 {
 title: "Main Pages",
 links: [
 { label: "Home", href: "/" },
 { label: "About", href: "/about" },
 { label: "Districts", href: "/districts" },
 { label: "Suppliers", href: "/suppliers" },
 { label: "Contact Us", href: "/contact-us" },
 ],
 },
 {
 title: "About ODOP",
 links: [
 { label: "Chief Minister's Message", href: "/about/chief-minister-message" },
 { label: "Minister's Message", href: "/about/minister-message" },
 { label: "Objective, Mission and Vision", href: "/about/objective-mission-vision" },
 { label: "Achievements", href: "/about/achievements" },
 { label: "Right to Information (RTI)", href: "/about/right-to-information" },
 ],
 },
 {
 title: "Schemes and Resources",
 links: [
 { label: "ODOP Schemes", href: "/odop-schemes" },
 { label: "Resources", href: "/resources" },
 { label: "Tenders", href: "/resources/tenders" },
 { label: "List of CFCs", href: "/resources/cfc-list" },
 { label: "List of NABL Labs", href: "/resources/nabl-labs" },
 { label: "Newsletter", href: "/resources/newsletter" },
 { label: "Scheme Related Enquiries", href: "/resources/grievance-redressal" },
 ],
 },
 {
 title: "Media and Knowledge Base",
 links: [
 { label: "Media Gallery", href: "/media/gallery" },
 { label: "Video Gallery", href: "/media/video-gallery" },
 { label: "Upcoming Events", href: "/media/upcoming-events" },
 { label: "Past Events", href: "/media/past-events" },
 { label: "Event Reports", href: "/media/event-reports" },
 { label: "Project Report", href: "/knowledge-base/project-report" },
 { label: "Documentary", href: "/knowledge-base/documentary" },
 { label: "Success Stories", href: "/knowledge-base/success-story" },
 { label: "Product Video", href: "/knowledge-base/project-video" },
 ],
 },
 {
 title: "Accessibility",
 links: [
 { label: "Screen Reader Access", href: "/screen-reader-access" }
//  { label: "Sitemap", href: "/sitemap" },
 ],
 },
];

export default function SitemapPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero about-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">Sitemap</h1>
 <p className="page-hero-subtitle">Quick access to major sections and pages of ODOP.</p>
 </div>
 </section>

 <section className="section section-surface-white">
 <div className="container">
 <div className="section-header">
 <h2>Website Navigation</h2>
 <p>Use the links below to quickly navigate to key areas of this portal.</p>
 <div className="divider"><span></span><span></span><span></span></div>
 </div>

 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
 {sitemapSections.map((section) => (<article key={section.title} style={{ border: "1px solid #dfe5f1", borderRadius: "10px", padding: "16px" }}>
 <h3 style={{ marginBottom: "10px" }}>{section.title}</h3>
 <ul style={{ margin: 0, paddingLeft: "18px" }}>
 {section.links.map((item) => (<li key={item.href + item.label} style={{ marginBottom: "8px" }}>
 <Link href={item.href}>{item.label}</Link>
 </li>))}
 </ul>
 </article>))}
 </div>
 </div>
 </section>
 </main>);
}
