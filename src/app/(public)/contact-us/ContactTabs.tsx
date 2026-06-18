"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ODOP_CONTACT, ODOP_CONTACT_HI } from "@/lib/odop-contact";
import type { Scheme } from "@/lib/schemes";
import {
  fetchSchemesList,
  fetchSchemeQueryOptions,
  submitSchemeGrievance,
  type SchemeQueryOption,
} from "@/services/schemes.service";
import {
  fetchPublicDistricts,
  parsePublicDistrictListResponse,
} from "@/services/districts.service";
import {
  submitContactEnquiry,
  listPublicEnquiryQueryCategories,
} from "@/services/user-contact-enquiry.service";
import LoginModal from "@/components/ui/LoginModal";
import FormSelect from "@/components/ui/FormSelect";
import { mapApiFieldErrors } from "@/lib/api-field-errors";
import type { EnquiryQueryCategoryOption } from "@/types/contact-enquiry";
import type { PublicDistrict } from "@/lib/api/districts.types";
import { ApiError } from "@/lib/api";

const MAX_CONTACT_MESSAGE = 5000;

const ACCENT = "#C54814";

const CONTACT_COPY = {
  en: {
    tabContact: "Contact Us",
    tabScheme: "Scheme Related Queries",
    emailSupport: "Email",
    addressLabel: "Address",
    headOfficeAddress: ODOP_CONTACT.address.full,
    formTitle: "Submit an Official Enquiry",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    fullNameError: "Please enter your name",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "10-digit mobile number",
    mobileError: "Enter a valid 10-digit number",
    emailAddress: "Email Address",
    emailError: "Enter a valid email address",
    district: "District",
    districtPlaceholder: "-- Select Your District --",
    districtError: "Please select your district",
    requiredField: "This field is required",
    subjectCategory: "Subject / Category",
    subjectPlaceholder: "-- Select Query Category --",
    subjectError: "Please select a subject",
    organization: "Organization / Business Name",
    organizationPlaceholder: "Your company or craft unit name",
    yourMessage: "Your Message",
    messagePlaceholder: "Describe your query or requirement in detail...",
    messageError: "Please enter your message",
    consentPrefix: "I agree that the ODOP team may contact me via phone/email regarding my query. I have read the",
    privacyPolicy: "Privacy Policy",
    consentError: "Please accept the terms to proceed",
    submitEnquiry: "Submit Enquiry",
    submitting: "Submitting...",
    contactSubmitError: "Could not submit your enquiry. Please try again.",
    ticketLabel: "Ticket Number",
    statusLabel: "Status",
    viewMyEnquiries: "View my enquiries",
    successTitle: "Thank You! Your message has been sent.",
    successMessage: "Our team will respond within 2 business days. For urgent queries, email:",
    schemeFormTitle: "Submit a Scheme Related Query",
    scheme: "Select Scheme",
    schemePlaceholder: "-- Select a Scheme --",
    schemeError: "Please select a scheme",
    queryType: "Select Query",
    queryPlaceholder: "-- Select Query Type --",
    queryLoading: "Loading queries...",
    queryOther: "Other",
    queryError: "Please select a query type",
    attachment: "Attachment",
    attachmentHint: "Optional. PDF or image.",
    schemeSubmitting: "Submitting...",
    schemeSuccess: "Your scheme related enquiry has been submitted successfully. Our team will get back to you soon.",
    schemeSubmitError: "Could not submit your scheme related enquiry. Please try again.",
    subjects: [
      "Artisan / Supplier Registration",
      "Government Scheme Query",
      "Product Export Assistance",
      "Bulk Purchase / Sourcing",
      "GI Tag Registration",
      "Financial Assistance / Loan",
      "Skill Training Query",
      "Digital Platform Listing",
      "Portal Technical Issue",
      "Media / Research Query",
      "Other",
    ],
  },
  hi: {
    tabContact: "संपर्क करें",
    tabScheme: "योजना संबंधी पूछताछ",
    emailSupport: "ईमेल",
    addressLabel: "पता",
    headOfficeAddress: ODOP_CONTACT_HI.address.full,
    formTitle: "आधिकारिक पूछताछ जमा करें",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    fullNameError: "कृपया अपना नाम दर्ज करें",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    mobileError: "कृपया मान्य 10 अंकों का नंबर दर्ज करें",
    emailAddress: "ईमेल पता",
    emailError: "कृपया मान्य ईमेल पता दर्ज करें",
    district: "जिला",
    districtPlaceholder: "-- अपना जिला चुनें --",
    districtError: "कृपया अपना जिला चुनें",
    requiredField: "यह फ़ील्ड आवश्यक है",
    subjectCategory: "विषय / श्रेणी",
    subjectPlaceholder: "-- पूछताछ श्रेणी चुनें --",
    subjectError: "कृपया विषय चुनें",
    organization: "संस्था / व्यवसाय का नाम",
    organizationPlaceholder: "आपकी कंपनी या शिल्प इकाई का नाम",
    yourMessage: "आपका संदेश",
    messagePlaceholder: "अपनी पूछताछ या आवश्यकता का विस्तार से वर्णन करें...",
    messageError: "कृपया अपना संदेश दर्ज करें",
    consentPrefix:
      "मैं सहमत हूँ कि ओडीओपी टीम मेरी पूछताछ के संबंध में फोन/ईमेल के माध्यम से मुझसे संपर्क कर सकती है। मैंने",
    privacyPolicy: "गोपनीयता नीति",
    consentError: "आगे बढ़ने के लिए कृपया शर्तें स्वीकार करें",
    submitEnquiry: "पूछताछ जमा करें",
    submitting: "जमा किया जा रहा है...",
    contactSubmitError: "आपकी पूछताछ जमा नहीं की जा सकी। कृपया पुनः प्रयास करें।",
    ticketLabel: "टिकट संख्या",
    statusLabel: "स्थिति",
    viewMyEnquiries: "मेरी पूछताछ देखें",
    successTitle: "धन्यवाद! आपका संदेश भेज दिया गया है।",
    successMessage: "हमारी टीम 2 कार्य दिवसों में उत्तर देगी। तत्काल पूछताछ के लिए ईमेल करें:",
    schemeFormTitle: "योजना संबंधी पूछताछ जमा करें",
    scheme: "योजना चुनें",
    schemePlaceholder: "-- योजना चुनें --",
    schemeError: "कृपया योजना चुनें",
    queryType: "पूछताछ चुनें",
    queryPlaceholder: "-- पूछताछ प्रकार चुनें --",
    queryLoading: "पूछताछ लोड हो रही हैं...",
    queryOther: "अन्य",
    queryError: "कृपया पूछताछ प्रकार चुनें",
    attachment: "अनुलग्नक",
    attachmentHint: "वैकल्पिक। पीडीएफ या छवि।",
    schemeSubmitting: "जमा किया जा रहा है...",
    schemeSuccess: "आपकी शिकायत सफलतापूर्वक जमा कर दी गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
    schemeSubmitError: "आपकी शिकायत जमा नहीं की जा सकी। कृपया पुनः प्रयास करें।",
    subjects: [
      "कारीगर / आपूर्तिकर्ता पंजीकरण",
      "सरकारी योजना संबंधी पूछताछ",
      "उत्पाद निर्यात सहायता",
      "थोक खरीद / सोर्सिंग",
      "जीआई टैग पंजीकरण",
      "वित्तीय सहायता / ऋण",
      "कौशल प्रशिक्षण संबंधी पूछताछ",
      "डिजिटल प्लेटफॉर्म सूचीकरण",
      "पोर्टल तकनीकी समस्या",
      "मीडिया / अनुसंधान संबंधी पूछताछ",
      "अन्य",
    ],
  },
} as const;

