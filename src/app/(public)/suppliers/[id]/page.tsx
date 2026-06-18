import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { API_CONFIG } from "@/lib/api";
import { fetchSupplierById } from "@/services/suppliers.service";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";
import { getLanguageServer } from "@/lib/language";
import { resolveProductCategoryLabel } from "@/lib/locale";

type SupplierUser = {
  name?: string | null;
  email?: string | null;
  mobile_no?: string | null;
};

type NamedValue =
  | string
  | { name?: string | null; name_hindi?: string | null; nameHindi?: string | null; label?: string | null }
  | null;

type SupplierDetail = {
  id?: number | string;
  enterprise_name?: string | null;
  enterprise_type?: string | null;
  supplier_type?: string | null;
  supplier_logo?: string | null;
  logo?: string | null;
  address?: string | null;
  district?: string | null;
  district_name?: string | null;
  contact_person?: string | null;
  gst_number?: string | null;
  udyam_registration?: string | null;
  supplier_description?: string | null;
  business_description?: string | null;
  category?: NamedValue;
  category_name?: string | null;
  product_category?: NamedValue;
  product_category_name?: string | null;
  user?: SupplierUser | null;
};

type SupplierDetailPayload =
  | SupplierDetail
  | {
      data?: SupplierDetail | { data?: SupplierDetail };
    };

function normalizeSupplierDetail(payload: unknown): SupplierDetail | null {
  if (!payload || typeof payload !== "object") return null;

  const responsePayload = payload as SupplierDetailPayload;
  if ("id" in responsePayload) return responsePayload;

  const firstData = "data" in responsePayload ? responsePayload.data : null;
  if (!firstData) return null;

  if (typeof firstData === "object" && "data" in firstData && firstData.data) {
    return firstData.data;
  }

  return firstData as SupplierDetail;
}

function getAssetUrl(path?: string | null): string {
  if (!path) return "/img/no-image1.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_CONFIG.NEW_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function getText(value?: string | number | null): string {
  if (value == null || value === "") return "N/A";
  return String(value);
}

