"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api";
import { ApiError } from "@/lib/api/types";
import * as supplierProductService from "@/services/supplier-product.service";
import {
  PRODUCT_AVAILABILITY_LABELS,
  PRODUCT_STATUS_LABELS,
  normalizeProductAvailability,
  normalizeProductStatus,
} from "@/types/supplier-product";
import type { SupplierProduct } from "@/types/supplier-product";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

function resolveAssetUrl(path?: string | null): string | null {
  if (!path?.trim()) return null;
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");
  return `${base}/${p.replace(/^\//, "")}`;
}

export default function SupplierProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [product, setProduct] = useState<SupplierProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await supplierProductService.getProductById(id);
      if (res.success && res.data) {
        setProduct(res.data as SupplierProduct);
      } else {
        setProduct(null);
        toast.error("Product not found");
      }
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message);
      } else {
        toast.error("Failed to load product");
      }
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load product when route id changes
    void load();
  }, [load]);

  if (!id) {
    return (
      <div className="dashboard-content">
        <p>Invalid product.</p>
        <Link href="/supplier/products">Back to products</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-content">
        <p>Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="dashboard-content">
        <p>Could not load this product.</p>
        <Link href="/supplier/products" className="btn" style={{ marginTop: 16, display: "inline-block" }}>
          Back to products
        </Link>
      </div>
    );
  }

  const availability = normalizeProductAvailability(product.availability);
  const status = normalizeProductStatus(product.status);
  const thumb = resolveAssetUrl(product.thumbnail_image ?? undefined);
  const gallery = Array.isArray(product.product_images)
    ? (product.product_images.map((u) => resolveAssetUrl(u)).filter(Boolean) as string[])
    : [];

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => router.push("/supplier/products")}
          style={{ marginBottom: 12 }}
        >
          <FaArrowLeft style={{ marginRight: 8 }} />
          Back
        </button>
        <span className="eyebrow">Product</span>
        <h1>{product.product_name}</h1>
        <p className="panel-meta">
          {product.category?.name || product.category_name || "Uncategorized"}
          {product.sku_code ? ` · SKU ${product.sku_code}` : ""}
        </p>
      </header>

      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <h2>Overview</h2>
        </div>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0, 200px) 1fr" }}>
          <div>
            {thumb ? (
              <Image
                src={thumb}
                alt=""
                width={200}
                height={200}
                sizes="(max-width: 640px) 100vw, 200px"
                quality={80}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL.light}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid var(--line, #e2e8f0)",
                  objectFit: "cover",
                  aspectRatio: "1",
                  height: "auto",
                }}
              />
            ) : (
              <div className="micro-copy">No thumbnail</div>
            )}
          </div>
          <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px 16px", margin: 0 }}>
            <dt className="micro-copy">Status</dt>
            <dd style={{ margin: 0 }}>{status ? PRODUCT_STATUS_LABELS[status] : product.status || "—"}</dd>
            <dt className="micro-copy">Approval</dt>
            <dd style={{ margin: 0 }}>{product.approval_status || "—"}</dd>
            <dt className="micro-copy">Availability</dt>
            <dd style={{ margin: 0 }}>
              {availability ? PRODUCT_AVAILABILITY_LABELS[availability] : product.availability || "—"}
            </dd>
            <dt className="micro-copy">Export ready</dt>
            <dd style={{ margin: 0 }}>{product.export_ready ? "Yes" : "No"}</dd>
            <dt className="micro-copy">Pricing (₹)</dt>
            <dd style={{ margin: 0 }}>
              {product.min_price != null || product.max_price != null
                ? `${product.min_price ?? "—"} – ${product.max_price ?? "—"}`
                : "—"}
            </dd>
            <dt className="micro-copy">MOQ</dt>
            <dd style={{ margin: 0 }}>{product.moq ?? "—"}</dd>
            <dt className="micro-copy">HSN</dt>
            <dd style={{ margin: 0 }}>{product.hsn_code || "—"}</dd>
            <dt className="micro-copy">Tags</dt>
            <dd style={{ margin: 0 }}>{product.search_tags || "—"}</dd>
            <dt className="micro-copy">Video</dt>
            <dd style={{ margin: 0 }}>
              {product.video_url?.trim() ? (
                <a href={product.video_url.trim()} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <FaExternalLinkAlt style={{ marginRight: 6 }} />
                  Open link
                </a>
              ) : (
                "—"
              )}
            </dd>
          </dl>
        </div>
      </section>

      {product.description ? (
        <section className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-head">
            <h2>Description</h2>
          </div>
          <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{product.description}</p>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Gallery</h2>
          </div>
          <div className="supplier-upload-grid supplier-upload-grid--images">
            {gallery.map((src) => (
              <div key={src} className="supplier-upload-card supplier-upload-card--image supplier-upload-card--filled">
                <Image
                  className="supplier-upload-card__preview"
                  src={src}
                  alt=""
                  width={200}
                  height={150}
                  sizes="(max-width: 640px) 50vw, 200px"
                  quality={75}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL.light}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div style={{ marginTop: 24 }}>
        <Link href="/supplier/products" className="btn-outline">
          Edit from list
        </Link>
      </div>
    </div>
  );
}
