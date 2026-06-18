"use client";

import React from "react";


export default function BuyerLoginPage() {
  return (
    <div className="auth-shell buyer-theme">
      <div className="auth-wrap">
        <main className="auth-layout">
          <section className="auth-copy">
            <span className="eyebrow">Buyer Support Desk</span>
            <h1>Buyer Login Portal</h1>
            <p>Continue with your registered mobile number to open the buyer dashboard.</p>
          </section>

          <section className="auth-card">
            <h2>Buyer Login</h2>
            <p className="panel-meta">Mobile number only is required for buyer access.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="auth-field">
                <label htmlFor="buyer-mobile">Mobile Number</label>
                <input
                  className="text-field"
                  id="buyer-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter registered mobile number"
                />
              </div>
              <div className="auth-footer">
                <span className="micro-copy">The same mobile login is used on the main site popup.</span>
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
