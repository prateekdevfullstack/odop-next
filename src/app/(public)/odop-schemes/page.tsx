'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  FaExternalLinkAlt,
  FaSearch,
  FaUserPlus,
} from 'react-icons/fa'
import { Scheme } from '@/lib/schemes'
import { fetchSchemesList } from '@/services/schemes.service'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { useEffect, useState } from 'react'
import { API_CONFIG } from '@/lib/api'
import "@/styles/schemes-infographic.css";

function getHighlightText(highlight: Scheme["highlightsJson"][number]) {
  const title = highlight.title?.trim();
  const description = highlight.description?.trim();

  return title && title !== "=>" ? title : description || null;
}

function getSchemeFocusAreas(highlights: Scheme["highlightsJson"] = []) {
  return highlights
    .map(getHighlightText)
    .filter((item): item is string => Boolean(item));
}

function getSchemeDescription(scheme: Scheme) {
  return (
    scheme.shortDescription?.trim() ||
    scheme.introJson?.description?.trim() ||
    null
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const description = getSchemeDescription(scheme);
  const focusAreas = getSchemeFocusAreas(scheme.highlightsJson);

  return (
    <div className="scheme-card odop-scheme-card">
      <div className="scheme-card-header">
        <div className="scheme-icon">
          <Image src={API_CONFIG.NEW_BASE_URL + scheme.logo} alt={scheme.name} width={48} height={48} />
        </div>
      </div>
      <div className="scheme-card-body">
        <h3 className="scheme-name scheme-content-title">{scheme.name}</h3>
        {description && <p className="scheme-description">{description}</p>}
        {focusAreas.length > 0 && (
          <div className="scheme-focus">
            <h5>Key Focus Areas</h5>
            <ul className="scheme-focus-list">
              {focusAreas.map((focusArea, focusIndex) => (
                <li key={`${scheme.slug}-focus-${focusIndex}`}>
                  <span className="scheme-focus-bullet" aria-hidden="true">•</span>
                  <span>{focusArea}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {scheme.schemeType === 'ODOP' && (
        <div className="scheme-card-footer">
          <Link
            href={`/odop-schemes/${scheme.slug}`}
            className="btn btn-primary btn-sm scheme-apply-btn"
          >
            <FaExternalLinkAlt className="mr-2" />
            View Details &amp; Apply
          </Link>
        </div>
      )}
      {scheme.schemeType !== 'ODOP' && (
        <div className="scheme-card-footer">
          <Link
            href={`https://msme.up.gov.in/login/Registration_Login`}
            className="btn btn-primary btn-sm scheme-apply-btn"
            target="_blank"
          >
            <FaExternalLinkAlt className="mr-2" />
            View Details &amp; Apply
          </Link>
        </div>
      )}
    </div>
  );
}

export default function OdopSchemes() {
  const [schemes, setSchemes] = useState<Array<Scheme>>([]);
  const [otherSchemes, setOtherSchemes] = useState<Array<Scheme>>([]);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const response = await fetchSchemesList();
        if (Array.isArray(response?.data)) {
          const schemesData = Object.groupBy(response.data, (scheme) => scheme.schemeType);

          setSchemes(schemesData['ODOP'] || []);
          setOtherSchemes(schemesData['OTHER'] || []);
        }
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
      }
    };
    loadSchemes();
  }, []);

  return (
    <>
      <section className="page-hero-section">
        <div className="page-hero-wrapper">
          <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New1.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <h1 className="page-hero-title">Schemes &amp; Policies</h1>
            <Breadcrumb en="ODOP Schemes & Benefits" hi="ओडीओपी योजनाएं एवं लाभ" />
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-overview-grid">
            <div className="about-overview-visual">
              <div className="about-image-stack">
                <Image
                  src="/assets/img/scheme-1.jpg"
                  alt="Traditional Craft"
                  className="about-main-image"
                  width={600}
                  height={400}
                />
              </div>
            </div>
            <div className="about-overview-content">
              <div className="section-eyebrow">Flagship Scheme</div>
              <h2 className="section-title">ODOP Support Schemes</h2>
              <p>
                The ODOP Schemes are a set of targeted support programs designed to strengthen
                district-specific industries by addressing key gaps in finance, infrastructure, skills, and market
                access. These include the Common Facility Centre (CFC) Scheme, which provides shared infrastructure
                and modern machinery to producers; the Margin Money / Finance Assistance Scheme, offering subsidies
                to help entrepreneurs access loans; the Skill Development &amp; Toolkit Scheme, which trains artisans
                and provides improved tools; and the Marketing Development Assistance (MDA) Scheme, which supports
                participation in exhibitions, branding, and market linkage. Together, these schemes aim to enhance
                productivity, improve product quality, reduce production costs, and enable artisans, self-help
                groups, and MSMEs to compete in national and international markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="main-content schemes-page">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <h2 className="section-title">ODOP Schemes & Policies</h2>
            </div>
          </div>

          <div className="schemes-grid" id="schemesGrid">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          <div className="section-header">
            <div className="section-header-left">
              <h2 className="section-title">Other MSME Schemes & Policies</h2>
            </div>
          </div>

          <div className="schemes-grid">
            {otherSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </main>

      <section className="schemes-infographic-section">
        <div className="flow-container">
          <div className="centered-header">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>How to Apply for Schemes</h2>
            <p className="section-subtitle text-text-muted" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              A simple 4-step process to avail benefits under any government scheme
            </p>
          </div>
          <div className="flow-steps-grid">
            <article className="flow-step-card">
              <div className="flow-step-badge">Step 1</div>
              <div className="flow-step-icon-wrap step-icon-1">
                <FaUserPlus />
              </div>
              <div className="flow-step-content">
                <h3 className="flow-step-title">Register on Portal</h3>
                <p className="flow-step-desc">
                  Create your free artisan/MSME profile on the ODOP portal with basic business information and Aadhaar/PAN details.
                </p>
              </div>
            </article>

            <article className="flow-step-card">
              <div className="flow-step-badge">Step 2</div>
              <div className="flow-step-icon-wrap step-icon-2">
                <FaSearch />
              </div>
              <div className="flow-step-content">
                <h3 className="flow-step-title">Select Scheme</h3>
                <p className="flow-step-desc">
                  Browse through available schemes and check your eligibility criteria. Find the program most suited to your industrial needs.
                </p>
              </div>
            </article>

            <article className="flow-step-card">
              <div className="flow-step-badge">Step 3</div>
              <div className="flow-step-icon-wrap step-icon-3">
                <i className="fas fa-file-upload" aria-hidden="true" />
              </div>
              <div className="flow-step-content">
                <h3 className="flow-step-title">Submit Application</h3>
                <p className="flow-step-desc">
                  Fill the online application form and upload required documents. Our helpdesk team is available to assist you throughout the process.
                </p>
              </div>
            </article>

            <article className="flow-step-card">
              <div className="flow-step-badge">Step 4</div>
              <div className="flow-step-icon-wrap step-icon-4">
                <i className="fas fa-circle-check" aria-hidden="true" />
              </div>
              <div className="flow-step-content">
                <h3 className="flow-step-title">Get Benefits</h3>
                <p className="flow-step-desc">
                  Track your application status online. Upon approval, benefits are directly disbursed to your registered bank account.
                </p>
              </div>
            </article>
          </div>
          <div className="apply-cta" style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/contact-us" className="btn btn-secondary btn-lg">
              <i className="fas fa-headset" aria-hidden="true" /> Need Help? Contact Our Helpdesk
            </Link>
            <Link href="/supplier-registration" className="btn btn-primary btn-lg">
              <i className="fas fa-user-plus" aria-hidden="true" /> Apply for Registration
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
