"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaSignInAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaChevronDown, FaEnvelope, FaLandmark, FaTicket } from "react-icons/fa6";
import styles from "@/styles/Navbar.module.css";
import LoginModal from "@/components/ui/LoginModal";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { getVisiblePathname, localizePathname, setLocaleCookie, type Language } from "@/lib/locale";
import type { DistrictProduct } from "@/components/DistrictProductCard";
import {
    fetchPublicDistricts,
    mapPublicDistrictToCard,
    parsePublicDistrictListResponse,
} from "@/services/districts.service";
import { ApiError } from "@/lib/api/types";
import { getStoredUser, isUserLoggedIn, logout as clearAuthSession } from "@/services/auth.service";
import { cfcLogout } from "@/services/cfc-auth.service";
import { getCfcUser, isCfcUserLoggedIn } from "@/lib/cfc/session";
import { cfcPortalPath, cfcPortalProfilePath } from "@/lib/cfc/routes";
import { AUTH_CHANGE_EVENT } from "@/lib/auth-events";

/** Matches responsive breakpoint used across the portal */
const MOBILE_MQ = "(max-width: 1199px)";
const FONT_SCALE_STORAGE_KEY = "odop-font-scale";
const DEFAULT_FONT_SCALE = 100;
const MIN_FONT_SCALE = 90;
const MAX_FONT_SCALE = 120;
const FONT_SCALE_STEP = 5;
const COFFEE_TABLE_BOOK_PDF = "/assets/document/pdf-attachment/Coffee-Table-Book_040424.pdf";
const FLIPKART_MOU_PDF = "/assets/document/MOUs/MoU_Filpkart_07_Aug_2020.pdf";
const IIP_MOU_PDF = "/assets/document/MOUs/MoU_IIP_27_June_2023.pdf";
const SIDBI_MOU_PDF = "/assets/document/MOUs/MoU_SIDBI_17_Sep_2020.pdf";

