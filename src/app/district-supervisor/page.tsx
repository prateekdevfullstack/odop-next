"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { districtSupervisorDashboardPath } from "@/lib/district-supervisor/routes";
import {
  districtSupervisorLogin,
  persistSupervisorLoginFromResponse,
} from "@/services/district-supervisor-auth.service";
import type { DistrictAdminAuthResponse } from "@/types/district-admin";

export default function DistrictAdministratorSupervisorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await districtSupervisorLogin({
        email: email.trim(),
        password,
      });
      const body = response.data as DistrictAdminAuthResponse;
      if (body?.success && persistSupervisorLoginFromResponse(body)) {
        toast.success(body.message || "Login successful");
        router.push(districtSupervisorDashboardPath());
        return;
      }
      toast.error(body?.message || "Login failed. Please check your credentials.");
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="da-login-page">
      <span className="da-login-page__circle da-login-page__circle--tr" aria-hidden="true" />
      <span className="da-login-page__circle da-login-page__circle--br" aria-hidden="true" />

      <div className="da-login-page__inner">
        <div className="da-login-layout">
          <section className="da-login-hero" aria-labelledby="dslp-hero-title">
            <span className="da-login-hero__el da-login-hero__el--tl" aria-hidden="true" />
            <span className="da-login-hero__el da-login-hero__el--br" aria-hidden="true" />

            <div className="da-login-hero__visual" aria-hidden="true">
              <Image
                className="da-login-hero__map"
                src="/assets/img/district-login/up-map-with-products-313b70.png"
                alt=""
                width={618}
                height={584}
                priority
              />
              <div className="da-login-hero__card-slot da-login-hero__card-slot--tl">
                <div className="da-login-hero__card da-login-hero__card--4">
                  <Image
                    src="/assets/img/district-login/product-4-6cee3d.png"
                    alt=""
                    fill
                    sizes="20vw"
                  />
                </div>
              </div>
              <div className="da-login-hero__card-slot da-login-hero__card-slot--ml">
                <div className="da-login-hero__card da-login-hero__card--3">
                  <Image
                    src="/assets/img/district-login/product-3-54cf63.png"
                    alt=""
                    fill
                    sizes="25vw"
                  />
                </div>
              </div>
              <div className="da-login-hero__card-slot da-login-hero__card-slot--tr">
                <div className="da-login-hero__card da-login-hero__card--1">
                  <Image
                    src="/assets/img/district-login/product-1-29158c.png"
                    alt=""
                    fill
                    sizes="25vw"
                  />
                </div>
              </div>
              <div className="da-login-hero__card-slot da-login-hero__card-slot--mr">
                <div className="da-login-hero__card da-login-hero__card--2">
                  <Image
                    src="/assets/img/district-login/product-2-2c5da8.png"
                    alt=""
                    fill
                    sizes="25vw"
                  />
                </div>
              </div>
            </div>

            <div className="da-login-hero__copy">
              <span className="da-login-hero__badge">District Operations Desk</span>
              <h1 id="dslp-hero-title">District Administrator Supervisor</h1>
              <p>Sign in to supervise district administrator activity across ODOP operations.</p>
            </div>
          </section>

          <section className="da-login-form-panel" aria-labelledby="dslp-form-title">
            <div className="da-login-form-logos">
              <Link href="/" aria-label="ODOP home">
                <Image
                  className="dlp-odop-logo"
                  src="/assets/img/logo.png"
                  alt="ODOP logo"
                  width={148}
                  height={76}
                  priority
                />
              </Link>
              <Image
                className="dlp-up-logo"
                src="/assets/img/district-login/up-logo.png"
                alt="Uttar Pradesh emblem"
                width={77}
                height={77}
              />
            </div>

            <div className="da-login-form-body">
              <h2 id="dslp-form-title">Supervisor Login</h2>
              <p className="dlp-subtitle">
                Use your district administrator supervisor credentials.
              </p>

              <form className="da-login-form" onSubmit={handleSubmit} noValidate>
                <div className="da-login-field">
                  <label htmlFor="dslp-email">Email</label>
                  <input
                    className="da-login-input"
                    id="dslp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="supervisor@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="da-login-field">
                  <label htmlFor="dslp-password">Password</label>
                  <input
                    className="da-login-input"
                    id="dslp-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="da-login-form-footer">
                  <p className="dlp-note">
                    Your assigned district is loaded from your supervisor account.
                  </p>
                  <button type="submit" className="da-login-submit" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
