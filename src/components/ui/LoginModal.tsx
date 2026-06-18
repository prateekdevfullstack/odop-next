"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import type { PublicDistrict } from "@/lib/api/districts.types";
import { cfcPortalPath } from "@/lib/cfc/routes";
import { districtAdminLoginPath } from "@/lib/district-admin/routes";
import { ApiError } from "@/lib/api/types";
import * as authService from "@/services/auth.service";
import type { SupplierAuthPayload } from "@/services/auth.service";
import * as cfcAuthService from "@/services/cfc-auth.service";
import { fetchPublicDistricts, publicDistrictSlug } from "@/services/districts.service";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
};

type ModalView = "user-type" | "login" | "register" | "cfc-login" | "district-select";

const LOGIN_MODAL_COPY = {
  en: {
    closeLogin: "Close login",
    selectUserType: "Select User Type",
    selectUserTypeHint: "Choose how you want to sign in to the ODOP portal.",
    generalUser: "General User",
    generalUserHint: "Browse suppliers, register, and access buyer services.",
    cfcUser: "CFC User",
    cfcUserHint: "Sign in to manage your CFC events and monthly metrics.",
    districtAdministrator: "District Administrator",
    districtAdministratorHint: "Official district operations desk access.",
    back: "Back",
    loginTitle: "Login to Your Account",
    registerTitle: "Create Your Account",
    cfcLoginTitle: "CFC Login",
    districtSelectTitle: "District Administrator",
    districtSelectHint: "Select your district to continue to the district login page.",
    selectDistrict: "Select District",
    loadingDistricts: "Loading districts...",
    continueToDistrictLogin: "Continue to District Login",
    selectDistrictFirst: "Please select a district.",
    phoneNumber: "Mob. No.",
    email: "Email",
    password: "Password",
    name: "Name",
    confirmPassword: "Confirm Password",
    signingIn: "Signing In...",
    continue: "Continue",
    noAccount: "Don't have an account?",
    register: "Register",
    registering: "Registering...",
    hasAccount: "Already have an account?",
    login: "Login",
    success: "Success",
    cfcLoginSuccess: "CFC login successful.",
    goToCfcPortal: "Go to CFC Portal",
    authIncomplete: "Authentication did not complete. Please try again.",
    enterPassword: "Please enter your password",
    enterEmail: "Please enter your email",
    enterMobile: "Please enter your mobile number",
    loginFailed: "Login failed. Please check your credentials.",
    cfcLoginFailed: "CFC login failed. Please check your credentials.",
    fillAllFields: "Please fill in all fields",
    passwordMismatch: "Password and confirm password do not match",
    registerFailed: "Registration failed. Please try again.",
    goToDashboard: "Go to Dashboard",
    dashboardReady: "You are logged in. Open your dashboard to view accessed suppliers.",
  },
  hi: {
    closeLogin: "लॉगिन बंद करें",
    selectUserType: "उपयोगकर्ता प्रकार चुनें",
    selectUserTypeHint: "ODOP पोर्टल में साइन इन करने का तरीका चुनें।",
    generalUser: "सामान्य उपयोगकर्ता",
    generalUserHint: "आपूर्तिकर्ता देखें, पंजीकरण करें और खरीदार सेवाएं एक्सेस करें।",
    cfcUser: "CFC उपयोगकर्ता",
    cfcUserHint: "अपने CFC कार्यक्रम और मासिक मेट्रिक्स प्रबंधित करने के लिए साइन इन करें।",
    districtAdministrator: "जिला प्रशासक",
    districtAdministratorHint: "आधिकारिक जिला संचालन डेस्क एक्सेस।",
    back: "वापस",
    loginTitle: "अपने खाते में लॉगिन करें",
    registerTitle: "अपना खाता बनाएं",
    cfcLoginTitle: "CFC लॉगिन",
    districtSelectTitle: "जिला प्रशासक",
    districtSelectHint: "जिला लॉगिन पृष्ठ पर जाने के लिए अपना जिला चुनें।",
    selectDistrict: "जिला चुनें",
    loadingDistricts: "जिले लोड हो रहे हैं...",
    continueToDistrictLogin: "जिला लॉगिन पर जाएं",
    selectDistrictFirst: "कृपया एक जिला चुनें।",
    phoneNumber: "मो. नं.",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "नाम",
    confirmPassword: "पासवर्ड की पुष्टि",
    signingIn: "साइन इन हो रहा है...",
    continue: "जारी रखें",
    noAccount: "खाता नहीं है?",
    register: "पंजीकरण करें",
    registering: "पंजीकरण हो रहा है...",
    hasAccount: "पहले से खाता है?",
    login: "लॉगिन",
    success: "सफल",
    cfcLoginSuccess: "CFC लॉगिन सफल।",
    goToCfcPortal: "CFC पोर्टल पर जाएं",
    authIncomplete: "प्रमाणीकरण पूरा नहीं हुआ। कृपया पुनः प्रयास करें।",
    enterPassword: "कृपया अपना पासवर्ड दर्ज करें",
    enterEmail: "कृपया अपना ईमेल दर्ज करें",
    enterMobile: "कृपया अपना मोबाइल नंबर दर्ज करें",
    loginFailed: "लॉगिन विफल। कृपया अपनी जानकारी जांचें।",
    cfcLoginFailed: "CFC लॉगिन विफल। कृपया अपनी जानकारी जांचें।",
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    passwordMismatch: "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते",
    registerFailed: "पंजीकरण विफल। कृपया पुनः प्रयास करें।",
    goToDashboard: "डैशबोर्ड पर जाएं",
    dashboardReady: "आप लॉग इन हैं। एक्सेस किए गए आपूर्तिकर्ता देखने के लिए डैशबोर्ड खोलें।",
  },
} as const;

function sanitizeMobileInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

function showApiError(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    if (err.status === 422 && err.errors) {
      const first = Object.values(err.errors)[0];
      const msg = Array.isArray(first) ? first[0] : String(first);
      toast.error(msg || err.message);
      return;
    }
    toast.error(err.message || fallback);
    return;
  }
  toast.error(fallback);
}

function parseDistrictList(payload: unknown): PublicDistrict[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as { data?: PublicDistrict[] };
  return Array.isArray(root.data) ? root.data : [];
}

type UserTypeOptionProps = {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
};

function UserTypeOption({ title, description, onClick, disabled }: UserTypeOptionProps) {
  return (
    <button
      type="button"
      className="login-modal-user-type-option"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="login-modal-user-type-option__copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <span className="login-modal-user-type-option__arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

export default function LoginModal({ open, onClose, onAuthSuccess }: LoginModalProps) {
  const lang = useLanguage();
  const router = useRouter();
  const isHi = lang === "hi";
  const t = isHi ? LOGIN_MODAL_COPY.hi : LOGIN_MODAL_COPY.en;

  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ModalView>("user-type");
  const [isLoading, setIsLoading] = useState(false);

  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [cfcEmail, setCfcEmail] = useState("");
  const [cfcPassword, setCfcPassword] = useState("");

  const [districts, setDistricts] = useState<PublicDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const resetFormState = useCallback(() => {
    setView("user-type");
    setLoginMobile("");
    setLoginPassword("");
    setCfcEmail("");
    setCfcPassword("");
    setSelectedDistrictId("");
    setDistricts([]);
    setRegisterName("");
    setRegisterEmail("");
    setRegisterMobile("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setIsLoading(false);
    setDistrictsLoading(false);
  }, []);

  useEffect(() => {
    if (open) return;
    resetFormState();
  }, [open, resetFormState]);

  const loadDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    try {
      const response = await fetchPublicDistricts({
        page: 1,
        limit: 100,
        sort_by: "district_name",
        sort_order: "asc",
      });
      const items = parseDistrictList(response.data);
      setDistricts(items);
    } catch {
      toast.error(isHi ? "जिलों की सूची लोड नहीं हो सकी।" : "Could not load districts. Please try again.");
      setDistricts([]);
    } finally {
      setDistrictsLoading(false);
    }
  }, [isHi]);

  useEffect(() => {
    if (!open || view !== "district-select" || districts.length > 0 || districtsLoading) return;
    void loadDistricts();
  }, [open, view, districts.length, districtsLoading, loadDistricts]);

  const handleAuthSuccess = (body: SupplierAuthPayload) => {
    if (authService.persistSupplierSession(body)) {
      if (authService.isPortalUser()) {
        toast.success(t.dashboardReady, {
          action: {
            label: t.goToDashboard,
            onClick: () => router.push("/user/dashboard"),
          },
        });
      } else {
        toast.success(body.message || t.success);
      }
      onAuthSuccess?.();
      onClose();
      return;
    }
    toast.error(t.authIncomplete);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const password = loginPassword.trim();
    if (!password) {
      toast.error(t.enterPassword);
      return;
    }

    const mobile_no = loginMobile.replace(/\D/g, "").slice(0, 10);
    if (!mobile_no) {
      toast.error(t.enterMobile);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.userLogin({ mobile_no, password });
      handleAuthSuccess(response.data as SupplierAuthPayload);
    } catch (err) {
      showApiError(err, t.loginFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCfcLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = cfcEmail.trim();
    const password = cfcPassword;
    if (!email) {
      toast.error(t.enterEmail);
      return;
    }
    if (!password) {
      toast.error(t.enterPassword);
      return;
    }

    setIsLoading(true);
    try {
      const response = await cfcAuthService.cfcLogin({ email, password });
      if (cfcAuthService.persistCfcLoginFromResponse(response.data)) {
        toast.success(t.cfcLoginSuccess, {
          action: {
            label: t.goToCfcPortal,
            onClick: () => router.push("/cfc/portal"),
          },
        });
        onAuthSuccess?.();
        onClose();
        return;
      }
      toast.error(t.authIncomplete);
    } catch (err) {
      showApiError(err, t.cfcLoginFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCfcUserSelect = () => {
    onClose();
    router.push(cfcPortalPath());
  };

  const handleDistrictContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const district = districts.find((item) => String(item.id) === selectedDistrictId);
    if (!district) {
      toast.error(t.selectDistrictFirst);
      return;
    }
    const slug = publicDistrictSlug(district.districtName);
    onClose();
    router.push(districtAdminLoginPath(slug));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = registerName.trim();
    const email = registerEmail.trim();
    const mobile_no = registerMobile.replace(/\D/g, "").slice(0, 10);
    const password = registerPassword;

    if (!name || !email || !mobile_no || !password) {
      toast.error(t.fillAllFields);
      return;
    }
    if (password !== registerConfirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.userRegister({
        name,
        email,
        mobile_no,
        password,
      });
      handleAuthSuccess(response.data as SupplierAuthPayload);
    } catch (err) {
      showApiError(err, t.registerFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const goToUserType = () => {
    if (isLoading) return;
    setView("user-type");
  };

  const modalTitleId =
    view === "register"
      ? "register-modal-title"
      : view === "cfc-login"
        ? "cfc-login-modal-title"
        : view === "district-select"
          ? "district-select-modal-title"
          : view === "user-type"
            ? "user-type-modal-title"
            : "login-modal-title";

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="modal-overlay login-modal active"
      id="login-register-modal"
      role="presentation"
      aria-hidden={false}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-box login-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-shell login-modal-view" data-login-view={view}>
          <button
            className="modal-close login-modal-close"
            type="button"
            onClick={onClose}
            aria-label={t.closeLogin}
          >
            <IoClose />
          </button>
          <div className="login-modal-brandbar">
            <Image
              src="/assets/img/logo.png"
              alt="ODOP"
              className="login-modal-brand-logo"
              width={160}
              height={50}
            />
          </div>
          <div className="login-modal-panel login-modal-panel--compact">
            <div className="login-modal-formwrap">
              {view !== "user-type" && (
                <button
                  type="button"
                  className="login-modal-back"
                  onClick={goToUserType}
                  disabled={isLoading}
                >
                  <FaArrowLeft aria-hidden="true" />
                  {t.back}
                </button>
              )}

              {view === "user-type" && (
                <>
                  <h2 id="user-type-modal-title">{t.selectUserType}</h2>
                  <p className="login-modal-user-type-hint">{t.selectUserTypeHint}</p>
                  <div className="login-modal-user-type-grid">
                    <UserTypeOption
                      title={t.generalUser}
                      description={t.generalUserHint}
                      onClick={() => setView("login")}
                      disabled={isLoading}
                    />
                    <UserTypeOption
                      title={t.cfcUser}
                      description={t.cfcUserHint}
                      onClick={handleCfcUserSelect}
                      disabled={isLoading}
                    />
                    <UserTypeOption
                      title={t.districtAdministrator}
                      description={t.districtAdministratorHint}
                      onClick={() => setView("district-select")}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              {view === "login" && (
                <>
                  <h2 id="login-modal-title">{t.loginTitle}</h2>
                  <form className="login-modal-form" onSubmit={handleLoginSubmit}>
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="login-mobile-number">
                      <span className="login-modal-field-label login-modal-field-label--abbr">{t.phoneNumber}</span>
                      <input
                        id="login-mobile-number"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={9999999999}
                        autoComplete="tel"
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(sanitizeMobileInput(e.target.value))}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="login-password">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.password}</span>
                      <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <Button
                      className="login-modal-submit w-full !shadow-none hover:!shadow-none"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? t.signingIn : t.continue}
                    </Button>
                  </form>
                  <p className="login-modal-register-copy">
                    {t.noAccount}{" "}
                    <button
                      className="login-modal-register-link"
                      type="button"
                      onClick={() => setView("register")}
                      disabled={isLoading}
                    >
                      {t.register}
                    </button>
                  </p>
                </>
              )}

              {view === "cfc-login" && (
                <>
                  <h2 id="cfc-login-modal-title">{t.cfcLoginTitle}</h2>
                  <form className="login-modal-form" onSubmit={handleCfcLoginSubmit}>
                    <label className="login-modal-field login-modal-field--labeled login-modal-field--full" htmlFor="cfc-login-email">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.email}</span>
                      <input
                        id="cfc-login-email"
                        type="email"
                        autoComplete="email"
                        value={cfcEmail}
                        onChange={(e) => setCfcEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="cfc-login-password">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.password}</span>
                      <input
                        id="cfc-login-password"
                        type="password"
                        autoComplete="current-password"
                        value={cfcPassword}
                        onChange={(e) => setCfcPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <Button
                      className="login-modal-submit w-full !shadow-none hover:!shadow-none"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? t.signingIn : t.continue}
                    </Button>
                  </form>
                </>
              )}

              {view === "district-select" && (
                <>
                  <h2 id="district-select-modal-title">{t.districtSelectTitle}</h2>
                  <p className="login-modal-user-type-hint">{t.districtSelectHint}</p>
                  <form className="login-modal-form" onSubmit={handleDistrictContinue}>
                    <label className="login-modal-field login-modal-field--select" htmlFor="district-admin-select">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.selectDistrict}</span>
                      <select
                        id="district-admin-select"
                        className="login-modal-select"
                        value={selectedDistrictId}
                        onChange={(e) => setSelectedDistrictId(e.target.value)}
                        disabled={isLoading || districtsLoading}
                        required
                      >
                        <option value="">
                          {districtsLoading ? t.loadingDistricts : t.selectDistrict}
                        </option>
                        {districts.map((district) => (
                          <option key={district.id} value={String(district.id)}>
                            {isHi && district.nameHindi ? district.nameHindi : district.districtName}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      className="login-modal-submit w-full !shadow-none hover:!shadow-none"
                      type="submit"
                      disabled={isLoading || districtsLoading || !selectedDistrictId}
                    >
                      {t.continueToDistrictLogin}
                    </Button>
                  </form>
                </>
              )}

              {view === "register" && (
                <>
                  <h2 id="register-modal-title">{t.registerTitle}</h2>
                  <form
                    className="login-modal-form login-modal-form--register"
                    onSubmit={handleRegisterSubmit}
                  >
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="register-name">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.name}</span>
                      <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="register-mobile">
                      <span className="login-modal-field-label login-modal-field-label--abbr">{t.phoneNumber}</span>
                      <input
                        id="register-mobile"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={9999999999}
                        autoComplete="tel"
                        value={registerMobile}
                        onChange={(e) => setRegisterMobile(sanitizeMobileInput(e.target.value))}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label
                      className="login-modal-field login-modal-field--labeled login-modal-field--full"
                      htmlFor="register-email"
                    >
                      <span className="login-modal-field-label login-modal-field-label--full">{t.email}</span>
                      <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label className="login-modal-field login-modal-field--labeled" htmlFor="register-password">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.password}</span>
                      <input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <label className="login-modal-field login-modal-field--labeled login-modal-field--confirm" htmlFor="register-confirm-password">
                      <span className="login-modal-field-label login-modal-field-label--full">{t.confirmPassword}</span>
                      <input
                        id="register-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </label>
                    <Button
                      className="login-modal-submit login-modal-submit--full w-full !shadow-none hover:!shadow-none"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? t.registering : t.register}
                    </Button>
                  </form>
                  <p className="login-modal-register-copy">
                    {t.hasAccount}{" "}
                    <button
                      className="login-modal-register-link"
                      type="button"
                      onClick={() => setView("login")}
                      disabled={isLoading}
                    >
                      {t.login}
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
