"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authService from "@/services/auth.service";


export default function SupplierLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.supplierLogin({ email, password });

      if (response.success) {
        const result = response.data as any;
        toast.success(result.message || "Login successful!");
        
        // Store auth data
        localStorage.setItem("auth_token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // Redirect to supplier dashboard
        router.push("/supplier/dashboard");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell supplier-theme">
      <div className="auth-wrap">
         <main className="auth-layout">
          <section className="auth-copy">
            <span className="eyebrow">Supplier Operations Desk</span>
            <h1>Supplier Login Portal</h1>
            <p>Sign in to manage your ODOP profile, products, and buyer enquiries.</p>
          </section>

          <section className="auth-card">
            <h2>Supplier Login</h2>
            <p className="panel-meta">Use email, password, and supplier type to continue.</p>
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="supplier-email">Registered Email</label>
                <input
                  className="text-field"
                  id="supplier-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="business@odopsupplier.in"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="supplier-password">Password</label>
                <input
                  className="text-field"
                  id="supplier-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="auth-footer">
                <span className="micro-copy">Complete profile, products, and operations after login.</span>
                <button type="submit" className="btn" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

