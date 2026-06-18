import type { Metadata } from "next";
import { ODOP_CONTACT } from "@/lib/odop-contact";

const GRIEVANCE_CONTACT = `${ODOP_CONTACT.email}, ${ODOP_CONTACT.address.withOrg}`;

export const metadata: Metadata = {
 title: "Grievance Redressal | Resources | ODOP",
 description: "Escalation mechanism and service timelines for resolving ODOP-related grievances.",
};

export default function GrievanceRedressalPage() {
 return (<main className="main-content about-static-page grievance-page">
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">Grievance Redressal</h1>
 <p className="page-hero-subtitle">
 Escalation mechanism and service timelines for resolving ODOP-related grievances.
 </p>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Support</span>
 <h2>Grievance Redressal</h2>
 <div className="divider">
 <span />
 <span />
 <span />
 </div>
 </div>

 <section className="static-content-wrap">
 <article className="static-card">
 <h3>ODOP Grievance Mechanism</h3>
 <p>
 <strong>ODOP is in process of making an online grievance mechanism.</strong>
 </p>
 <p>
 Until the online module is fully operational, grievances may be raised through email and processed under
 the escalation matrix below.
 </p>

 <h3 style={{ marginTop: "32px" }}>Escalation Matrix for Grievance Redressal (ODOP Program)</h3>
 <div className="grievance-matrix" aria-label="Escalation Matrix for Grievance Redressal">
 <article className="grievance-matrix-card">
 <div className="grievance-matrix-top">
 <span className="grievance-matrix-level">Level 1</span>
 <span className="grievance-matrix-timeline">Immediate</span>
 </div>
 <p className="grievance-matrix-row">
 <strong>Responsible Authority:</strong> Scheme in charge at Assistant Commissioner Industries (ACI)
 level: ODOP CFC Scheme, ODOP Margin Money Scheme, ODOP Market Development Assistance Scheme, and ODOP
 Skill Development and Toolkit Distribution Scheme.
 </p>
 <p className="grievance-matrix-row">
 <strong>Contact:</strong> {GRIEVANCE_CONTACT}
 </p>
 </article>

 <article className="grievance-matrix-card">
 <div className="grievance-matrix-top">
 <span className="grievance-matrix-level">Level 2</span>
 <span className="grievance-matrix-timeline">Within 10 days</span>
 </div>
 <p className="grievance-matrix-row">
 <strong>Responsible Authority:</strong> Joint Commissioner Industries (JCI)
 </p>
 <p className="grievance-matrix-row">
 <strong>Contact:</strong> {GRIEVANCE_CONTACT}
 </p>
 </article>

 <article className="grievance-matrix-card">
 <div className="grievance-matrix-top">
 <span className="grievance-matrix-level">Level 3</span>
 <span className="grievance-matrix-timeline">Within 20 days</span>
 </div>
 <p className="grievance-matrix-row">
 <strong>Responsible Authority:</strong> Additional Commissioner Industries (ADI)
 </p>
 <p className="grievance-matrix-row">
 <strong>Contact:</strong> {GRIEVANCE_CONTACT}
 </p>
 </article>

 <article className="grievance-matrix-card">
 <div className="grievance-matrix-top">
 <span className="grievance-matrix-level">Level 4</span>
 <span className="grievance-matrix-timeline">Within 30 days</span>
 </div>
 <p className="grievance-matrix-row">
 <strong>Responsible Authority:</strong> Director Industries (DI)
 </p>
 <p className="grievance-matrix-row">
 <strong>Contact:</strong> {GRIEVANCE_CONTACT}
 </p>
 </article>
 </div>

 <h3 style={{ marginTop: "40px" }}>Grievance Handling Process</h3>
 <ul className="static-list">
 <li>
 <i className="fas fa-check-circle" />
 <span>Grievance Submission: Businesses submit grievances through an online portal, email, or helpline.</span>
 </li>
 <li>
 <i className="fas fa-check-circle" />
 <span>Acknowledgment: An acknowledgment receipt with a Grievance ID is generated.</span>
 </li>
 <li>
 <i className="fas fa-check-circle" />
 <span>Escalation Levels: If not resolved at Level 1, the grievance is escalated to the next level based on timeline.</span>
 </li>
 <li>
 <i className="fas fa-check-circle" />
 <span>Final Resolution: If unresolved after 30 days, the case is addressed by the State Government authority.</span>
 </li>
 </ul>

 <h3 style={{ marginTop: "32px" }}>Service Timelines</h3>
 <ul className="static-list">
 <li>
 <i className="fas fa-clock" />
 <span>Immediate Resolution: Level 1 (ACI) attempts to resolve the issue promptly.</span>
 </li>
 <li>
 <i className="fas fa-clock" />
 <span>Escalation within 10 days: If unresolved, it moves to JCI.</span>
 </li>
 <li>
 <i className="fas fa-clock" />
 <span>Escalation within 20 days: ADI reviews and takes action.</span>
 </li>
 <li>
 <i className="fas fa-clock" />
 <span>Escalation within 30 days: DI intervenes for final decision-making.</span>
 </li>
 </ul>

 <p style={{ marginTop: "24px" }}>
 This structured mechanism ensures transparency, accountability, and timely redressal of grievances under
 the ODOP program.
 </p>
 </article>

 <article className="grievance-form-card">
 <h3>Submit Grievance</h3>
 <p>
 Use this form to register a new grievance. Your submission will be routed through the ODOP escalation
 levels according to the defined service timeline.
 </p>
 <form>
 <div className="grievance-form-grid">
 <div className="grievance-form-field">
 <label htmlFor="grievance-name">Applicant Name</label>
 <input id="grievance-name" type="text" placeholder="Enter full name" />
 </div>
 <div className="grievance-form-field">
 <label htmlFor="grievance-email">Email</label>
 <input id="grievance-email" type="email" placeholder="name@example.com" />
 </div>
 <div className="grievance-form-field">
 <label htmlFor="grievance-mobile">Mobile Number</label>
 <input id="grievance-mobile" type="tel" placeholder="10-digit mobile number" />
 </div>
 <div className="grievance-form-field">
 <label htmlFor="grievance-district">District</label>
 <select id="grievance-district">
 <option>Agra</option>
 <option>Varanasi</option>
 <option>Moradabad</option>
 <option>Lucknow</option>
 <option>Other District</option>
 </select>
 </div>
 <div className="grievance-form-field">
 <label htmlFor="grievance-issue">Issue Type</label>
 <select id="grievance-issue">
 <option>Supplier Not Responding</option>
 <option>Profile Mismatch</option>
 <option>ODOP Scheme Query</option>
 <option>Market Assistance Query</option>
 <option>Technical Issue</option>
 </select>
 </div>
 <div className="grievance-form-field">
 <label htmlFor="grievance-supplier">Supplier / Unit Name (If Any)</label>
 <input id="grievance-supplier" type="text" placeholder="Enter supplier or unit name" />
 </div>
 <div className="grievance-form-field full-span">
 <label htmlFor="grievance-description">Issue Description</label>
 <textarea
 id="grievance-description"
 placeholder="Explain the grievance with relevant details for faster resolution."
 />
 </div>
 <div className="grievance-form-field full-span">
 <label htmlFor="grievance-attachment">Supporting Document (Optional)</label>
 <input id="grievance-attachment" type="file" />
 </div>
 </div>
 <div className="grievance-form-actions">
 <p className="grievance-note">
 After submission, a Grievance ID will be generated and the case will enter the defined ODOP escalation
 workflow.
 </p>
 <button className="grievance-btn" type="button">
 Submit Grievance
 </button>
 </div>
 </form>
 </article>
 </section>
 </div>
 </main>);
}
