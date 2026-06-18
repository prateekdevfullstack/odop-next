"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import * as authService from "@/services/auth.service";
import type { SupplierAuthPayload } from "@/services/auth.service";
import { ApiError } from "@/lib/api/types";
import "@/styles/supplier-onboarding.css";

export default function SupplierRegistrationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role_name?.toLowerCase() === "supplier") {
          router.push("/supplier/dashboard");
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.supplierRegistration({
        name: name.trim(),
        mobile_no: mobileNo.replace(/\D/g, "").slice(0, 10),
        email: email.trim(),
        password,
      });

      const body = response.data as SupplierAuthPayload;
      if (authService.persistSupplierSession(body)) {
        toast.success(body.message || "Registration successful");
        router.push("/supplier/dashboard");
        return;
      }
      toast.error("Registration did not complete. Please try again.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.errors) {
          const first = Object.values(err.errors)[0];
          const msg = Array.isArray(first) ? first[0] : String(first);
          toast.error(msg || err.message);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="supplier-registration-page">
      <section className="page-hero supplier-registration-hero">
        <div className="container">
          <h1>
            <i className="fas fa-file-circle-plus form-page-title-icon" aria-hidden="true"></i>
            Supplier Account Registration
          </h1>
          <p>
            Register with basic account details first. Complete the full profile, products, and operational
            information later from the supplier admin panel.
          </p>
        </div>
      </section>

      <section className="contact-page">
        <div className="container">
          <div className="registration-main-grid">
            <div className="contact-form-panel">
              <div className="form-panel-header">
                <h2>
                  <i className="fas fa-id-card-clip" aria-hidden="true"></i> Basic Supplier Registration
                </h2>
                <p>
                  Submit only the essential onboarding details here. Detailed business and product information can be
                  updated after login.
                </p>
              </div>

              <form className="contact-form supplier-registration-form" noValidate onSubmit={handleSubmit}>
                <div className="registration-section">
                  <h3>Account details</h3>
                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label" htmlFor="supplier-name">
                        Full name <span className="required">*</span>
                      </label>
                      <input
                        id="supplier-name"
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier-mobile">
                        Mobile number <span className="required">*</span>
                      </label>
                      <input
                        id="supplier-mobile"
                        type="tel"
                        name="mobile_no"
                        className="form-input"
                        placeholder="Enter registered mobile number"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier-email">
                        Email address <span className="required">*</span>
                      </label>
                      <input
                        id="supplier-email"
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="business@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier-password">
                        Password <span className="required">*</span>
                      </label>
                      <input
                        id="supplier-password"
                        type="password"
                        name="password"
                        className="form-input"
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier-confirm-password">
                        Confirm password <span className="required">*</span>
                      </label>
                      <input
                        id="supplier-confirm-password"
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="registration-section">
                  <div className="form-group form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input type="checkbox" required disabled={isLoading} />
                      <span className="checkbox-custom"></span>I confirm that the submitted registration details are
                      accurate and I will complete the remaining profile information from the supplier admin panel after
                      login.
                    </label>
                  </div>
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg form-submit-btn"
                      disabled={isLoading}
                    >
                      <i className="fas fa-file-circle-check" aria-hidden="true"></i>
                      {isLoading ? "Creating account…" : "Create supplier account"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <aside className="registration-sidebar">
              <div className="contact-info-card">
                <div className="info-card-header">
                  <i className="fas fa-list-check" aria-hidden="true"></i>
                  <h3>Artisan Onboarding Journey</h3>
                </div>
                <div className="registration-sidebar-body">
                  <div className="supplier-onboarding-timeline">
                    <div className="supplier-onboarding-step onboarding-step-completed">
                      <div className="supplier-onboarding-dot" />
                      <div className="supplier-onboarding-icon-wrap">
                        <i className="fas fa-id-card" aria-hidden="true" />
                      </div>
                      <div className="supplier-onboarding-info">
                        <h4>Step 1: Create Basic Account</h4>
                        <p>Fill out name, mobile number, email, and password to establish your login credentials.</p>
                      </div>
                    </div>

                    <div className="supplier-onboarding-step">
                      <div className="supplier-onboarding-dot" />
                      <div className="supplier-onboarding-icon-wrap">
                        <i className="fas fa-shield-halved" aria-hidden="true" />
                      </div>
                      <div className="supplier-onboarding-info">
                        <h4>Step 2: Authenticate &amp; Login</h4>
                        <p>Log in securely to verify your email and access the supplier admin portal dashboard.</p>
                      </div>
                    </div>

                    <div className="supplier-onboarding-step">
                      <div className="supplier-onboarding-dot" />
                      <div className="supplier-onboarding-icon-wrap">
                        <i className="fas fa-building-user" aria-hidden="true" />
                      </div>
                      <div className="supplier-onboarding-info">
                        <h4>Step 3: Complete Business Profile</h4>
                        <p>Input detailed organizational info, address, manufacturing type, and Udyam/GST certifications.</p>
                      </div>
                    </div>

                    <div className="supplier-onboarding-step">
                      <div className="supplier-onboarding-dot" />
                      <div className="supplier-onboarding-icon-wrap">
                        <i className="fas fa-boxes-packing" aria-hidden="true" />
                      </div>
                      <div className="supplier-onboarding-info">
                        <h4>Step 4: Publish Products</h4>
                        <p>List your ODOP products with images, descriptions, and categories to receive buyer inquiries directly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-card-header">
                  <i className="fas fa-folder-open" aria-hidden="true"></i>
                  <h3>Keep ready</h3>
                </div>
                <div className="registration-sidebar-body">
                  <ul className="registration-note-list">
                    <li>Active mobile number &amp; email inbox</li>
                    <li>Primary contact person legal credentials</li>
                    <li>Business GSTIN or MSME Registration ID</li>
                    <li>Product pictures &amp; descriptions</li>
                  </ul>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="info-card-header">
                  <i className="fas fa-circle-info" aria-hidden="true"></i>
                  <h3>Portal note</h3>
                </div>
                <div className="registration-sidebar-body">
                  <p>
                    Initial registration only takes 1 minute and establishes basic account credentials. Product listing, compliance status, and brochure downloads are managed post-login.
                  </p>
                  <Link href="/contact-us" className="btn btn-outline-secondary w-100">
                    Need registration help
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
