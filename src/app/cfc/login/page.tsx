"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/types";
import { cfcPublicListPath, cfcPortalPath } from "@/lib/cfc/routes";
import { isCfcUserLoggedIn } from "@/lib/cfc/session";
import * as cfcAuthService from "@/services/cfc-auth.service";
import { AppToaster } from "@/components/ui/AppToaster";
import "../cfc-portal.css";

export default function CfcLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isCfcUserLoggedIn()) {
      router.replace(cfcPortalPath());
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await cfcAuthService.cfcLogin({
        email: email.trim(),
        password,
      });
      if (cfcAuthService.persistCfcLoginFromResponse(response.data)) {
        toast.success("Login successful.");
        router.push(cfcPortalPath());
        return;
      }
      toast.error("Authentication did not complete. Please try again.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cfc-login-page">
      <div className="cfc-login-card">
        <Link href="/" className="cfc-login-brand">
          <Image src="/assets/img/logo.png" alt="ODOP" width={150} height={48} />
        </Link>
        <h1>CFC Portal Login</h1>
        <p>Sign in with your CFC staff credentials to manage events and monthly metrics.</p>
        <form className="cfc-login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="cfc-login-email">Email</label>
          <input
            id="cfc-login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <label htmlFor="cfc-login-password">Password</label>
          <input
            id="cfc-login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="cfc-login-footnote">
          <Link href={cfcPublicListPath()}>Browse CFC list</Link>
        </p>
      </div>
      <AppToaster />
      <style jsx>{`
        .cfc-login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: linear-gradient(180deg, #fffaf6 0%, #f4f7fb 100%);
        }
        .cfc-login-card {
          width: min(100%, 420px);
          border: 1px solid rgba(27, 60, 114, 0.1);
          border-radius: 20px;
          background: #fff;
          padding: 28px 24px;
          display: grid;
          gap: 12px;
        }
        .cfc-login-brand {
          display: flex;
          justify-content: center;
        }
        .cfc-login-card h1 {
          margin: 0;
          text-align: center;
          color: #1f2a3a;
          font-size: 1.5rem;
        }
        .cfc-login-card p {
          margin: 0;
          text-align: center;
          color: #7b8798;
        }
        .cfc-login-form {
          display: grid;
          gap: 8px;
          margin-top: 8px;
        }
        .cfc-login-form label {
          font-weight: 600;
          color: #4b5565;
        }
        .cfc-login-form input {
          min-height: 44px;
          border: 1px solid rgba(27, 60, 114, 0.14);
          border-radius: 12px;
          padding: 10px 12px;
        }
        .cfc-login-footnote {
          margin: 8px 0 0;
          text-align: center;
          font-size: 0.92rem;
        }
      `}</style>
    </div>
  );
}