const NAV_COPY = {
    en: {
        skipToMainContent: "Skip to Main Content",
        screenReaderAccess: "Screen Reader Access",
        // sitemap: "Sitemap",
        adjustFontSize: "Adjust font size",
        decreaseFontSize: "Decrease font size",
        resetFontSize: "Reset font size",
        increaseFontSize: "Increase font size",
        selectLanguage: "Select language",
        accountRole: "Account Role",
        dashboard: "Dashboard",
        grievances: "Scheme Queries",
        myEnquiries: "My Enquiries",
        products: "Products",
        enquiries: "Enquiries",
        myProfile: "My Profile",
        cfcPortal: "CFC Portal",
        cfcProfile: "CFC Profile",
        signOut: "Sign Out",
        loginRegister: "Login / Register",
        about: "About",
        odopProgramme: "ODOP Programme",
        odopCell: "ODOP Cell",
        governmentOrders: "ODOP Government Orders",
        odopProducts: "ODOP Products",
        searchDistrictPlaceholder: "Search district...",
        searchDistrictAria: "Search district",
        searchResults: "District search results",
        searching: "Searching...",
        noDistrictsFound: "No districts found.",
        schemesPolicies: "Schemes & Policies",
        odopSchemes: "ODOP Schemes & Policies",
        msmeSchemes: "MSME Schemes & Policies",
        emarketplaces: "E-Marketplaces",
        odopMart: "ODOP Mart",
        flipkartStore: "ODOP Flipkart Store",
        amazonStore: "ODOP Amazon store",
        exhibitionsFairs: "Exhibitions & Fairs",
        pastEvents: "Past Events",
        notifiedList: "Notified List of Exhibitions and Fairs",
        keyPartners: "Key Partners",
        media: "Media",
        photoGallery: "Photo Gallery",
        videoGallery: "Video Gallery",
        odopInNews: "ODOP in News",
        knowledgeHub: "Knowledge Hub",
        listOfCFCs: "List of CFCs",
        productDSRs: "Product DSRs",
        successStories: "Success Stories",
        deaps: "District Export Action Plans (DEAPs)",
        coffeeTableBooks: "Coffee Table Books (CTBs)",
        qciCompendiums: "QCI Compendiums",
        nablLabs: "List of NABL Labs",
        documentary: "Documentary",
        productVideo: "Product Video",
        contactUs: "Contact Us",
        partnerUphdmc: "Uttar Pradesh Handicraft Development and Marketing Corporation (UPHDMC)",
        partnerUptpa: "Uttar Pradesh Trade Promotion Authority (UPTPA)",
        partnerFfdc: "Fragrance & Flavour Development Centre (FFDC)",
        partnerPpdc: "Process & Product Development Centre (PPDC)",
        partnerMhsc: "(MHSC)",
        partnerAtdc: "Apparel Training & Design Centre (ATDC)",
        partnerCftri: "Central Food Technological Research Institute (CFTRI)",
        partnerUpid: "Unified Payments Interface Identifier (UPID)",
        partnerUpepc: "Uttar Pradesh Export Promotion Council (UPEPC)",
    },
    hi: {
        skipToMainContent: "मुख्य सामग्री पर जाएं",
        screenReaderAccess: "स्क्रीन रीडर एक्सेस",
        // sitemap: "साइटमैप",
        adjustFontSize: "फ़ॉन्ट आकार बदलें",
        decreaseFontSize: "फ़ॉन्ट आकार घटाएं",
        resetFontSize: "फ़ॉन्ट आकार रीसेट करें",
        increaseFontSize: "फ़ॉन्ट आकार बढ़ाएं",
        selectLanguage: "भाषा चुनें",
        accountRole: "खाता भूमिका",
        dashboard: "डैशबोर्ड",
        grievances: "योजना पूछताछ",
        myEnquiries: "मेरी पूछताछ",
        products: "उत्पाद",
        enquiries: "पूछताछ",
        myProfile: "मेरी प्रोफ़ाइल",
        cfcPortal: "CFC पोर्टल",
        cfcProfile: "CFC प्रोफ़ाइल",
        signOut: "साइन आउट",
        loginRegister: "लॉगिन / पंजीकरण",
        about: "परिचय",
        odopProgramme: "ओडीओपी कार्यक्रम",
        odopCell: "ओडीओपी सेल",
        governmentOrders: "ओडीओपी सरकारी आदेश",
        odopProducts: "ओडीओपी उत्पाद",
        searchDistrictPlaceholder: "जिला खोजें...",
        searchDistrictAria: "जिला खोजें",
        searchResults: "जिला खोज परिणाम",
        searching: "खोज रहे हैं...",
        noDistrictsFound: "कोई जिला नहीं मिला।",
        schemesPolicies: "योजनाएं एवं नीतियां",
        odopSchemes: "ओडीओपी योजनाएं और नीतियां",
        msmeSchemes: "एमएसएमई योजनाएं और नीतियां",
        emarketplaces: "ई-मार्केटप्लेस",
        odopMart: "ओडीओपी मार्ट",
        flipkartStore: "ओडीओपी फ्लिपकार्ट स्टोर",
        amazonStore: "ओडीओपी अमेज़न स्टोर",
        exhibitionsFairs: "प्रदर्शनियां एवं मेले",
        pastEvents: "पूर्व कार्यक्रम",
        notifiedList: "प्रदर्शनियों और मेलों की अधिसूचित सूची",
        keyPartners: "मुख्य भागीदार",
        media: "मीडिया",
        photoGallery: "फोटो गैलरी",
        videoGallery: "वीडियो गैलरी",
        odopInNews: "समाचारों में ओडीओपी",
        knowledgeHub: "ज्ञान केंद्र",
        listOfCFCs: "सीएफसी की सूची",
        productDSRs: "उत्पाद डीएसआर",
        successStories: "सफलता की कहानियां",
        deaps: "जिला निर्यात कार्य योजना (DEAPs)",
        coffeeTableBooks: "कॉफी टेबल बुक्स (CTBs)",
        qciCompendiums: "क्यूसीआई संकलन",
        nablLabs: "NABL प्रयोगशालाओं की सूची",
        documentary: "वृत्तचित्र",
        productVideo: "उत्पाद वीडियो",
        contactUs: "संपर्क करें",
        partnerUphdmc: "उत्तर प्रदेश हस्तशिल्प विकास एवं विपणन निगम (UPHDMC)",
        partnerUptpa: "उत्तर प्रदेश व्यापार संवर्धन प्राधिकरण (UPTPA)",
        partnerFfdc: "सुगंध एवं स्वाद विकास केंद्र (FFDC)",
        partnerPpdc: "प्रक्रिया एवं उत्पाद विकास केंद्र (PPDC)",
        partnerMhsc: "(MHSC)",
        partnerAtdc: "वस्त्र प्रशिक्षण एवं डिजाइन केंद्र (ATDC)",
        partnerCftri: "केंद्रीय खाद्य प्रौद्योगिकी अनुसंधान संस्थान (CFTRI)",
        partnerUpid: "यूनिफाइड पेमेंट्स इंटरफेस पहचानकर्ता (UPID)",
        partnerUpepc: "उत्तर प्रदेश निर्यात संवर्धन परिषद (UPEPC)",
    },
} as const;

type NavSession =
  | { kind: "portal"; name: string; role_name: string }
  | { kind: "cfc"; name: string; cfc_name?: string };

function readNavSession(): NavSession | null {
  if (isCfcUserLoggedIn()) {
    const cfcUser = getCfcUser();
    if (cfcUser) {
      return { kind: "cfc", name: cfcUser.name, cfc_name: cfcUser.cfc_name };
    }
  }

  const portalUser = getStoredUser();
  if (portalUser && isUserLoggedIn()) {
    return { kind: "portal", name: portalUser.name, role_name: portalUser.role_name };
  }

  return null;
}

