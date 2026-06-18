"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import EventDetailSectorAccordion from "./EventDetailSectorAccordion";
import { bookedStalls, buildStallLayout } from "./stallLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function EventDetailClient() {
 const { stallSlots, stallTypeMap } = useMemo(() => buildStallLayout(), []);
 const bookedSet = useMemo(() => new Set<string>(bookedStalls), []);
 const [selectedStall, setSelectedStall] = useState<string | null>(null);

 const selectedIndustriesText = useMemo(() => {
 if (!selectedStall) return "No industry selected";
 return stallTypeMap[selectedStall] ?? "No industry selected";
 }, [selectedStall, stallTypeMap]);

 const selectedStallsText = useMemo(() => {
 if (!selectedStall) return "None selected yet";
 return selectedStall;
 }, [selectedStall]);

 const totalSelected = selectedStall ? 1 : 0;

 const handleBookNow = () => {
 if (!selectedStall) {
 window.alert("Please select one stall from the layout before submitting your request.");
 return;
 }
 const industry = stallTypeMap[selectedStall] ?? "";
 window.alert(`Selected stall: ${selectedStall}\nIndustry: ${industry}\nStall Charges: Free\nAllotment Basis: First come first serve\n(Booking integration coming soon)`,);
 };

 return (<div className="event-detail-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New3.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <div className="event-detail-hero-shell">
 <div className="event-detail-hero-copy">
 <span className="event-detail-hero-badge">
 <i className="fas fa-calendar-star" aria-hidden="true" /> Featured ODOP Exhibition
 </span>
 <h1 className="page-hero-title">Exhibitions &amp; Fairs</h1>
 <Breadcrumb en="ODOP Exhibition 2026" hi="ओडीओपी प्रदर्शनी 2026" />
 <p className="page-hero-subtitle">
 Experience the best &apos;s One District One Product initiative. Join 200+ exhibitors,{" "}
 <br />
 network with industry leaders, and explore handicrafts, leather, textile, food <br />
 processing and MSME innovations under one official showcase.
 </p>
 <div className="event-meta-grid">
 <span>
 <i className="fas fa-calendar-days" aria-hidden="true" /> 18-20 December 2026
 </span>
 <span>
 <i className="fas fa-location-dot" aria-hidden="true" /> Vrindavan Yojna, Lucknow
 </span>
 <span>
 <i className="fas fa-clock" aria-hidden="true" /> 10:00 AM to 8:00 PM
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <main className="main-content event-page event-detail-page-main">
 <section className="section event-main-section">
 <div className="container">
 <div className="event-detail-layout">
 <div className="event-detail-primary">
 <article className="event-detail-card event-detail-card-wide">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">About the Event</span>
 <h2>Official exhibition details</h2>
 </div>
 </div>
 <div className="event-detail-about-shell">
 <div className="event-detail-about-copy">
 <div className="event-detail-info-grid">
 <div className="event-detail-info-item">
 <span>Date</span>
 <strong>18-20 December 2026</strong>
 </div>
 <div className="event-detail-info-item">
 <span>Venue</span>
 <strong>Vrindavan Yojna, Lucknow</strong>
 </div>
 <div className="event-detail-info-item">
 <span>Industry Categories</span>
 <strong>Handicrafts, Leather, Textile, Food Processing, MSME Products</strong>
 </div>
 <div className="event-detail-info-item">
 <span>Organizer Support</span>
 <strong>Helpdesk, facilitation, promotion and business networking</strong>
 </div>
 </div>
 <ul className="event-detail-list">
 <li>
 <strong>Time:</strong> 10:00 AM to 8:00 PM on all exhibition days.
 </li>
 <li>
 <strong>Expected Visitors:</strong> 10,000+ trade, public and institutional visitors.
 </li>
 <li>
 <strong>Total Exhibitors:</strong> 200+ participating businesses and artisans.
 </li>
 <li>
 <strong>Facilities:</strong> Networking Zone, Food Court, Parking, Security, Wi-Fi and Power
 Backup.
 </li>
 </ul>
 <p className="event-detail-copy">
 Don&apos;t miss this opportunity to showcase your products, connect with buyers and grow your
 business at one of the largest ODOP events scheduled for the year.
 </p>
 </div>
 <div className="event-detail-about-media">
 <Image
 src="/assets/img/events/-ODOP-Exhibition-2026.png"
 alt=" ODOP Exhibition 2026 poster"
 width={800}
 height={500}
 />
 </div>
 </div>
 </article>

 <div className="event-detail-booking-layout">
 <section className="event-detail-card event-detail-booking-card" id="stall-booking">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Stall Categories</span>
 <h2>Select your stall</h2>
 </div>
 <p>
 Select only one available sector blocks from the map on the left. Stall allotment requests are
 processed on a first come, first serve basis.
 </p>
 </div>
 <div className="stall-legend">
 <span>
 <span className="legend-dot available" /> Available
 </span>
 <span>
 <span className="legend-dot booked" /> Booked
 </span>
 <span>
 <span className="legend-dot selected" /> Selected
 </span>
 </div>
 <div className="stall-layout-wrap">
 <div className="stall-layout" id="stall-layout" aria-label="Stall layout selector">
 {stallSlots.map((slot) => {
 const isBooked = bookedSet.has(slot.stall);
 const isSelected = selectedStall === slot.stall;
 const buttonClass = [
 "stall-block",
 isBooked ? "booked" : isSelected ? "selected" : "available",
 ].join(" ");
 const industry = stallTypeMap[slot.stall] ?? "";
 return (<button
 key={slot.stall}
 type="button"
 className={buttonClass}
 style={{ gridColumn: slot.col, gridRow: slot.row }}
 disabled={isBooked}
 data-stall={slot.stall}
 title={`${slot.stall} | ${industry} | Free stall | First come first serve`}
 aria-label={`${slot.stall} ${industry} stall`}
 onClick={() => {
 if (isBooked) return;
 setSelectedStall((prev) => (prev === slot.stall ? null : slot.stall));
 }}
 >
 {slot.layoutNo}
 </button>);
 })}
 </div>
 </div>
 <article className="event-detail-sidecard booking-summary booking-summary-inline" id="booking-summary-card">
 <div className="event-detail-card-head summary-head">
 <div>
 <span className="event-detail-kicker">Live Summary</span>
 <h3>Booking summary</h3>
 </div>
 </div>
 <p className="booking-summary-info">
 <strong>
 Stalls are Free, so allotment will be on a first come, first serve basis
 </strong>
 </p>
 <div className="booking-summary-section booking-summary-section-compact">
 <span className="pr-15">Selected industries</span>
 <strong id="booking-selected-industries">{selectedIndustriesText}</strong>
 </div>
 <div className="booking-summary-grid">
 <div className="booking-summary-item booking-summary-item-inline">
 <span>Selected stalls</span>
 <span id="booking-selected-stalls">{selectedStallsText}</span>
 </div>
 <div className="booking-summary-item booking-summary-item-inline">
 <span>Total selected stalls</span>
 <strong id="booking-total-stalls">{totalSelected}</strong>
 </div>
 </div>
 <button
 className="btn btn-primary"
 id="book-now-btn"
 type="button"
 disabled={!selectedStall}
 onClick={handleBookNow}
 >
 Request Stall Allotment
 </button>
 </article>
 </section>

 <aside className="event-detail-sidebar">
 <div className="event-detail-card sector-accordion-card">
 <div className="event-detail-card-head summary-head">
 <div>
 <span className="event-detail-kicker">Sector Reference</span>
 <h2>Sector Industry</h2>
 </div>
 </div>
 <p className="event-detail-note">
 Expand each industry sector to view District-Product details and approved stall count.
 </p>
 <EventDetailSectorAccordion />
 </div>
 </aside>
 </div>

 <div className="event-detail-secondary-grid">
 <article className="event-detail-card">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Programme</span>
 <h2>Event schedule</h2>
 </div>
 </div>
 <ul className="event-detail-list compact">
 <li>18 Dec: Inauguration and Opening Ceremony at 10:00 AM</li>
 <li>18-20 Dec: Exhibition open from 10:00 AM to 8:00 PM</li>
 <li>19 Dec: Networking Session at 2:00 PM</li>
 <li>20 Dec: Award Ceremony and Closing at 6:00 PM</li>
 </ul>
 </article>
 <article className="event-detail-card" id="event-guidelines">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Compliance</span>
 <h2>Stall guidelines</h2>
 </div>
 </div>
 <ul className="event-detail-list compact">
 <li>Stalls must be set up by 9:00 AM on event days.</li>
 <li>Exhibitors must display only approved products.</li>
 <li>Maintain cleanliness and safety standards throughout the event.</li>
 <li>Follow all event and government regulations.</li>
 </ul>
 </article>
 <article className="event-detail-card">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Support</span>
 <h2>Organizer support includes</h2>
 </div>
 </div>
 <ul className="event-detail-list compact">
 <li>Dedicated helpdesk and venue guidance</li>
 <li>Networking zone and product showcase access</li>
 <li>Promotional visibility support</li>
 <li>Coordination for exhibitors and visitors</li>
 </ul>
 </article>
 <article className="event-detail-card">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Refunds</span>
 <h2>Cancellation policy</h2>
 </div>
 </div>
 <ul className="event-detail-list compact">
 <li>Full refund for cancellations before 1 Dec 2026.</li>
 <li>50% refund for cancellations before 10 Dec 2026.</li>
 <li>No refund after 10 Dec 2026.</li>
 </ul>
 </article>
 <article className="event-detail-card">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Support Desk</span>
 <h2>Contact organizer</h2>
 </div>
 </div>
 <ul className="event-detail-list compact">
 <li>
 Email: <a href="mailto:events@odopup.in">events@odopup.in</a>
 </li>
 <li>
 Phone: <a href="tel:+919876543210">+91 98765 43210</a>
 </li>
 <li>Helpdesk: Vrindavan Yojna, Lucknow</li>
 </ul>
 </article>
 <article className="event-detail-card">
 <div className="event-detail-card-head">
 <div>
 <span className="event-detail-kicker">Assistance</span>
 <h2>Need assistance before booking?</h2>
 </div>
 </div>
 <p>
 For participation queries, stall allocation clarifications or event documentation, contact the ODOP
 events desk during working hours.
 </p>
 <Link href="/contact-us" className="btn btn-secondary">
 Contact ODOP Team
 </Link>
 </article>
 </div>
 </div>
 </div>
 </div>
 </section>

 <section className="section-sm event-process-section bg-light">
 <div className="container">
 <div className="section-header centered-header">
 <div className="section-eyebrow">Participation Flow</div>
 <h2 className="section-title">How to get ready for this exhibition</h2>
 <p className="section-subtitle">
 A quick participation checklist for exhibitors planning their ODOP event presence.
 </p>
 </div>
 <div className="event-process-grid">
 <article className="event-process-card">
 <span className="event-process-step">01</span>
 <h3>Review your stall needs</h3>
 <p>
 Choose the right stall type based on expected footfall, product display requirements and visitor
 interaction goals.
 </p>
 </article>
 <article className="event-process-card">
 <span className="event-process-step">02</span>
 <h3>Prepare your material</h3>
 <p>
 Keep product catalogues, price sheets, branding material, compliance documents and packaging samples
 ready.
 </p>
 </article>
 <article className="event-process-card">
 <span className="event-process-step">03</span>
 <h3>Coordinate event logistics</h3>
 <p>
 Confirm setup timing, staff availability, transport needs and follow-up responsibilities before event
 opening.
 </p>
 </article>
 </div>
 </div>
 </section>
 </main>
 </div>);
}
