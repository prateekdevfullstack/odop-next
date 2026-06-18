"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function AdminPortalPage() {
  return (
    <div className="portal-container">
      <div className="landing-wrap">
        <header className="landing-topbar">
          <Link href="/" className="brand">
            <Image
              className="brand-mark"
              src="/assets/img/logo.png"
              alt="ODOP logo"
              width={160}
              height={50}
              sizes="(max-width: 480px) 110px, (max-width: 768px) 130px, 160px"
              quality={80}
            />
          </Link>
          <div className="top-actions">
            <Link href="/" className="btn-ghost">
              Return to Portal
            </Link>
          </div>
        </header>

        <main>
          <section className="landing-hero">
            <aside className="spotlight">
              <span className="dashboard-illustration-icon">
                <i className="fas fa-chart-bar fa-4x"></i>
              </span>
            </aside>
            <div className="landing-content">
              <span className="eyebrow">ODOP Enterprise Dashboard Suite</span>
              <h1>
                ODOP administrative dashboards for officials, content teams,
                suppliers, and buyers.
              </h1>
              <p>
                Separate access panels with responsive dashboards, forms,
                tables, and workflows.
              </p>
            </div>
          </section>

          <section className="section-block" id="roles">
            <div className="card-grid-4">
              <article className="module-card gov-theme">
                <span className="role-badge">Government Officials</span>
                <strong>District oversight</strong>
                <p>Leads, scheme related enquiries, and events.</p>
                <div className="quick-actions">
                  <Link href="/login/government" className="btn">
                    Login
                  </Link>
                  <Link href="/login/government" className="btn-outline">
                    Dashboard
                  </Link>
                </div>
              </article>

              <article className="module-card entry-theme">
                <span className="role-badge">Content Team</span>
                <strong>CMS publishing</strong>
                <p>Profiles, reports, videos, and galleries.</p>
                <div className="quick-actions">
                  <Link href="/login/data-entry" className="btn">
                    Login
                  </Link>
                  <Link href="/login/data-entry" className="btn-outline">
                    Dashboard
                  </Link>
                </div>
              </article>

              <article className="module-card supplier-theme">
                <span className="role-badge">Suppliers</span>
                <strong>Supplier operations</strong>
                <p>Profile, products, and enquiries.</p>
                <div className="quick-actions">
                  <Link href="/login/supplier" className="btn">
                    Login
                  </Link>
                  <Link href="/login/supplier" className="btn-outline">
                    Dashboard
                  </Link>
                </div>
              </article>

              <article className="module-card buyer-theme">
                <span className="role-badge">Buyers / Users</span>
                <strong>Buyer services</strong>
                <p>Enquiries, tickets, and loan tracking.</p>
                <div className="quick-actions">
                  <Link href="/login/buyer" className="btn">
                    Login
                  </Link>
                  <Link href="/login/buyer" className="btn-outline">
                    Dashboard
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
