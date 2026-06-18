"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import {
  getStoredUser,
  updateStoredUser,
  type StoredUser,
} from "@/services/auth.service";
import { patchUserProfile, type UpdateUserProfileBody } from "@/services/user.service";
import { ApiError } from "@/lib/api/types";
import { mapApiFieldErrors } from "@/lib/api-field-errors";
import { useLanguage } from "@/components/providers/LanguageProvider";
import UserProfileSkeleton from "@/bones/UserProfileSkeleton";

function displayOrDash(value: unknown): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  return trimmed === "" ? "—" : trimmed;
}

type FieldErrors = Partial<
  Record<"name" | "email" | "current_password" | "password" | "confirm_password", string>
>;

export default function UserProfilePage() {
  const isHi = useLanguage() === "hi";
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
      setLoading(false);
    };
    syncUser();
  }, []);

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  function openEdit() {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFieldErrors({});
    setFormError(null);
    setEditing(true);
  }

  function closeEdit() {
    setEditing(false);
    setFieldErrors({});
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || submitting) return;

    setFieldErrors({});
    setFormError(null);

    // Build dirty fields only.
    const body: UpdateUserProfileBody = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (trimmedName !== (user.name ?? "")) body.name = trimmedName;
    if (trimmedEmail !== (user.email ?? "")) body.email = trimmedEmail;

    // Client-side validation
    const errs: FieldErrors = {};
    if (body.name !== undefined && body.name === "") {
      errs.name = isHi ? "नाम आवश्यक है।" : "Name is required.";
    }
    if (body.email !== undefined && body.email === "") {
      errs.email = isHi ? "ईमेल आवश्यक है।" : "Email is required.";
    }

    if (changePassword) {
      if (!currentPassword) {
        errs.current_password = isHi ? "वर्तमान पासवर्ड आवश्यक है।" : "Current password required";
      }
      if (newPassword.length < 6) {
        errs.password = isHi
          ? "नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए।"
          : "New password must be at least 6 characters.";
      }
      if (newPassword !== confirmPassword) {
        errs.confirm_password = isHi ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match.";
      }
      if (!errs.current_password && !errs.password && !errs.confirm_password) {
        body.password = newPassword;
        body.current_password = currentPassword;
      }
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    if (Object.keys(body).length === 0) {
      toast.info(isHi ? "कोई बदलाव नहीं किया गया।" : "No changes to save.");
      return;
    }

    setSubmitting(true);
    try {
      await patchUserProfile(body);

      const updated = updateStoredUser({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
      });
      if (updated) setUser(updated);

      toast.success(isHi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई।" : "Profile updated successfully");
      closeEdit();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setFieldErrors({
            current_password: isHi ? "वर्तमान पासवर्ड आवश्यक है।" : "Current password required",
          });
        } else if (err.status === 401) {
          setFieldErrors({
            current_password: isHi ? "वर्तमान पासवर्ड गलत है।" : "Current password is incorrect",
          });
        } else if (err.status === 409) {
          setFieldErrors({
            email: isHi ? "यह ईमेल पहले से मौजूद है।" : "Email already exists",
          });
        } else if (err.status === 422) {
          const mapped = mapApiFieldErrors(err.errors) as FieldErrors;
          if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
          else setFormError(err.message);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError(
          isHi ? "प्रोफ़ाइल अपडेट करने में विफल।" : "Failed to update profile."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-content ticket-theme">
      <header className="page-title">
        <span className="eyebrow">{isHi ? "मेरा खाता" : "My Account"}</span>
        <h1>{isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}</h1>
      </header>

      {loading ? (
        <UserProfileSkeleton />
      ) : !user ? (
        <div className="panel">
          <p className="panel-meta">
            {isHi ? "उपयोगकर्ता जानकारी उपलब्ध नहीं है।" : "No user information available."}
          </p>
        </div>
      ) : (
        <div className="panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--secondary)" }}>
                {displayOrDash(user.name)}
              </div>
              <div className="panel-meta" style={{ wordBreak: "break-word" }}>
                {displayOrDash(user.email)}
              </div>
            </div>
            {!editing && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "auto", flexShrink: 0 }}
                onClick={openEdit}
              >
                {isHi ? "प्रोफ़ाइल और पासवर्ड अपडेट करें" : "Update Profile & Password"}
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} noValidate>
              {formError && (
                <p className="grievance-field-error" style={{ marginBottom: 12 }}>
                  {formError}
                </p>
              )}

              <div className="grievance-form-grid">
                <div className="grievance-form-field">
                  <label htmlFor="profile-name">{isHi ? "नाम" : "Name"}</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                  />
                  {fieldErrors.name && (
                    <span className="grievance-field-error">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="grievance-form-field">
                  <label htmlFor="profile-email">{isHi ? "ईमेल" : "Email"}</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                  {fieldErrors.email && (
                    <span className="grievance-field-error">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="grievance-form-field">
                  <label>{isHi ? "मोबाइल नंबर" : "Mobile Number"}</label>
                  <input
                    type="text"
                    value={displayOrDash(user.mobile_no)}
                    readOnly
                    disabled
                    style={{ background: "#f8fafc", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => {
                      setChangePassword(e.target.checked);
                      setFieldErrors((prev) => ({
                        ...prev,
                        current_password: undefined,
                        password: undefined,
                        confirm_password: undefined,
                      }));
                    }}
                    disabled={submitting}
                  />
                  {isHi ? "पासवर्ड बदलें" : "Change Password"}
                </label>
              </div>

              {changePassword && (
                <div className="grievance-form-grid" style={{ marginTop: 16 }}>
                  <div className="grievance-form-field full-span">
                    <label htmlFor="current-password">
                      {isHi ? "वर्तमान पासवर्ड" : "Current Password"}
                    </label>
                    <div className="password-input-wrap">
                      <input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() =>
                          setShowPasswords((p) => ({ ...p, current: !p.current }))
                        }
                        aria-label={
                          showPasswords.current
                            ? isHi
                              ? "पासवर्ड छिपाएं"
                              : "Hide password"
                            : isHi
                              ? "पासवर्ड दिखाएं"
                              : "Show password"
                        }
                        tabIndex={-1}
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {fieldErrors.current_password && (
                      <span className="grievance-field-error">{fieldErrors.current_password}</span>
                    )}
                  </div>

                  <div className="grievance-form-field">
                    <label htmlFor="new-password">{isHi ? "नया पासवर्ड" : "New Password"}</label>
                    <div className="password-input-wrap">
                      <input
                        id="new-password"
                        type={showPasswords.next ? "text" : "password"}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPasswords((p) => ({ ...p, next: !p.next }))}
                        aria-label={
                          showPasswords.next
                            ? isHi
                              ? "पासवर्ड छिपाएं"
                              : "Hide password"
                            : isHi
                              ? "पासवर्ड दिखाएं"
                              : "Show password"
                        }
                        tabIndex={-1}
                      >
                        {showPasswords.next ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <span className="grievance-field-error">{fieldErrors.password}</span>
                    )}
                  </div>

                  <div className="grievance-form-field">
                    <label htmlFor="confirm-password">
                      {isHi ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
                    </label>
                    <div className="password-input-wrap">
                      <input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() =>
                          setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                        }
                        aria-label={
                          showPasswords.confirm
                            ? isHi
                              ? "पासवर्ड छिपाएं"
                              : "Hide password"
                            : isHi
                              ? "पासवर्ड दिखाएं"
                              : "Show password"
                        }
                        tabIndex={-1}
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {fieldErrors.confirm_password && (
                      <span className="grievance-field-error">{fieldErrors.confirm_password}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="grievance-form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeEdit}
                  disabled={submitting}
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting
                    ? isHi
                      ? "सहेजा जा रहा है…"
                      : "Saving…"
                    : isHi
                      ? "बदलाव सहेजें"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grievance-info-grid">
              <div>
                <dt>{isHi ? "नाम" : "Name"}</dt>
                <dd>{displayOrDash(user.name)}</dd>
              </div>
              <div>
                <dt>{isHi ? "ईमेल" : "Email"}</dt>
                <dd>{displayOrDash(user.email)}</dd>
              </div>
              <div>
                <dt>{isHi ? "मोबाइल नंबर" : "Mobile Number"}</dt>
                <dd>{displayOrDash(user.mobile_no)}</dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
