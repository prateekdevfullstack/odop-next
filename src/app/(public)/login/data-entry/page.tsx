"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function DataEntryLoginPage() {
  return (
    <div className="auth-shell entry-theme">
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
            <span className="eyebrow">CMS Operations Desk</span>
            <h1>Content Management Login</h1>
            <p>Sign in to manage district content, uploads, and publishing work.</p>
          </section>

          <section className="auth-card">
            <h2>Content Writer Login</h2>
            <p className="panel-meta">Use your registered email and password to continue.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="auth-field">
                <label htmlFor="entry-email">Email</label>
                <input
                  className="text-field"
                  id="entry-email"
                  type="email"
                  placeholder="cms.team@odop.in"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="entry-password">Password</label>
                <input
                  className="text-field"
                  id="entry-password"
                  type="password"
                  placeholder="Enter secure password"
                />
              </div>
              <div className="auth-footer">
                <span className="micro-copy">Pending approvals and uploads will appear after login.</span>
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
