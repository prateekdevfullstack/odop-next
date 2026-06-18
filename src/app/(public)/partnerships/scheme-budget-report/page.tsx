"use client";

import "@/styles/event-budget-report.css";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Counter from "@/components/Counter";
import MDAReportChart from "@/components/schemes/MDAReportChart";
import {
 FaFlag,
 FaHandshake,
 FaCoins,
 FaChartLine,
} from "react-icons/fa6";

function EventBudgetReportContent() {
 const searchParams = useSearchParams();
 const scheme = (searchParams.get("scheme")?.toUpperCase() as "MDA" | "TTS" | "MMS" | "CFC") || "MDA";

 const getSchemeTitle = (s: string) => {
 switch (s) {
 case "TTS": return "Training and Toolkit Scheme";
 case "MMS": return "Margin Money Scheme";
 case "CFC": return "Common Facility Centre Scheme";
 default: return "Marketing Development Assistance Scheme";
 }
 };

 return (<main className="main-content schemes-page about-static-page event-budget-report-page">
 <section className="page-hero events-report-hero">
 <div className="page-hero-overlay"></div>
 <div className="container page-hero-content">
 <h1 className="page-hero-title">ODOP {scheme} Report<br/>FY 2025–26</h1>
 <p className="page-hero-subtitle">Budget Allocation, Utilization &amp; Impact Analysis – {getSchemeTitle(scheme)} under ODOP</p>
 <div className="report-hero-meta">
 <span className="report-hero-meta-item"><i className="fas fa-calendar-alt"></i> Financial Year: April 2025 – March 2026</span>
 <span className="report-hero-meta-item"><i className="fas fa-building"></i> ODOP Cell, Directorate of Industries, </span>
 </div>
 <button className="report-print-btn" onClick={() => window.print()}>
 <i className="fas fa-print"></i> Print / Download Report
 </button>
 </div>
 </section>

 <div className="container">
 {/* SECTION 1 – FINANCIAL OVERVIEW */}
 <section className="report-section" aria-labelledby="overview-heading">
 <div className="section-header">
 <span className="eyebrow">Financial Overview</span>
 <h2 id="overview-heading">FY 2025-26 Budget Snapshot</h2>
 <p>
 Consolidated financial status of the {scheme} budget
 as of March 2026.
 </p>
 <div className="divider">
 <span></span>
 <span></span>
 <span></span>
 </div>
 </div>

 <div className="kpi-grid">
 <div className="kpi-card kpi-blue">
 <div className="kpi-icon">
 <FaCoins />
 </div>
 <div className="kpi-value">₹<Counter value="337.00" /> Cr</div>
 <div className="kpi-label">Total Allocated Budget</div>
 </div>
 <div className="kpi-card kpi-orange">
 <div className="kpi-icon">
 <FaChartLine />
 </div>
 <div className="kpi-value">₹<Counter value="250.00" /> Cr</div>
 <div className="kpi-label">Total Budget Utilized</div>
 </div>
 <div className="kpi-card kpi-green">
 <div className="kpi-icon">
 <FaHandshake />
 </div>
 <div className="kpi-value"><Counter value="74.18" />%</div>
 <div className="kpi-label">Utilization Rate</div>
 </div>
 <div className="kpi-card kpi-gold">
 <div className="kpi-icon">
 <FaFlag />
 </div>
 <div className="kpi-value">₹<Counter value="87.00" /> Cr</div>
 <div className="kpi-label">Remaining Balance</div>
 </div>
 </div>
 </section>

 {/* SECTION 2 – UTILIZATION TRENDS */}
 <section className="report-section" aria-labelledby="trends-heading">
 <div className="section-header">
 <span className="eyebrow">Financial Analytics</span>
 <h2 id="trends-heading">Utilization Trends</h2>
 <p>Analysis of period-wise spending patterns and distribution for {scheme}.</p>
 <div className="divider">
 <span></span>
 <span></span>
 <span></span>
 </div>
 </div>

 <section className="scheme-reports-section py-12 bg-gray-50">
 <div className="container">
 <div className=" centered-header mb-8">
 <h2 className="section-title">Scheme Performance Reports</h2>
 <p className="section-subtitle">Yearly distribution and impact analysis of flagship ODOP schemes</p>
 </div>
 
 
 <div className="report-item">
 <MDAReportChart 
 viewType="yearly" 
 scheme="MDA" 
 title="MDA Yearly Distribution" 
 />
 </div>
 <div className="report-item">
 <MDAReportChart 
 viewType="yearly" 
 scheme="TTS" 
 title="Training & Toolkit Yearly Distribution" 
 />
 </div>
 <div className="report-item">
 <MDAReportChart 
 viewType="yearly" 
 scheme="MMS" 
 title="Margin Money Yearly Distribution" 
 />
 </div>
 </div>
 </section>
 
 </section>

 {/* SECTION 3 – EVENTS & WEBINARS BREAKDOWN */}
 </div>
 </main>);
}

export default function EventBudgetReportPage() {
 return (<Suspense fallback={<div className="container py-20 text-center">Loading Report...</div>}>
 <EventBudgetReportContent />
 </Suspense>);
}
