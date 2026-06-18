import type { Metadata } from "next";
import Image from "next/image";
import "@/styles/export-policy-infographic.css";

export const metadata: Metadata = {
  title: "Export Promotion Policy | About ODOP",
  description: "Export Promotion Policy documents under ODOP — official Export Promotion Policy 2020-2025 downloads.",
};

export default function ExportPromotionPolicyPage() {
  return (
    <main className="main-content schemes-page about-static-page policy-page">
      <section className="page-hero-section">
        <div className="page-hero-wrapper">
          <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <h1 className="page-hero-title">About</h1>
            <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Export Promotion Policy</span></div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Policy Highlights</span>
          <h2>Key Export Incentives &amp; Benefits</h2>
          <div className="divider"><span /><span /><span /></div>
        </div>

        <div className="export-policy-grid">
          <article className="export-benefit-card">
            <div className="export-benefit-icon-wrap benefit-icon-freight">
              <i className="fas fa-plane-departure" aria-hidden="true" />
            </div>
            <h3 className="export-benefit-title">Freight Subsidies</h3>
            <p className="export-benefit-desc">
              Artisans and manufacturers receive financial support covering up to 75% of shipping and air cargo logistics costs to foreign markets.
            </p>
          </article>

          <article className="export-benefit-card">
            <div className="export-benefit-icon-wrap benefit-icon-cert">
              <i className="fas fa-file-signature" aria-hidden="true" />
            </div>
            <h3 className="export-benefit-title">Quality &amp; Standard Support</h3>
            <p className="export-benefit-desc">
              Reimbursement for ISO audits, quality certifications (CE, FDA), and NABL testing charges to ensure compliance with international rules.
            </p>
          </article>

          <article className="export-benefit-card">
            <div className="export-benefit-icon-wrap benefit-icon-market">
              <i className="fas fa-globe-asia" aria-hidden="true" />
            </div>
            <h3 className="export-benefit-title">Global Trade Expos</h3>
            <p className="export-benefit-desc">
              Govt assistance for RCMC registration, stall allocation fee waivers, and travel allowances for international exhibitions.
            </p>
          </article>
        </div>

        <div className="section-header">
          <span className="eyebrow">Policy Documents</span>
          <h2>Available Downloads</h2>
          <div className="divider"><span /><span /><span /></div>
        </div>

        <section className="static-content-wrap">
          <article className="static-card">
            <h3>Export Promotion Policy 2020-2025</h3>
            <div className="policy-table-wrap">
              <table className="policy-table">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Size</th>
                    <th>Uploaded On</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>English</td>
                    <td>7.18 MB</td>
                    <td>28-02-2025</td>
                    <td>
                      <a
                        className="cfc-link-btn"
                        href="/assets/document/pdf-attachment/639172218030460326.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
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
    </main>
  );
}
