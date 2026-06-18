"use client";

import Link from "next/link";
import Image from "next/image";
import { LuChevronRight } from "react-icons/lu";
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaLocationDot, FaXTwitter, FaYoutube } from "react-icons/fa6";
import styles from "@/styles/Footer.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import { ODOP_CONTACT, ODOP_CONTACT_HI } from "@/lib/odop-contact";
import VisitorCounter from "./VisitorCounter";

const FOOTER_COPY = {
  en: {
    portalAriaLabel: "ODOP Portal",
    brandDesc:
      "The One District One Product (ODOP) Programme is a flagship initiative of the Government of Uttar Pradesh aimed at promoting and developing the unique traditional products and industries of each district.",
    quickLinks: "Quick Links",
    productDSRs: "Product DSRs",
    documentary: "Documentary",
    successStories: "Success Stories",
    odopProducts: "ODOP Products",
    odopSchemes: "ODOP Schemes",
    contactUs: "Contact Us",
    supplierTypes: "Supplier Types",
    artisans: "Artisans",
    manufacturers: "Manufacturers",
    exporters: "Exporters",
    contactDetails: "Contact Details",
    address: ODOP_CONTACT.address.withOrg,
    visitorCounter: "Visitor Counter",
    copyright: "© 2026 ODOP Portal. All Rights Reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    accessibility: "Accessibility",
    sitemap: "Sitemap",
  },
  hi: {
    portalAriaLabel: "ओडीओपी पोर्टल",
    brandDesc:
      "एक जिला एक उत्पाद (ओडीओपी) कार्यक्रम उत्तर प्रदेश सरकार की एक प्रमुख पहल है, जिसका उद्देश्य प्रत्येक जिले के अनूठे पारंपरिक उत्पादों और उद्योगों को बढ़ावा देना और विकसित करना है।",
    quickLinks: "त्वरित लिंक",
    productDSRs: "उत्पाद डीएसआर",
    documentary: "वृत्तचित्र",
    successStories: "सफलता की कहानियां",
    odopProducts: "ओडीओपी उत्पाद",
    odopSchemes: "ओडीओपी योजनाएं",
    contactUs: "संपर्क करें",
    supplierTypes: "आपूर्तिकर्ता प्रकार",
    artisans: "कारीगर",
    manufacturers: "निर्माता",
    exporters: "निर्यातक",
    contactDetails: "संपर्क विवरण",
    address: ODOP_CONTACT_HI.address.withOrg,
    visitorCounter: "विज़िटर काउंटर",
    copyright: "© 2026 ओडीओपी पोर्टल। सर्वाधिकार सुरक्षित।",
    privacyPolicy: "गोपनीयता नीति",
    termsOfUse: "उपयोग की शर्तें",
    accessibility: "सुलभता",
    sitemap: "साइटमैप",
  },
} as const;

function Footer() {
  const lang = useLanguage();
  const text = lang === "hi" ? FOOTER_COPY.hi : FOOTER_COPY.en;

  return (
    <>
      <footer className={styles.siteFooter}>
        <div className={styles.dotPattern}></div>
        <div className={styles.footerTop}>
          <div className="container">
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                <Link href="/" className={styles.footerLogo} aria-label={text.portalAriaLabel}>
                  <Image
                    src="/assets/img/logo.png"
                    alt="ODOP Logo"
                    width={150}
                    height={60}
                    sizes="(max-width: 768px) 120px, 150px"
                    quality={80}
                    style={{ objectFit: "contain" }}
                  />
                </Link>
                <p className={styles.brandDesc}>{text.brandDesc}</p>
                <div className={styles.footerSocial}>
                  <Link href="https://www.facebook.com/ODOPUP" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook"><FaFacebookF /></Link>
                  <Link href="https://x.com/UP_ODOP" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter"><FaXTwitter /></Link>
                  <Link href="https://www.instagram.com/up_odop/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram"><FaInstagram /></Link>
                  <Link href="https://www.youtube.com/@UP_ODOP" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube"><FaYoutube /></Link>
                  <Link href="https://www.linkedin.com/company/upodop-one-district-one-product/posts/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn"><FaLinkedinIn /></Link>
                </div>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.colTitle}>{text.quickLinks}</h4>
                <div className={styles.titleLine}></div>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/knowledge-base/project-report">
                      <span className={styles.chevron}><LuChevronRight /></span>{text.productDSRs}
                    </Link>
                  </li>
                  <li>
                    <Link href="/knowledge-base/documentary">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.documentary}
                    </Link>
                  </li>
                  <li>
                    <Link href="/knowledge-base/success-story">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.successStories}
                    </Link>
                  </li>
                  <li>
                    <Link href="/districts">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.odopProducts}
                    </Link>
                  </li>
                  <li>
                    <Link href="/odop-schemes">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.odopSchemes}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.contactUs}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.colTitle}>{text.supplierTypes}</h4>
                <div className={styles.titleLine}></div>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/suppliers?supplier_type=Artisans">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.artisans}
                    </Link>
                  </li>
                  <li>
                    <Link href="/suppliers?supplier_type=Manufacturers">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.manufacturers}
                    </Link>
                  </li>
                  <li>
                    <Link href="/suppliers?supplier_type=Exporters">
                      <span className={styles.chevron}><LuChevronRight /></span> {text.exporters}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.colTitle}>{text.contactDetails}</h4>
                <div className={styles.titleLine}></div>
                <div className={styles.footerContactList}>
                  <div className={styles.footerContactItem}>
                    <div className={styles.contactIcon}><FaLocationDot /></div>
                    <span className={styles.contactText}>{text.address}</span>
                  </div>
                  <div className={styles.footerContactItem}>
                    <div className={styles.contactIcon}><FaEnvelope /></div>
                    <a href={`mailto:${ODOP_CONTACT.email}`} className={styles.contactText}>
                      {ODOP_CONTACT.email}
                    </a>
                  </div>
                </div>
                <VisitorCounter />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className="container">
            <p className={styles.copyright}>{text.copyright}</p>
            <div className={styles.footerBottomLinks}>
              <Link href="#">{text.privacyPolicy}</Link>
              <Link href="#">{text.termsOfUse}</Link>
              <Link href="#">{text.accessibility}</Link>
              <Link href="#">{text.sitemap}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
