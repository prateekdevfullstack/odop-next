"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function GovernmentLoginPage() {
  return (
    <div className="auth-shell gov-theme">
      <div className="auth-wrap">
        <header className="auth-topbar">
          <Link href="/login" className="brand">
            <Image
              className="brand-mark"
              src="/assets/img/logo.png"
              alt="ODOP logo"
              width={160}
              height={50}
            />
          </Link>
          <div className="top-actions">
            <Link href="/login" className="btn-ghost">
              Back to Admin Home
            </Link>
          </div>
        </header>

        <main className="auth-layout">
          <section className="auth-copy">
            <span className="eyebrow">Official Monitoring Desk</span>
            <h1>Government login</h1>
            <p>
              Use your official credentials to access level-based scheme related
              enquiry routing: ACI (Immediate), JCI (10 days), ADI (20 days), and DI
              (30 days).
            </p>
          </section>

          <section className="auth-card">
            <h2>Government Login</h2>
            <p className="panel-meta">
              Sign in to monitor ODOP scheme related enquiry escalation and timeline
              compliance.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="auth-field">
                <label htmlFor="gov-email">Official Email</label>
                <input
                  className="text-field"
                  id="gov-email"
                  type="email"
                  placeholder="official@odop.gov.in"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="gov-password">Password</label>
                <input
                  className="text-field"
                  id="gov-password"
                  type="password"
                  placeholder="Enter secure password"
                />
              </div>
              <div className="auth-footer">
                <span className="micro-copy">
                  Role-based permissions map to escalation level and resolution
                  timeline.
                </span>
                <button type="submit" className="btn">
                  Sign In
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