function subscribeMobileMq(onStoreChange: () => void) {
    const mq = window.matchMedia(MOBILE_MQ);
    mq.addEventListener("change", onStoreChange);
    return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileSnapshot() {
    return window.matchMedia(MOBILE_MQ).matches;
}

function getMobileServerSnapshot() {
    return false;
}

function useIsMobileViewport() {
    return useSyncExternalStore(subscribeMobileMq, getMobileSnapshot, getMobileServerSnapshot);
}

function LanguageFlagIcon({ language }: { language: Language }) {
    if (language === "hi") {
        return (
            <svg className={styles.languageFlagIcon} viewBox="0 0 21 14" aria-hidden="true">
                <rect width="21" height="4.67" fill="#FF9933" />
                <rect y="4.67" width="21" height="4.67" fill="#FFFFFF" />
                <rect y="9.33" width="21" height="4.67" fill="#138808" />
                <circle cx="10.5" cy="7" r="1.6" fill="#000080" />
                <circle cx="10.5" cy="7" r="1.2" fill="#FFFFFF" />
                <circle cx="10.5" cy="7" r="0.35" fill="#000080" />
            </svg>
        );
    }

    return (
        <svg className={styles.languageFlagIcon} viewBox="0 0 21 14" aria-hidden="true">
            <rect width="21" height="14" fill="#012169" />
            <path d="M0 0 L21 14 M21 0 L0 14" stroke="#FFFFFF" strokeWidth="2.8" />
            <path d="M0 0 L21 14 M21 0 L0 14" stroke="#C8102E" strokeWidth="1.4" />
            <path d="M10.5 0 V14 M0 7 H21" stroke="#FFFFFF" strokeWidth="4.6" />
            <path d="M10.5 0 V14 M0 7 H21" stroke="#C8102E" strokeWidth="2.8" />
        </svg>
    );
}

/** Aligns with https://odop-theta.vercel.app/index.html navigation */
type DropdownId =
    | "about"
    | "schemes-policies"
    | "marketplace"
    | "events-exhibitions"
    | "partnerships"
    | "media"
    | "knowledge-hub";

function Navbar() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedDropdown, setExpandedDropdown] = useState<DropdownId | null>(null);
    const [districtSearch, setDistrictSearch] = useState("");
    const [districtResults, setDistrictResults] = useState<DistrictProduct[]>([]);
    const [districtSearchLoading, setDistrictSearchLoading] = useState(false);
    const [fontScale, setFontScale] = useState(() => {
        if (typeof window === "undefined") return DEFAULT_FONT_SCALE;
        const savedScale = Number(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY));
        if (!Number.isFinite(savedScale)) return DEFAULT_FONT_SCALE;
        return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, savedScale));
    });

    const [navSession, setNavSession] = useState<NavSession | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [searchPanelHidden, setSearchPanelHidden] = useState(false);
    const districtSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const districtSearchRequestRef = useRef(0);
    const districtSearchAbortRef = useRef<AbortController | null>(null);

    const pathname = usePathname();
    const router = useRouter();
    const currentLang = useLanguage();
    const isHi = currentLang === "hi";
    const navText = isHi ? NAV_COPY.hi : NAV_COPY.en;
    const visiblePathname = getVisiblePathname(pathname);
    const navHref = useCallback((href: string) => localizePathname(href, currentLang), [currentLang]);
    const isCurrentPath = useCallback((href: string) => {
        const localizedHref = navHref(href);
        return visiblePathname === localizedHref || pathname === href;
    }, [navHref, pathname, visiblePathname]);

    const isMobile = useIsMobileViewport();

    const handleLogout = () => {
        if (navSession?.kind === "cfc") {
            cfcLogout();
        } else {
            void clearAuthSession();
        }
        setNavSession(null);
        setProfileDropdownOpen(false);
        router.push("/");
    };

    const switchLanguage = useCallback((newLang: Language) => {
        const visiblePath = getVisiblePathname(pathname);
        setLocaleCookie(newLang);

        const newUrl = localizePathname(visiblePath, newLang);
        if (newUrl === visiblePath) {
            router.refresh();
            return;
        }

        // Full navigation so the address bar and proxy both see the new locale URL.
        window.location.assign(newUrl);
    }, [pathname, router]);

    const closeMobileNav = useCallback(() => {
        setMobileMenuOpen(false);
        setExpandedDropdown(null);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const prevBody = document.body.style.overflow;
        const prevHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevBody;
            document.documentElement.style.overflow = prevHtml;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale}%`;
        window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScale));
    }, [fontScale]);

    useEffect(() => {
        const syncSession = () => setNavSession(readNavSession());
        syncSession();
        window.addEventListener(AUTH_CHANGE_EVENT, syncSession);
        return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
    }, []);

    const toggleMobileMenu = () => {

        setMobileMenuOpen((open) => {
            if (open) {
                setExpandedDropdown(null);
            }
            return !open;
        });
    };

    const onDropdownParentClick = (id: DropdownId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isMobile) return;
        e.preventDefault();
        setExpandedDropdown((current) => (current === id ? null : id));
    };

    const onLeafNavClick = () => {
        if (isMobile) {
            closeMobileNav();
        }
    };

    const searchDistricts = useCallback(async (query: string, signal: AbortSignal) => {
        const response = await fetchPublicDistricts(
            {
                page: 1,
                limit: 8,
                search: query.trim() || undefined,
                sort_by: "district_name",
                sort_order: "asc",
            },
            { cache: "no-store", signal }
        );
        const parsed = parsePublicDistrictListResponse(response.data);
        const isHi = currentLang === "hi";
        return parsed.items.map((item) => mapPublicDistrictToCard(item, isHi));
    }, [currentLang]);

    const loadDistrictSearchResults = useCallback(async (query: string) => {
        districtSearchAbortRef.current?.abort();
        const controller = new AbortController();
        districtSearchAbortRef.current = controller;

        const requestId = ++districtSearchRequestRef.current;
        setDistrictSearchLoading(true);

        try {
            const results = await searchDistricts(query, controller.signal);
            if (requestId !== districtSearchRequestRef.current) return;
            setDistrictResults(results);
        } catch (error) {
            if (requestId !== districtSearchRequestRef.current) return;
            if (error instanceof ApiError && error.isAbortError) return;
            console.error("Error searching districts from navbar:", error);
            setDistrictResults([]);
        } finally {
            if (requestId === districtSearchRequestRef.current) {
                setDistrictSearchLoading(false);
            }
        }
    }, [searchDistricts]);

    useEffect(() => {
        if (districtSearchDebounceRef.current) clearTimeout(districtSearchDebounceRef.current);

        const query = districtSearch.trim();
        if (!query) return;

        districtSearchDebounceRef.current = setTimeout(() => {
            void loadDistrictSearchResults(query);
        }, 250);

        return () => {
            if (districtSearchDebounceRef.current) clearTimeout(districtSearchDebounceRef.current);
        };
    }, [districtSearch, loadDistrictSearchResults]);

    const navigateToDistrict = useCallback((district: DistrictProduct) => {
        if (!district.profile || district.profile === "#") return;
        router.push(district.profile);
        setDistrictSearch("");
        setDistrictResults([]);
        if (isMobile) {
            closeMobileNav();
        }
    }, [closeMobileNav, isMobile, router]);

    const onDistrictSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        event.currentTarget.blur();
        if (!isMobile) {
            setSearchPanelHidden(true);
        }
    };

    const districtProductsSearchPanel = (
        <div className={`${styles.productSearchDropdown}${searchPanelHidden && !isMobile ? ` ${styles.productSearchDropdownHidden}` : ""}`} role="search" aria-label={navText.searchDistrictAria}>
            <div className={styles.productSearchField}>
                <FaSearch aria-hidden="true" />
                <input
                    id="nav-district-search"
                    type="search"
                    value={districtSearch}
                    onChange={(event) => {
                        const val = event.target.value;
                        setDistrictSearch(val);
                        if (!val.trim()) {
                            districtSearchAbortRef.current?.abort();
                            districtSearchRequestRef.current += 1;
                            setDistrictResults([]);
                            setDistrictSearchLoading(false);
                        }
                    }}
                    onKeyDown={onDistrictSearchKeyDown}
                    onFocus={() => {
                        const query = districtSearch.trim();
                        if (query && districtResults.length === 0) {
                            void loadDistrictSearchResults(query);
                        }
                    }}
                    placeholder={navText.searchDistrictPlaceholder}
                    aria-label={navText.searchDistrictAria}
                    autoComplete="off"
                />
            </div>
            {districtSearch.trim() && (
                <>
                    <div className={styles.productSearchResults} role="listbox" aria-label={navText.searchResults}>
                        {districtSearchLoading ? (
                            <div className={styles.productSearchStatus}>{navText.searching}</div>
                        ) : districtResults.length > 0 ? (
                            districtResults.map((district) => (
                                <button
                                    key={district.id ?? district.slug}
                                    type="button"
                                    className={styles.productSearchResult}
                                    onClick={() => navigateToDistrict(district)}
                                    role="option"
                                    aria-selected="false"
                                >
                                    <span>
                                        <strong>{district.name}</strong>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className={styles.productSearchStatus}>{navText.noDistrictsFound}</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    const onSkipToMainContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (visiblePathname !== "/" && visiblePathname !== "/hi") return;
        e.preventDefault();

        const target = document.getElementById("leadership-desk");
        if (!target) return;

        const headerOffset = 140;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });

        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });

        if (isMobile) {
            closeMobileNav();
        }
    };

    const decreaseFontSize = () => {
        setFontScale((current) => Math.max(MIN_FONT_SCALE, current - FONT_SCALE_STEP));
    };

    const resetFontSize = () => {
        setFontScale(DEFAULT_FONT_SCALE);
    };

    const increaseFontSize = () => {
        setFontScale((current) => Math.min(MAX_FONT_SCALE, current + FONT_SCALE_STEP));
    };

    const dropdownOpen = (id: DropdownId) => expandedDropdown === id;

    return (
        <>
            <div className={`${styles.topBar} top-bar ${mobileMenuOpen ? styles.topBarMenuOpen : ""}`}>
                <div className="container">
                    <div className={styles.topBarLeft}>
                        <div className={styles.accessibilityLinks}>
                            <Link href={navHref("/#leadership-desk")} className={styles.accessibilityLink} onClick={onSkipToMainContent}>
                                {navText.skipToMainContent}
                            </Link>
                            <span className={styles.accessibilityDivider} aria-hidden="true"></span>
                            <Link href={navHref("/screen-reader-access")} className={styles.accessibilityLink}>
                                {navText.screenReaderAccess}
                            </Link>
                            {/* <span className={styles.accessibilityDivider} aria-hidden="true"></span> */}
                            {/* <Link href={navHref("/sitemap")} className={styles.accessibilityLink}>
                                {navText.sitemap}
                            </Link> */}
                            <span className={styles.accessibilityDivider} aria-hidden="true"></span>
                            <div className={styles.fontSizeControls} role="group" aria-label={navText.adjustFontSize}>
                                <button
                                    type="button"
                                    className={styles.fontSizeButton}
                                    onClick={decreaseFontSize}
                                    aria-label={navText.decreaseFontSize}
                                >
                                    A-
                                </button>
                                <button
                                    type="button"
                                    className={styles.fontSizeButton}
                                    onClick={resetFontSize}
                                    aria-label={navText.resetFontSize}
                                >
                                    A
                                </button>
                                <button
                                    type="button"
                                    className={styles.fontSizeButton}
                                    onClick={increaseFontSize}
                                    aria-label={navText.increaseFontSize}
                                >
                                    A+
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.topBarRight}>
                        <div className={styles.languageToggle} role="group" aria-label={navText.selectLanguage}>
                            <div className={styles.languageToggleButtons}>
                                <button
                                    type="button"
                                    className={`${styles.languageToggleButton} ${currentLang === "en" ? styles.languageToggleButtonActive : ""}`}
                                    onClick={() => switchLanguage("en")}
                                    aria-pressed={currentLang === "en"}
                                >
                                    <span className={styles.languageToggleContent}>
                                        <LanguageFlagIcon language="en" />
                                        <span>EN</span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.languageToggleButton} ${currentLang === "hi" ? styles.languageToggleButtonActive : ""}`}
                                    onClick={() => switchLanguage("hi")}
                                    aria-pressed={currentLang === "hi"}
                                >
                                    <span className={styles.languageToggleContent}>
                                        <LanguageFlagIcon language="hi" />
                                        <span>हिंदी</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <span className={styles.topBarDivider}></span>
                        {navSession ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-[6px] text-[0.78rem] text-white/80 hover:text-white transition-colors cursor-pointer"
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                        <FaUser className="text-[10px]" />
                                    </div>
                                    <span className="max-w-[120px] truncate font-medium">{navSession.name}</span>
                                    <FaChevronDown className={`text-[10px] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        />
                                        <div className={`${styles.profileDropdown} absolute right-0 mt-[14px] w-52 bg-white rounded-xl !p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 overflow-visible`}>
                                            {/* Triangle indicator */}
                                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 z-[-1]"></div>

                                            {navSession.kind === "cfc" && (
                                                <div>
                                                    <Link
                                                        href={cfcPortalPath()}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${pathname === cfcPortalPath() ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaLandmark className={`${pathname === cfcPortalPath() ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.cfcPortal}
                                                    </Link>
                                                    <Link
                                                        href={cfcPortalProfilePath()}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${pathname.startsWith(cfcPortalProfilePath()) ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaUser className={`${pathname.startsWith(cfcPortalProfilePath()) ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.cfcProfile}
                                                    </Link>
                                                </div>
                                            )}

                                            {navSession.kind === "portal" && navSession.role_name?.toLowerCase() === 'supplier' && (
                                                <div>
                                                    <Link
                                                        href={navHref("/supplier/dashboard")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/supplier/dashboard") ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaLandmark className={`${isCurrentPath("/supplier/dashboard") ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.dashboard}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/supplier/products")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/supplier/products") ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaSignInAlt className={`${isCurrentPath("/supplier/products") ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.products}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/supplier/enquiries")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/supplier/enquiries") ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaEnvelope className={`${isCurrentPath("/supplier/enquiries") ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.enquiries}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/supplier/profile")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/supplier/profile") ? 'text-[var(--primary)] bg-primary/5 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium'}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaUser className={`${isCurrentPath("/supplier/profile") ? 'text-[var(--primary)]' : 'text-gray-400 group-hover:text-[var(--primary)]'}`} />
                                                        {navText.myProfile}
                                                    </Link>
                                                </div>
                                            )}

                                            {navSession.kind === "portal" &&
                                              (navSession.role_name?.toLowerCase() === "user" ||
                                              navSession.role_name?.toLowerCase() === "buyer") && (
                                                <div>
                                                    <Link
                                                        href={navHref("/user/profile")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/user/profile") ? "text-[var(--primary)] bg-primary/5 font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium"}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaUser className={`${isCurrentPath("/user/profile") ? "text-[var(--primary)]" : "text-gray-400 group-hover:text-[var(--primary)]"}`} />
                                                        {navText.myProfile}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/user/dashboard")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${isCurrentPath("/user/dashboard") ? "text-[var(--primary)] bg-primary/5 font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium"}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaLandmark className={`${isCurrentPath("/user/dashboard") ? "text-[var(--primary)]" : "text-gray-400 group-hover:text-[var(--primary)]"}`} />
                                                        {navText.dashboard}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/user/grievances")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${visiblePathname.startsWith(navHref("/user/grievances")) || pathname.startsWith("/user/grievances") ? "text-[var(--primary)] bg-primary/5 font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium"}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaTicket className={`${visiblePathname.startsWith(navHref("/user/grievances")) || pathname.startsWith("/user/grievances") ? "text-[var(--primary)]" : "text-gray-400 group-hover:text-[var(--primary)]"}`} />
                                                        {navText.grievances}
                                                    </Link>
                                                    <Link
                                                        href={navHref("/user/contact-enquiries")}
                                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] transition-colors group ${visiblePathname.startsWith(navHref("/user/contact-enquiries")) || pathname.startsWith("/user/contact-enquiries") ? "text-[var(--primary)] bg-primary/5 font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] font-medium"}`}
                                                        onClick={() => setProfileDropdownOpen(false)}
                                                    >
                                                        <FaEnvelope className={`${visiblePathname.startsWith(navHref("/user/contact-enquiries")) || pathname.startsWith("/user/contact-enquiries") ? "text-[var(--primary)]" : "text-gray-400 group-hover:text-[var(--primary)]"}`} />
                                                        {navText.myEnquiries}
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="h-px bg-gray-100 my-0.5 mx-3"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3.5 px-5 py-2.5 text-[0.82rem] text-red-600 hover:bg-red-50 transition-colors text-left group font-bold"
                                            >
                                                <FaSignOutAlt className="text-red-400 group-hover:text-red-600 transition-colors" />
                                                {navText.signOut}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <a href="#" onClick={(e) => { e.preventDefault(); setLoginModalOpen(true); }}><FaSignInAlt /> {navText.loginRegister}</a>
                        )}
                    </div>
                </div>
            </div>

            <header className={`${styles.siteHeader} ${mobileMenuOpen ? styles.siteHeaderMenuOpen : ""} site-header`} id="site-header">


                <nav className={`${styles.navbar} navbar relative z-[10055]`} aria-label="Primary">
                    <div className="container">
                        <div className="w-100 grid grid-cols-12 items-center gap-2 md:gap-4">
                            <div className="order-1 col-span-8 min-w-0 shrink md:order-1 md:col-span-2 flex items-center justify-start md:justify-center">
                                <Link href="/" className={`${styles.navLogo} nav-logo`}>
                                    <Image src={currentLang === "en" ? "/assets/img/odop-logo.png" : "/assets/img/odop-logo-h.png"} alt="ODOP UP Portal" className={`${styles.navLogoImage} nav-logo-image`} width={160} height={50} sizes="(max-width: 1199px) 120px, 160px" quality={80} />
                                </Link>
                            </div>

                            <div className="order-3 col-span-12 md:order-2 md:col-span-8">
                                <ul
                                    className={`${styles.navMenu} nav-menu max-md:z-[10050] max-md:isolate ${mobileMenuOpen ? "open" : ""}`}
                                    id="nav-menu"
                                >
                                    {/* About */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("about") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="/#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("about")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("about")}
                                            aria-controls="about-submenu"
                                        >
                                            {navText.about} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul
                                            id="about-submenu"
                                            role="list"
                                            className={`${styles.navSubmenu} nav-submenu`}
                                        >
                                            <li role="listitem"><Link href={navHref("/about")} onClick={onLeafNavClick} aria-current={isCurrentPath("/about") ? "page" : undefined}>{navText.odopProgramme}</Link></li>
                                            <li role="listitem"><Link href={navHref("/about/odop-cell")} onClick={onLeafNavClick} aria-current={isCurrentPath("/about/odop-cell") ? "page" : undefined}>{navText.odopCell}</Link></li>
                                            <li role="listitem"><Link href={navHref("/about/government-orders")} onClick={onLeafNavClick} aria-current={isCurrentPath("/about/government-orders") ? "page" : undefined}>{navText.governmentOrders}</Link></li>
                                        </ul>
                                    </li>

                                    {/* ODOP Products */}
                                    <li
                                        className={styles.productSearchNavItem}
                                        onMouseEnter={() => setSearchPanelHidden(false)}
                                    >
                                        <Link
                                            href={navHref("/districts")}
                                            className={`${styles.navLink} nav-link`}
                                            onClick={() => {
                                                if (!isMobile) {
                                                    setSearchPanelHidden(true);
                                                }
                                                setDistrictSearch("");
                                                setDistrictResults([]);
                                                onLeafNavClick();
                                            }}
                                            aria-current={visiblePathname.startsWith(navHref("/districts")) ? "page" : undefined}
                                        >
                                            {navText.odopProducts} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        {districtProductsSearchPanel}
                                    </li>

                                    {/* Schemes & Policies */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("schemes-policies") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="/#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("schemes-policies")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("schemes-policies")}
                                            aria-controls="schemes-submenu"
                                        >
                                            {navText.schemesPolicies} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="schemes-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            {/* <li role="listitem"><Link href="/odop-schemes/margin-money-scheme-uttar-pradesh" onClick={onLeafNavClick} aria-current={pathname === "/odop-schemes/margin-money-scheme-uttar-pradesh" ? "page" : undefined}>ODOP Financial Assistance Scheme</Link></li> */}
                                            {/* <li role="listitem"><Link href="/odop-schemes/training-and-toolkit-scheme-uttar-pradesh" onClick={onLeafNavClick} aria-current={pathname === "/odop-schemes/training-and-toolkit-scheme-uttar-pradesh" ? "page" : undefined}>ODOP Training & Toolkit distribution Scheme</Link></li> */}
                                            {/* <li role="listitem"><Link href="/odop-schemes/common-facility-centre-cfc-scheme-uttar-pradesh" onClick={onLeafNavClick} aria-current={pathname === "/odop-schemes/common-facility-centre-cfc-scheme-uttar-pradesh" ? "page" : undefined}>ODOP Common Facility Scheme (CFC)</Link></li> */}
                                            {/* <li role="listitem"><Link href="/odop-schemes/marketing-development-assistance-scheme-uttar-pradesh" onClick={onLeafNavClick} aria-current={pathname === "/odop-schemes/marketing-development-assistance-scheme-uttar-pradesh" ? "page" : undefined}>ODOP Marketing Development Assistance Scheme</Link></li> */}
                                            <li role="listitem"><Link href={navHref("/#odop-schemes")} onClick={onLeafNavClick}>{navText.odopSchemes}</Link></li>
                                            <li role="listitem"><Link href={navHref("/#msme-schemes")} onClick={onLeafNavClick}>{navText.msmeSchemes}</Link></li>
                                        </ul>
                                    </li>

                                    {/* E-Marketplaces */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("marketplace") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("marketplace")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("marketplace")}
                                            aria-controls="marketplace-submenu"
                                        >
                                            {navText.emarketplaces} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="marketplace-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            <li role="listitem"><a href="https://odopmart.up.gov.in/" target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>{navText.odopMart}</a></li>
                                            <li role="listitem"><a href="https://www.flipkart.com/welcome-to-kumbh-mela-with-flipkart-store" target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>{navText.flipkartStore}</a></li>
                                            <li role="listitem"><a href="https://www.amazon.in/b/ref=s9_acss_bw_cg_kalapart_2d1_w?node=16204640031&pf_rd_m=A1K21FY43GMZF8&pf_rd_s=merchandised-search-7&pf_rd_r=34RF0G7PF6H0KYR2J076&pf_rd_t=101&pf_rd_p=1ddc12b0-558b-4b5b-bb70-c018ea47f19f&pf_rd_i=15424266031" target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>{navText.amazonStore}</a></li>
                                        </ul>
                                    </li>

                                    {/* Fairs & Exhibitions */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("events-exhibitions") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("events-exhibitions")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("events-exhibitions")}
                                            aria-controls="events-exhibitions-submenu"
                                        >
                                            {navText.exhibitionsFairs} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="events-exhibitions-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            <li role="listitem"><Link href={navHref("/media/past-events")} onClick={onLeafNavClick} aria-current={isCurrentPath("/media/past-events") ? "page" : undefined}>{navText.pastEvents}</Link></li>
                                            <li role="listitem"><Link href={navHref("/media/upcoming-events")} onClick={onLeafNavClick} aria-current={isCurrentPath("/media/upcoming-events") ? "page" : undefined}>{navText.notifiedList}</Link></li>
                                        </ul>
                                    </li>

                                    {/* Key Partners */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("partnerships") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("partnerships")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("partnerships")}
                                            aria-controls="partnerships-submenu"
                                        >
                                            {navText.keyPartners} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="partnerships-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            <li role="listitem"><a href={FLIPKART_MOU_PDF} target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>Flipkart</a></li>
                                            <li role="listitem"><a href={IIP_MOU_PDF} target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>Indian Institute of Packaging (IIP)</a></li>
                                            <li role="listitem"><a href={SIDBI_MOU_PDF} target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>Small Industries Development Bank of India (SIDBI)</a></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerUphdmc}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerUptpa}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerFfdc}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerPpdc}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerMhsc}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerAtdc}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerCftri}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerUpid}</Link></li>
                                            <li role="listitem"><Link href="#" target="_blank" onClick={onLeafNavClick}>{navText.partnerUpepc}</Link></li>
                                        </ul>
                                    </li>

                                    {/* Media */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("media") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("media")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("media")}
                                            aria-controls="media-submenu"
                                        >
                                            {navText.media} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="media-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            <li role="listitem"><Link href={navHref("/media/gallery")} onClick={onLeafNavClick} aria-current={isCurrentPath("/media/gallery") ? "page" : undefined}>{navText.photoGallery}</Link></li>
                                            <li role="listitem"><Link href={navHref("/media/video-gallery")} onClick={onLeafNavClick} aria-current={isCurrentPath("/media/video-gallery") ? "page" : undefined}>{navText.videoGallery}</Link></li>
                                            <li role="listitem"><Link href={navHref("/media/press-release")} onClick={onLeafNavClick} aria-current={isCurrentPath("/media/press-release") ? "page" : undefined}>{navText.odopInNews}</Link></li>
                                        </ul>
                                    </li>

                                    {/* Knowledge Hub */}
                                    <li
                                        className={`${styles.navItemDropdown} nav-item-dropdown ${dropdownOpen("knowledge-hub") ? "is-open" : ""}`}
                                    >
                                        <Link
                                            href="#"
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onDropdownParentClick("knowledge-hub")}
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen("knowledge-hub")}
                                            aria-controls="knowledge-hub-submenu"
                                        >
                                            {navText.knowledgeHub} <FaChevronDown aria-hidden="true" />
                                        </Link>
                                        <ul id="knowledge-hub-submenu" role="list" className={`${styles.navSubmenu} nav-submenu`}>
                                            <li role="listitem"><Link href={navHref("/resources/cfc-list")} onClick={onLeafNavClick} aria-current={isCurrentPath("/resources/cfc-list") ? "page" : undefined}>{navText.listOfCFCs}</Link></li>
                                            <li role="listitem"><Link href={navHref("/knowledge-base/project-report")} onClick={onLeafNavClick} aria-current={isCurrentPath("/knowledge-base/project-report") ? "page" : undefined}>{navText.productDSRs}</Link></li>
                                            <li role="listitem"><Link href={navHref("/knowledge-base/success-story")} onClick={onLeafNavClick} aria-current={isCurrentPath("/knowledge-base/success-story") ? "page" : undefined}>{navText.successStories}</Link></li>
                                            <li role="listitem"><Link href="#" onClick={onLeafNavClick} aria-current={pathname === "#" ? "page" : undefined}>{navText.deaps}</Link></li>
                                            <li role="listitem">
                                                <a href={COFFEE_TABLE_BOOK_PDF} target="_blank" rel="noopener noreferrer" onClick={onLeafNavClick}>
                                                    {navText.coffeeTableBooks}
                                                </a>
                                            </li>
                                            <li role="listitem"><Link href={navHref("/resources/qci-compendium")} onClick={onLeafNavClick} aria-current={isCurrentPath("/resources/qci-compendium") ? "page" : undefined}>{navText.qciCompendiums}</Link></li>
                                            <li role="listitem"><Link href={navHref("/resources/nabl-labs")} onClick={onLeafNavClick} aria-current={isCurrentPath("/resources/nabl-labs") ? "page" : undefined}>{navText.nablLabs}</Link></li>
                                            <li role="listitem"><Link href={navHref("/knowledge-base/documentary")} onClick={onLeafNavClick} aria-current={isCurrentPath("/knowledge-base/documentary") ? "page" : undefined}>{navText.documentary}</Link></li>
                                            <li role="listitem"><Link href={navHref("/knowledge-base/project-video")} onClick={onLeafNavClick} aria-current={isCurrentPath("/knowledge-base/project-video") ? "page" : undefined}>{navText.productVideo}</Link></li>
                                        </ul>
                                    </li>

                                    {/* Contact Us */}
                                    <li>
                                        <Link
                                            href={navHref("/contact-us")}
                                            className={`${styles.navLink} nav-link`}
                                            onClick={onLeafNavClick}
                                            aria-current={isCurrentPath("/contact-us") ? "page" : undefined}
                                        >
                                            {navText.contactUs}
                                        </Link>
                                    </li>

                                    {/* Language selection (mobile menu only; shown below 1200px where the top-bar toggle is hidden) */}
                                    <li className="min-[1200px]:hidden" style={{ marginTop: "2px" }}>
                                        <div className={`${styles.languageToggle} ${styles.languageToggleMobile}`} role="group" aria-label={navText.selectLanguage}>
                                            <div className={styles.languageToggleButtons}>
                                                <button
                                                    type="button"
                                                    className={`${styles.languageToggleButton} ${currentLang === "en" ? styles.languageToggleButtonActive : ""}`}
                                                    onClick={() => switchLanguage("en")}
                                                    aria-pressed={currentLang === "en"}
                                                >
                                                    <span className={styles.languageToggleContent}>
                                                        <LanguageFlagIcon language="en" />
                                                        <span>English</span>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.languageToggleButton} ${currentLang === "hi" ? styles.languageToggleButtonActive : ""}`}
                                                    onClick={() => switchLanguage("hi")}
                                                    aria-pressed={currentLang === "hi"}
                                                >
                                                    <span className={styles.languageToggleContent}>
                                                        <LanguageFlagIcon language="hi" />
                                                        <span>हिंदी</span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                            </div>

                            <div className="order-2 col-span-4 shrink-0 md:order-3 md:col-span-2 md:col-start-11 flex justify-end">
                                <div className={`${styles.navActions} nav-actions`}>
                                    <div
                                        className={`${styles.navGovtLogos} nav-govt-logos hidden md:flex`}
                                        aria-label="Government partner logos"
                                    >
                                        <Image src={currentLang === "en" ? "/assets/img/up-eng-logo.png" : "/assets/img/up.png"} alt="Make in India" className={`${styles.navGovtLogo} nav-govt-logo`} width={120} height={40} sizes="120px" quality={80} />
                                    </div>
                                    <button
                                        className={`${styles.navToggle} nav-toggle ${mobileMenuOpen ? "active" : ""}`}
                                        type="button"
                                        id="nav-toggle"
                                        aria-expanded={mobileMenuOpen}
                                        aria-controls="nav-menu"
                                        aria-label="Toggle Navigation"
                                        onClick={toggleMobileMenu}
                                    >
                                        <span></span><span></span><span></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

            </header>

            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onAuthSuccess={() => setNavSession(readNavSession())}
            />
        </>
    );
}

export default Navbar;
