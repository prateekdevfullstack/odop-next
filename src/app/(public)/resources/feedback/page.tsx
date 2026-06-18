import type { Metadata } from "next";
import { ODOP_CONTACT } from "@/lib/odop-contact";
export const metadata: Metadata = { title: "Feedback | Resources | ODOP", description: "Share your feedback about the ODOP programme." };
export default function FeedbackPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero schemes-hero"><div className="page-hero-overlay" /><div className="container page-hero-content"><h1 className="page-hero-title">Feedback</h1><p className="page-hero-subtitle">Share your experience and suggestions to help improve the One District One Product programme.</p></div></section>
 <div className="container"><div className="section-header"><span className="eyebrow">Your Voice Matters</span><h2>Submit Feedback</h2><div className="divider"><span /><span /><span /></div></div><section className="static-content-wrap"><article className="static-card"><p>To share your feedback about the ODOP programme, contact the ODOP Cell at <strong><a href={`mailto:${ODOP_CONTACT.email}`}>{ODOP_CONTACT.email}</a></strong> or write to <strong>{ODOP_CONTACT.address.withOrg}</strong>.</p></article></section></div>
 </main>);
}