type ContactTabsProps = { isHi: boolean };

export default function ContactTabs({ isHi }: ContactTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = isHi ? CONTACT_COPY.hi : CONTACT_COPY.en;
  const [activeTab, setActiveTab] = useState<"contact" | "scheme">(
    searchParams.get("tab") === "scheme" ? "scheme" : "contact"
  );
  const [loginOpen, setLoginOpen] = useState(false);

  const [categories, setCategories] = useState<EnquiryQueryCategoryOption[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prefill, setPrefill] = useState<{
    full_name: string;
    mobile_number: string;
    email: string;
  }>({ full_name: "", mobile_number: "", email: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactFormError, setContactFormError] = useState("");

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("");
  const [queryOptions, setQueryOptions] = useState<SchemeQueryOption[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [districts, setDistricts] = useState<PublicDistrict[]>([]);
  const [schemeSubmitting, setSchemeSubmitting] = useState(false);
  const [schemeSubmitState, setSchemeSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [schemeSubmitError, setSchemeSubmitError] = useState("");
  const [schemeErrors, setSchemeErrors] = useState<Record<string, string>>({});

  const districtName = (d: PublicDistrict) =>
    (isHi && d.nameHindi ? d.nameHindi : d.districtName) || d.districtName;

  const schemeName = (s: Scheme) => (isHi && s.nameHindi ? s.nameHindi : s.name);
  const queryLabel = (q: SchemeQueryOption) =>
    (isHi ? q.title_hindi || q.name_hindi : null) ||
    q.query_title ||
    q.title ||
    q.name ||
    q.label ||
    q.question ||
    String(q.id);

  useEffect(() => {
    let active = true;
    fetchSchemesList({ skipAuth: true })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setSchemes(list.filter((s) => s.schemeType === "ODOP"));
      })
      .catch((err) => console.error("Failed to load schemes", err));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSchemeId) return;
    let active = true;
    async function loadQueries() {
      setQueriesLoading(true);
      try {
        const res = await fetchSchemeQueryOptions(selectedSchemeId, { skipAuth: true });
        if (active) setQueryOptions(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        if (active) setQueryOptions([]);
        console.error("Failed to load scheme queries", err);
      } finally {
        if (active) setQueriesLoading(false);
      }
    }
    loadQueries();
    return () => {
      active = false;
    };
  }, [selectedSchemeId]);

  useEffect(() => {
    let active = true;
    async function loadDistricts() {
      try {
        const res = await fetchPublicDistricts({ page: 1, limit: 100, sort_by: "district_name", sort_order: "asc" });
        const parsed = parsePublicDistrictListResponse(res.data);
        if (active) setDistricts(parsed.items);
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    }
    loadDistricts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Sync auth state from localStorage after mount to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem("auth_token"));
    // Prefill name/mobile/email for logged-in users from the stored user object.
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw) as {
          name?: string;
          email?: string;
          mobile_no?: string;
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrefill({
          full_name: user.name ?? "",
          mobile_number: user.mobile_no ?? "",
          email: user.email ?? "",
        });
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    listPublicEnquiryQueryCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch((err) => console.error("Failed to load query categories", err));
    return () => {
      active = false;
    };
  }, []);

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = new FormData(form);
    const str = (key: string) => String(raw.get(key) ?? "").trim();

    const fullName = str("full_name");
    const mobile = str("mobile_number");
    const email = str("email");
    const districtId = str("district_id");
    const message = str("message");
    const queryCategoryId = str("query_category_id");
    const organizationName = str("organization_name");
    const consent = raw.get("contactConsent") != null;

    // Client-side required-field validation (form has noValidate).
    const errors: Record<string, string> = {};
    if (!fullName) errors.full_name = text.requiredField;
    if (!mobile) errors.mobile_number = text.requiredField;
    else if (!/^[0-9]{10}$/.test(mobile)) errors.mobile_number = text.mobileError;
    if (!email) errors.email = text.requiredField;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = text.emailError;
    if (!districtId) errors.district_id = text.requiredField;
    if (!message) errors.message = text.requiredField;
    if (!organizationName) errors.organization_name = text.requiredField;
    if (!consent) errors.contactConsent = text.consentError;

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      setContactFormError("");
      // All validation errors (including consent) show inline only — no toast.
      return;
    }

    setContactSubmitting(true);
    setContactErrors({});
    setContactFormError("");
    try {
      const res = await submitContactEnquiry(
        {
          full_name: fullName,
          mobile_number: mobile,
          email,
          district_id: Number(districtId),
          query_category_id: queryCategoryId ? Number(queryCategoryId) : undefined,
          organization_name: organizationName || undefined,
          message,
        },
        { skipAuthRedirect: true }
      );

      if (!res.data) {
        setContactFormError(text.contactSubmitError);
        toast.error(text.contactSubmitError);
        return;
      }

      form.reset();
      toast.success(
        res.message ||
          `${text.ticketLabel}: ${res.data.ticket_number} · ${text.statusLabel}: ${res.data.status}`
      );

      // Logged-in users get routed to their enquiry detail; guests see the ticket inline.
      if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
        router.push(`/user/contact-enquiries/${res.data.id}`);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setLoginOpen(true);
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message || text.contactSubmitError
          : text.contactSubmitError;
      if (err instanceof ApiError && err.errors) {
        setContactErrors(
          mapApiFieldErrors(err.errors as Record<string, string[] | string>)
        );
      }
      setContactFormError(message);
      toast.error(message);
    } finally {
      setContactSubmitting(false);
    }
  }

  async function handleSchemeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = new FormData(form);
    const str = (key: string) => String(raw.get(key) ?? "").trim();

    // Client-side required-field validation (form has noValidate).
    const fullName = str("full_name");
    const mobile = str("mobile_number");
    const email = str("email");
    const districtId = str("district_id");
    const schemeId = str("scheme_id");
    const queryType = str("scheme_query_id");
    const description = str("description");

    const errors: Record<string, string> = {};
    if (!fullName) errors.full_name = text.requiredField;
    if (!mobile) errors.mobile_number = text.requiredField;
    else if (!/^[0-9]{10}$/.test(mobile)) errors.mobile_number = text.mobileError;
    if (!email) errors.email = text.requiredField;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = text.emailError;
    if (!districtId) errors.district_id = text.requiredField;
    if (!schemeId) errors.scheme_id = text.requiredField;
    if (!queryType) errors.scheme_query_id = text.requiredField;
    if (!description) errors.description = text.requiredField;

    if (Object.keys(errors).length > 0) {
      setSchemeErrors(errors);
      setSchemeSubmitState("idle");
      setSchemeSubmitError("");
      return;
    }
    setSchemeErrors({});

    // Build a clean JSON payload: only fields the API whitelists.
    const payload: Record<string, string | number> = {
      full_name: fullName,
      email,
      mobile_number: mobile,
      scheme_id: schemeId,
      description,
      district_id: Number(districtId),
    };
    // Drop non-numeric query id (e.g. "other") so the server gets a clean payload.
    if (queryType !== "other") payload.scheme_query_id = Number(queryType);
    setSchemeSubmitting(true);
    setSchemeSubmitState("idle");
    setSchemeSubmitError("");
    try {
      await submitSchemeGrievance(payload, { skipAuthRedirect: true });
      setSchemeSubmitState("success");
      form.reset();
      setSelectedSchemeId("");
      setQueryOptions([]);
      toast.success(text.schemeSuccess);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setLoginOpen(true);
        return;
      }
      const message =
        err instanceof ApiError ? err.message || text.schemeSubmitError : text.schemeSubmitError;
      setSchemeSubmitState("error");
      setSchemeSubmitError(message);
      toast.error(message);
    } finally {
      setSchemeSubmitting(false);
    }
  }

  const tabStyle = (active: boolean) =>
    active
      ? { color: ACCENT, borderBottom: `3px solid ${ACCENT}` }
      : { color: ACCENT, borderBottom: "3px solid transparent" };

  return (
    <main className="cfc-page section contact-page">
      <div className="container">
        <div className="cfc-capsule-heading-wrap">
          <div
            className="contact-tabs"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "center",
              gap: "8px",
              borderBottom: "1px solid #F3D9C4",
            }}
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "contact"}
              onClick={() => setActiveTab("contact")}
              className="contact-tab-btn"
              style={{
                flex: "1 1 0",
                minWidth: 0,
                padding: "clamp(8px, 2vw, 12px) clamp(6px, 2vw, 24px)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(0.85rem, 3.2vw, 35px)",
                fontWeight: 800,
                lineHeight: 1.15,
                textTransform: "uppercase",
                background: "transparent",
                cursor: "pointer",
                ...tabStyle(activeTab === "contact"),
              }}
            >
              {text.tabContact}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "scheme"}
              onClick={() => setActiveTab("scheme")}
              className="contact-tab-btn"
              style={{
                flex: "1 1 0",
                minWidth: 0,
                padding: "clamp(8px, 2vw, 12px) clamp(6px, 2vw, 24px)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(0.85rem, 3.2vw, 35px)",
                fontWeight: 800,
                lineHeight: 1.15,
                textTransform: "uppercase",
                background: "transparent",
                cursor: "pointer",
                ...tabStyle(activeTab === "scheme"),
              }}
            >
              {text.tabScheme}
            </button>
          </div>
        </div>

        <div className="contact-grid">
          <aside className="contact-info-cards">
            <div className="contact-card">
              <div className="contact-card-icon orange">
                <i className="fas fa-envelope" aria-hidden="true" />
              </div>
              <div>
                <h4>{text.emailSupport}</h4>
                <p>
                  <a href={`mailto:${ODOP_CONTACT.email}`}>{ODOP_CONTACT.email}</a>
                </p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon green">
                <i className="fas fa-location-dot" aria-hidden="true" />
              </div>
              <div>
                <h4>{text.addressLabel}</h4>
                <p>{text.headOfficeAddress}</p>
              </div>
            </div>
          </aside>

          {activeTab === "contact" && (
            <div className="contact-form-panel">
              <div
                className="form-panel-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
              >
                <h2>{text.formTitle}</h2>
                {isLoggedIn ? (
                  <Link
                    href="/user/contact-enquiries"
                    className="btn btn-outline"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <i className="fas fa-list" aria-hidden="true" /> {text.viewMyEnquiries}
                  </Link>
                ) : null}
              </div>
              <form className="contact-form" id="contactForm" onSubmit={handleContactSubmit} noValidate>
                <div className="form-row">
                  <div className={`form-group${contactErrors.full_name ? " has-error" : ""}`}>
                    <label htmlFor="contactName" className="form-label">
                      {text.fullName} <span className="required">*</span>
                    </label>
                    <input
                      key={`name-${prefill.full_name}`}
                      type="text"
                      id="contactName"
                      name="full_name"
                      className="form-input"
                      placeholder={text.fullNamePlaceholder}
                      defaultValue={prefill.full_name}
                      maxLength={255}
                      required
                    />
                    <span className="form-error">
                      {contactErrors.full_name ?? text.fullNameError}
                    </span>
                  </div>
                  <div className={`form-group${contactErrors.mobile_number ? " has-error" : ""}`}>
                    <label htmlFor="contactMobile" className="form-label">
                      {text.mobileNumber} <span className="required">*</span>
                    </label>
                    <input
                      key={`mobile-${prefill.mobile_number}`}
                      type="tel"
                      id="contactMobile"
                      name="mobile_number"
                      className="form-input"
                      placeholder={text.mobilePlaceholder}
                      defaultValue={prefill.mobile_number}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                    <span className="form-error">
                      {contactErrors.mobile_number ?? text.mobileError}
                    </span>
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-group${contactErrors.email ? " has-error" : ""}`}>
                    <label htmlFor="contactEmail" className="form-label">
                      {text.emailAddress} <span className="required">*</span>
                    </label>
                    <input
                      key={`email-${prefill.email}`}
                      type="email"
                      id="contactEmail"
                      name="email"
                      className="form-input"
                      placeholder="your@email.com"
                      defaultValue={prefill.email}
                      maxLength={255}
                      required
                    />
                    <span className="form-error">
                      {contactErrors.email ?? text.emailError}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactDistrict" className="form-label">
                      {text.district} <span className="required">*</span>
                    </label>
                    <FormSelect
                      id="contactDistrict"
                      name="district_id"
                      required
                      placeholder={text.districtPlaceholder}
                      hasError={!!contactErrors.district_id}
                      options={districts.map((d) => ({
                        value: String(d.id),
                        label: districtName(d),
                      }))}
                    />
                    {contactErrors.district_id ? (
                      <span className="form-error" style={{ display: "block" }}>
                        {contactErrors.district_id}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contactSubject" className="form-label">
                    {text.subjectCategory}
                  </label>
                  <FormSelect
                    id="contactSubject"
                    name="query_category_id"
                    placeholder={text.subjectPlaceholder}
                    hasError={!!contactErrors.query_category_id}
                    options={categories.map((c) => ({
                      value: String(c.id),
                      label: c.category_title,
                    }))}
                  />
                  {contactErrors.query_category_id ? (
                    <span className="form-error" style={{ display: "block" }}>
                      {contactErrors.query_category_id}
                    </span>
                  ) : null}
                </div>
                <div className={`form-group${contactErrors.organization_name ? " has-error" : ""}`}>
                  <label htmlFor="contactOrganization" className="form-label">
                    {text.organization} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactOrganization"
                    name="organization_name"
                    className="form-input"
                    placeholder={text.organizationPlaceholder}
                    maxLength={255}
                    required
                  />
                  {contactErrors.organization_name ? (
                    <span className="form-error" style={{ display: "block" }}>
                      {contactErrors.organization_name}
                    </span>
                  ) : null}
                </div>
                <div className={`form-group${contactErrors.message ? " has-error" : ""}`}>
                  <label htmlFor="contactMessage" className="form-label">
                    {text.yourMessage} <span className="required">*</span>
                  </label>
                  <textarea
                    id="contactMessage"
                    name="message"
                    className="form-input form-textarea"
                    rows={5}
                    maxLength={MAX_CONTACT_MESSAGE}
                    placeholder={text.messagePlaceholder}
                    required
                  />
                  <span className="form-error">
                    {contactErrors.message ?? text.messageError}
                  </span>
                </div>
                <div className={`form-group form-checkbox-group${contactErrors.contactConsent ? " has-error" : ""}`}>
                  <label className="form-checkbox-label">
                    <input type="checkbox" id="contactConsent" name="contactConsent" required />
                    <span className="checkbox-custom" />
                    {text.consentPrefix}{" "}
                    <a href="#">{text.privacyPolicy}</a>.
                  </label>
                  <span className="form-error">{text.consentError}</span>
                </div>
                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg form-submit-btn"
                    id="contactSubmitBtn"
                    disabled={contactSubmitting}
                  >
                    <i className="fas fa-paper-plane" aria-hidden="true" />{" "}
                    {contactSubmitting ? text.submitting : text.submitEnquiry}
                  </button>
                </div>
                {contactFormError ? (
                  <p className="form-error" style={{ display: "block", marginTop: "12px" }}>
                    {contactFormError}
                  </p>
                ) : null}
              </form>
            </div>
          )}

          {activeTab === "scheme" && (
            <div className="contact-form-panel">
              <div className="form-panel-header">
                <h2>{text.schemeFormTitle}</h2>
              </div>
              <form className="contact-form" id="schemeQueryForm" onSubmit={handleSchemeSubmit} noValidate>
                <div className="form-row">
                  <div className={`form-group${schemeErrors.full_name ? " has-error" : ""}`}>
                    <label htmlFor="schemeName" className="form-label">
                      {text.fullName} <span className="required">*</span>
                    </label>
                    <input
                      key={`scheme-name-${prefill.full_name}`}
                      type="text"
                      id="schemeName"
                      name="full_name"
                      className="form-input"
                      placeholder={text.fullNamePlaceholder}
                      defaultValue={prefill.full_name}
                      maxLength={255}
                      required
                    />
                    <span className="form-error">{schemeErrors.full_name ?? text.fullNameError}</span>
                  </div>
                  <div className={`form-group${schemeErrors.mobile_number ? " has-error" : ""}`}>
                    <label htmlFor="schemeMobile" className="form-label">
                      {text.mobileNumber} <span className="required">*</span>
                    </label>
                    <input
                      key={`scheme-mobile-${prefill.mobile_number}`}
                      type="tel"
                      id="schemeMobile"
                      name="mobile_number"
                      className="form-input"
                      placeholder={text.mobilePlaceholder}
                      defaultValue={prefill.mobile_number}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                    <span className="form-error">{schemeErrors.mobile_number ?? text.mobileError}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-group${schemeErrors.email ? " has-error" : ""}`}>
                    <label htmlFor="schemeEmail" className="form-label">
                      {text.emailAddress} <span className="required">*</span>
                    </label>
                    <input
                      key={`scheme-email-${prefill.email}`}
                      type="email"
                      id="schemeEmail"
                      name="email"
                      className="form-input"
                      placeholder="your@email.com"
                      defaultValue={prefill.email}
                      maxLength={255}
                      required
                    />
                    <span className="form-error">{schemeErrors.email ?? text.emailError}</span>
                  </div>
                  <div className={`form-group${schemeErrors.district_id ? " has-error" : ""}`}>
                    <label htmlFor="schemeDistrict" className="form-label">
                      {text.district} <span className="required">*</span>
                    </label>
                    <FormSelect
                      id="schemeDistrict"
                      name="district_id"
                      required
                      placeholder={text.districtPlaceholder}
                      hasError={!!schemeErrors.district_id}
                      options={districts.map((d) => ({
                        value: String(d.id),
                        label: districtName(d),
                      }))}
                    />
                    {schemeErrors.district_id ? (
                      <span className="form-error" style={{ display: "block" }}>
                        {schemeErrors.district_id}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-group${schemeErrors.scheme_id ? " has-error" : ""}`}>
                    <label htmlFor="schemeSelect" className="form-label">
                      {text.scheme} <span className="required">*</span>
                    </label>
                    <FormSelect
                      id="schemeSelect"
                      name="scheme_id"
                      required
                      placeholder={text.schemePlaceholder}
                      hasError={!!schemeErrors.scheme_id}
                      value={selectedSchemeId}
                      onValueChange={(v) => {
                        setSelectedSchemeId(v);
                        setQueryOptions([]);
                      }}
                      options={schemes.map((s) => ({
                        value: String(s.id),
                        label: schemeName(s),
                      }))}
                    />
                    <span className="form-error">{schemeErrors.scheme_id ?? text.schemeError}</span>
                  </div>
                  <div className={`form-group${schemeErrors.scheme_query_id ? " has-error" : ""}`}>
                    <label htmlFor="schemeQueryType" className="form-label">
                      {text.queryType} <span className="required">*</span>
                    </label>
                    <FormSelect
                      id="schemeQueryType"
                      name="scheme_query_id"
                      required
                      disabled={!selectedSchemeId || queriesLoading}
                      placeholder={queriesLoading ? text.queryLoading : text.queryPlaceholder}
                      hasError={!!schemeErrors.scheme_query_id}
                      options={[
                        ...queryOptions.map((q) => ({
                          value: String(q.id),
                          label: queryLabel(q),
                        })),
                        ...(selectedSchemeId && !queriesLoading
                          ? [{ value: "other", label: text.queryOther }]
                          : []),
                      ]}
                    />
                    <span className="form-error">{schemeErrors.scheme_query_id ?? text.queryError}</span>
                  </div>
                </div>
                <div className={`form-group${schemeErrors.description ? " has-error" : ""}`}>
                  <label htmlFor="schemeMessage" className="form-label">
                    {text.yourMessage} <span className="required">*</span>
                  </label>
                  <textarea
                    id="schemeMessage"
                    name="description"
                    className="form-input form-textarea"
                    rows={5}
                    maxLength={MAX_CONTACT_MESSAGE}
                    placeholder={text.messagePlaceholder}
                    required
                  />
                  <span className="form-error">{schemeErrors.description ?? text.messageError}</span>
                </div>
                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg form-submit-btn"
                    id="schemeSubmitBtn"
                    disabled={schemeSubmitting}
                  >
                    <i className="fas fa-paper-plane" aria-hidden="true" />{" "}
                    {schemeSubmitting ? text.schemeSubmitting : text.submitEnquiry}
                  </button>
                </div>
                {schemeSubmitState === "error" && (
                  <p className="form-error" style={{ display: "block", marginTop: "12px" }}>
                    {schemeSubmitError || text.schemeSubmitError}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onAuthSuccess={() => setIsLoggedIn(true)}
      />
    </main>
  );
}