function getNamedValue(value?: NamedValue, isHi = false): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.name) return resolveProductCategoryLabel(value as { name: string; name_hindi?: string | null; nameHindi?: string | null }, isHi);
  return value.label || "";
}

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  let supplier: SupplierDetail | null = null;
  try {
    const response = await fetchSupplierById(id, { cache: "no-store" });
    supplier = normalizeSupplierDetail(response.data);
    // console.log("Fetched supplier profile:", supplier);
  } catch (error) {
    console.error("Error fetching supplier profile:", error);
  }

  if (!supplier) {
    notFound();
  }

  const enterpriseName = supplier.enterprise_name || "Supplier Profile";
  const ownerName = supplier.contact_person || supplier.user?.name || "";
  const email = supplier.user?.email || "";
  const mobile = supplier.user?.mobile_no || "";
  const district = supplier.district_name || supplier.district || "";
  const category = supplier.category_name || getNamedValue(supplier.category, isHi);
  const productCategory =
    getNamedValue(supplier.product_category, isHi) || supplier.product_category_name || "";
  const description = supplier.supplier_description || supplier.business_description || "";
  const logoSrc = getAssetUrl(supplier.supplier_logo || supplier.logo);
  const locationText = supplier.address || district;

  return (
    <main className="supplier-profile-page">
      <section className="profile-banner">
        <div className="container">
          <nav className="profile-breadcrumb" aria-label="Breadcrumb">
            <Link className="profile-breadcrumb-link" href="/suppliers">
              Suppliers
            </Link>
            <span className="profile-breadcrumb-separator">/</span>
            <span className="profile-breadcrumb-current">{enterpriseName}</span>
          </nav>

          <div className="profile-header">
            <div className="profile-logo-wrap">
              <Image src={logoSrc} alt={`${enterpriseName} logo`} width={120} height={100} sizes="(max-width: 640px) 80px, 120px" quality={80} placeholder="blur" blurDataURL={BLUR_DATA_URL.light} />
            </div>

            <div className="profile-title-area">
              <div className="profile-tags">
                {supplier.supplier_type && <span className="badge badge-success">{supplier.supplier_type}</span>}
                {supplier.enterprise_type && <span className="badge badge-warning">{supplier.enterprise_type}</span>}
                {productCategory && <span className="badge badge-light">{productCategory}</span>}
              </div>
              <h1>{enterpriseName}</h1>
              <p className="profile-location">
                <i className="fas fa-map-marker-alt" />
                {getText(locationText)}
              </p>
            </div>

            <div className="profile-cta-stack">
              <a className="btn btn-primary" href={email ? `mailto:${email}` : "#enquiry"}>
                <i className="fas fa-envelope" /> Enquire
              </a>
              {mobile && (
                <a className="btn btn-outline-white" href={`tel:${mobile}`}>
                  <i className="fas fa-phone" /> Call
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm profile-section-surface">
        <div className="container">
          <div className="profile-content">
            <div className="profile-main">
              <article className="info-card">
                <div className="info-card-header">
                  <h3>
                    <i className="fas fa-building" /> Business Overview
                  </h3>
                </div>
                <div className="info-card-body">
                  <p className="info-card-meta">
                    {description || "Detailed business information for this supplier is not available yet."}
                  </p>
                </div>
              </article>

              <article className="info-card">
                <div className="info-card-header">
                  <h3>
                    <i className="fas fa-info-circle" /> Key Details
                  </h3>
                </div>
                <div className="info-card-body">
                  <div className="profile-facts-grid">
                    <div className="profile-fact">
                      <div className="profile-fact-label">Supplier Type</div>
                      <div className="profile-fact-value profile-fact-value-primary">
                        {getText(supplier.supplier_type)}
                      </div>
                    </div>
                    <div className="profile-fact">
                      <div className="profile-fact-label">Business Type</div>
                      <div className="profile-fact-value profile-fact-value-secondary">
                        {getText(supplier.enterprise_type)}
                      </div>
                    </div>
                    <div className="profile-fact">
                      <div className="profile-fact-label">District</div>
                      <div className="profile-fact-value profile-fact-value-success">{getText(district)}</div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="info-card" id="enquiry">
                <div className="info-card-header">
                  <h3>
                    <i className="fas fa-paper-plane" /> Enquiry
                  </h3>
                </div>
                <div className="info-card-body">
                  <div className="enquiry-note">
                    <i className="fas fa-info-circle" />
                    Contact this supplier using the available email or phone details.
                  </div>
                  <div className="profile-cta-stack">
                    <a className="btn btn-primary" href={email ? `mailto:${email}` : "#"}>
                      <i className="fas fa-envelope" /> Send Email
                    </a>
                    {mobile && (
                      <a className="btn btn-outline-secondary" href={`tel:${mobile}`}>
                        <i className="fas fa-phone" /> Call Supplier
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>

            <aside className="profile-sidebar">
              <article className="info-card">
                <div className="info-card-header">
                  <h3>
                    <i className="fas fa-address-book" /> Contact Details
                  </h3>
                </div>
                <div className="info-card-body">
                  <div className="contact-info-list">
                    <div className="contact-info-item">
                      <span className="contact-info-icon icon-call">
                        <i className="fas fa-user" />
                      </span>
                      <span>
                        <span className="label">Contact Person</span>
                        <span className="value">{getText(ownerName)}</span>
                      </span>
                    </div>
                    <div className="contact-info-item">
                      <span className="contact-info-icon icon-email">
                        <i className="fas fa-envelope" />
                      </span>
                      <span>
                        <span className="label">Email</span>
                        <span className="value">{getText(email)}</span>
                      </span>
                    </div>
                    <div className="contact-info-item">
                      <span className="contact-info-icon icon-whatsapp">
                        <i className="fas fa-phone" />
                      </span>
                      <span>
                        <span className="label">Mobile</span>
                        <span className="value">{getText(mobile)}</span>
                      </span>
                    </div>
                    <div className="contact-info-item">
                      <span className="contact-info-icon icon-location">
                        <i className="fas fa-map-marker-alt" />
                      </span>
                      <span>
                        <span className="label">Address</span>
                        <span className="value value-address">{getText(supplier.address)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="info-card">
                <div className="info-card-header">
                  <h3>
                    <i className="fas fa-certificate" /> Business Snapshot
                  </h3>
                </div>
                <div className="glance-list">
                  <div className="glance-row">
                    <span className="glance-label">Industry</span>
                    <span className="glance-value">{getText(category)}</span>
                  </div>
                  <div className="glance-row">
                    <span className="glance-label">Product Category</span>
                    <span className="glance-value">{getText(productCategory)}</span>
                  </div>
                  <div className="glance-row">
                    <span className="glance-label">GST Number</span>
                    <span className="glance-value">{getText(supplier.gst_number)}</span>
                  </div>
                  <div className="glance-row">
                    <span className="glance-label">Udyam</span>
                    <span className="glance-value">{getText(supplier.udyam_registration)}</span>
                  </div>
                </div>
              </article>

              <Link className="btn btn-outline-secondary w-100" href="/suppliers">
                <i className="fas fa-arrow-left" /> Back to Suppliers
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
