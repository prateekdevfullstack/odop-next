"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaImage, FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api";
import { ApiError } from "@/lib/api/types";
import * as supplierProductService from "@/services/supplier-product.service";
import { supplierProductFormSchema } from "@/lib/validation/supplier-product.schema";
import {
 ProductAvailability,
 ProductStatus,
 PRODUCT_AVAILABILITY_LABELS,
 PRODUCT_STATUS_LABELS,
 normalizeProductAvailability,
 normalizeProductStatus,
} from "@/types/supplier-product";
import type { SupplierProduct } from "@/types/supplier-product";

const PRODUCT_GALLERY_SLOTS = 5;

function resolveAssetUrl(path?: string | null): string | null {
 if (!path?.trim()) return null;
 const p = path.trim();
 if (p.startsWith("http://") || p.startsWith("https://")) return p;
 const base = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");
 return `${base}/${p.replace(/^\//, "")}`;
}

function revokeIfBlob(url: string | null | undefined) {
 if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

function formatAvailability(v?: string | null): string {
 if (!v) return "—";
 const n = normalizeProductAvailability(v);
 if (n) return PRODUCT_AVAILABILITY_LABELS[n];
 return v.replace(/_/g, " ");
}

function formatStatus(v?: string | null): string {
 if (!v) return "—";
 const n = normalizeProductStatus(v);
 if (n) return PRODUCT_STATUS_LABELS[n];
 return v;
}

function getStoredUserId(): number | undefined {
 if (typeof window === "undefined") return undefined;
 try {
 const raw = localStorage.getItem("user");
 if (!raw) return undefined;
 const u = JSON.parse(raw) as { id?: number };
 return typeof u.id === "number" && u.id > 0 ? u.id : undefined;
 } catch {
 return undefined;
 }
}

function zodErrorsToMap(err: import("zod").ZodError): Record<string, string> {
 const flat = err.flatten().fieldErrors;
 const out: Record<string, string> = {};
 for (const [k, v] of Object.entries(flat)) {
 if (v?.[0]) out[k] = v[0];
 }
 return out;
}

function apiErrorsToMap(errors: Record<string, string[]>): Record<string, string> {
 const out: Record<string, string> = {};
 for (const [k, arr] of Object.entries(errors)) {
 if (arr?.length) out[k] = arr.length > 1 ? arr.join("; ") : arr[0]!;
 }
 return out;
}

type GallerySlot = {
 file: File | null;
 preview: string | null;
 serverUrl?: string;
};

type ThumbnailState = {
 file: File | null;
 preview: string | null;
 serverPath?: string;
};

const emptyGallery = (): GallerySlot[] =>
 Array.from({ length: PRODUCT_GALLERY_SLOTS }, () => ({
 file: null,
 preview: null,
 serverUrl: undefined,
 }));

export default function SupplierProductsPage() {
 const [products, setProducts] = useState<SupplierProduct[]>([]);
 const [categories, setCategories] = useState<supplierProductService.ProductCategory[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 const [query, setQuery] = useState<supplierProductService.QuerySupplierProductDto>({
 page: 1,
 limit: 10,
 search: "",
 status: "",
 });

 const [showForm, setShowForm] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);

 const [form, setForm] = useState({
 user_id: "",
 category_id: 0,
 product_name: "",
 slug: "",
 sku_code: "",
 hsn_code: "",
 description: "",
 min_price: "",
 max_price: "",
 moq: "",
 monthly_capacity: "",
 lead_time: "",
 availability: "" as "" | ProductAvailability,
 video_url: "",
 color_options: "",
 export_ready: false,
 search_tags: "",
 status: ProductStatus.DRAFT as ProductStatus | "",
 });

 const [thumbnail, setThumbnail] = useState<ThumbnailState>({
 file: null,
 preview: null,
 serverPath: undefined,
 });

 const [gallery, setGallery] = useState<GallerySlot[]>(emptyGallery);

 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

 const availabilityOptions = useMemo(() => Object.values(ProductAvailability) as ProductAvailability[],
 []);
 const statusOptions = useMemo(() => Object.values(ProductStatus) as ProductStatus[], []);

 const fetchData = useCallback(async () => {
 setIsLoading(true);
 try {
 const [productsRes, categoriesRes] = await Promise.all([
 supplierProductService.getProducts(query),
 supplierProductService.getProductCategories(),
 ]);

 if (productsRes.success) {
 const data = productsRes.data;
 setProducts(Array.isArray(data) ? data : data.data);
 }
 if (categoriesRes.success) {
 const data = categoriesRes.data;
 setCategories(Array.isArray(data) ? data : data.data || []);
 }
 } catch (error) {
 console.error("Fetch error:", error);
 toast.error("Failed to load products");
 } finally {
 setIsLoading(false);
 }
 }, [query]);

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect -- load list when filters change
 void fetchData();
 }, [fetchData]);

 const resetMedia = useCallback(() => {
 setThumbnail((prev) => {
 revokeIfBlob(prev.preview);
 return { file: null, preview: null, serverPath: undefined };
 });
 setGallery((prev) => {
 prev.forEach((g) => revokeIfBlob(g.preview));
 return emptyGallery();
 });
 }, []);

 const resetForm = useCallback(() => {
 setForm({
 user_id: "",
 category_id: 0,
 product_name: "",
 slug: "",
 sku_code: "",
 hsn_code: "",
 description: "",
 min_price: "",
 max_price: "",
 moq: "",
 monthly_capacity: "",
 lead_time: "",
 availability: "",
 video_url: "",
 color_options: "",
 export_ready: false,
 search_tags: "",
 status: ProductStatus.DRAFT,
 });
 setFieldErrors({});
 resetMedia();
 }, [resetMedia]);

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
 const { name, value, type } = e.target as HTMLInputElement;
 setFieldErrors((prev) => {
 const next = {...prev };
 delete next[name];
 return next;
 });
 if (type === "checkbox") {
 setForm((prev) => ({...prev, [name]: (e.target as HTMLInputElement).checked }));
 return;
 }
 setForm((prev) => ({...prev, [name]: value }));
 };

 const onThumbnailFile = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 e.target.value = "";
 if (!file) return;
 if (!file.type.startsWith("image/")) {
 toast.error("Please choose an image file");
 return;
 }
 setThumbnail((prev) => {
 revokeIfBlob(prev.preview);
 return {
 file,
 preview: URL.createObjectURL(file),
 serverPath: undefined,
 };
 });
 setFieldErrors((p) => {
 const n = {...p };
 delete n.thumbnail_image;
 return n;
 });
 };

 const clearThumbnail = () => {
 setThumbnail((prev) => {
 revokeIfBlob(prev.preview);
 return { file: null, preview: null, serverPath: undefined };
 });
 };

 const onGallerySlotChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 e.target.value = "";
 if (!file) return;
 if (!file.type.startsWith("image/")) {
 toast.error("Please choose an image file");
 return;
 }
 setGallery((prev) => {
 const next = [...prev];
 const slot = {...next[index]! };
 revokeIfBlob(slot.preview);
 slot.file = file;
 slot.preview = URL.createObjectURL(file);
 slot.serverUrl = undefined;
 next[index] = slot;
 return next;
 });
 };

 const handleEdit = (product: SupplierProduct) => {
 setEditingId(product.id);
 setForm({
 user_id: product.user_id != null ? String(product.user_id) : "",
 category_id: product.category_id,
 product_name: product.product_name,
 slug: product.slug || "",
 sku_code: product.sku_code || "",
 hsn_code: product.hsn_code || "",
 description: product.description || "",
 min_price: product.min_price != null ? String(product.min_price) : "",
 max_price: product.max_price != null ? String(product.max_price) : "",
 moq: product.moq != null ? String(product.moq) : "",
 monthly_capacity: product.monthly_capacity || "",
 lead_time: product.lead_time || "",
 availability: normalizeProductAvailability(product.availability) || "",
 video_url: product.video_url || "",
 color_options: product.color_options || "",
 export_ready: Boolean(product.export_ready),
 search_tags: product.search_tags || "",
 status: normalizeProductStatus(product.status) || ProductStatus.DRAFT,
 });
 setFieldErrors({});

 setThumbnail((prev) => {
 revokeIfBlob(prev.preview);
 const thumbUrl = resolveAssetUrl(product.thumbnail_image ?? undefined);
 return {
 file: null,
 preview: thumbUrl,
 serverPath: product.thumbnail_image?.trim() || undefined,
 };
 });

 setGallery((prev) => {
 prev.forEach((g) => revokeIfBlob(g.preview));
 const next = emptyGallery();
 const imgs = product.product_images;
 if (Array.isArray(imgs)) {
 imgs.slice(0, PRODUCT_GALLERY_SLOTS).forEach((url, i) => {
 const resolved = resolveAssetUrl(url);
 next[i] = {
 file: null,
 preview: resolved,
 serverUrl: typeof url === "string" ? url : undefined,
 };
 });
 }
 return next;
 });

 setShowForm(true);
 window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const handleDelete = async (id: number) => {
 if (!confirm("Are you sure you want to delete this product?")) return;

 try {
 const res = await supplierProductService.deleteProduct(id);
 if (res.success) {
 toast.success("Product deleted successfully");
 fetchData();
 } else {
 toast.error("Failed to delete product");
 }
 } catch (err) {
 if (err instanceof ApiError) {
 toast.error(err.message);
 } else {
 toast.error("An error occurred during deletion");
 }
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setFieldErrors({});

 const storedId = getStoredUserId();

 const parsed = supplierProductFormSchema.safeParse({
 user_id: form.user_id.trim() === "" ? undefined : Number(form.user_id),
 category_id: form.category_id,
 product_name: form.product_name,
 slug: form.slug,
 sku_code: form.sku_code,
 hsn_code: form.hsn_code,
 description: form.description,
 min_price: form.min_price,
 max_price: form.max_price,
 moq: form.moq,
 monthly_capacity: form.monthly_capacity,
 lead_time: form.lead_time,
 availability: form.availability,
 video_url: form.video_url,
 color_options: form.color_options,
 export_ready: form.export_ready,
 search_tags: form.search_tags,
 status: form.status || undefined,
 });

 if (!parsed.success) {
 setFieldErrors(zodErrorsToMap(parsed.error));
 toast.error("Please fix the highlighted fields");
 return;
 }

 const v = parsed.data;
 const existingGalleryUrls = gallery
.map((s) => s.serverUrl)
.filter((u): u is string => Boolean(u?.trim()));

 const dto = supplierProductService.supplierProductDtoFromForm({
...v,
 user_id: v.user_id ?? storedId,
 thumbnail_image: thumbnail.file ? undefined : thumbnail.serverPath,
 product_images: existingGalleryUrls.length ? existingGalleryUrls : undefined,
 });

 const productFiles = {
 thumbnail: thumbnail.file,
 productImages: gallery.map((s) => s.file).filter((f): f is File => f != null),
 };

 try {
 let res;
 if (editingId) {
 res = await supplierProductService.updateProduct(editingId, dto, { files: productFiles });
 } else {
 res = await supplierProductService.createProduct(dto, { files: productFiles });
 }

 if (res.success) {
 toast.success(editingId ? "Product updated" : "Product created");
 setShowForm(false);
 setEditingId(null);
 resetForm();
 fetchData();
 } else {
 toast.error("Operation failed");
 }
 } catch (err) {
 if (err instanceof ApiError) {
 if (err.errors) {
 setFieldErrors(apiErrorsToMap(err.errors));
 }
 toast.error(err.message);
 } else {
 toast.error("An error occurred. Please try again.");
 }
 }
 };

 const err = (name: string) => fieldErrors[name];

 return (<div className="dashboard-content">
 <header
 className="page-title"
 style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
 >
 <div>
 <span className="eyebrow">Product Management</span>
 <h1>Product Catalogue</h1>
 <p>Create detailed product records with business capacity and availability details.</p>
 </div>
 {!showForm && (<button
 type="button"
 onClick={() => {
 setEditingId(null);
 resetForm();
 setShowForm(true);
 }}
 className="btn"
 >
 <FaPlus /> Add New Product
 </button>)}
 </header>

 {fieldErrors.form && (<div className="panel" style={{ borderColor: "#fecaca", background: "#fef2f2", marginBottom: 16 }}>
 <p style={{ margin: 0, color: "#b91c1c" }}>{fieldErrors.form}</p>
 </div>)}

 {showForm && (<section className="panel" id="product-form-section">
 <div className="panel-head">
 <div>
 <h2>{editingId ? "Edit Product" : "Create New Product"}</h2>
 <p className="panel-meta">Enter details for your product listing.</p>
 </div>
 <button
 type="button"
 onClick={() => {
 setShowForm(false);
 setEditingId(null);
 resetForm();
 }}
 className="btn-ghost"
 >
 Cancel
 </button>
 </div>

 <form onSubmit={handleSubmit} className="stack-form">
 <div className="form-grid">
 <div className="form-field full-span">
 <label>Product Name *</label>
 <input
 type="text"
 name="product_name"
 className="text-field"
 value={form.product_name}
 onChange={handleInputChange}
 placeholder="Premium Leather Duffel Bag"
 required
 />
 {err("product_name") && (<p className="supplier-field-error">{err("product_name")}</p>)}
 </div>

 <div className="form-field">
 <label>Category *</label>
 <select
 name="category_id"
 className="select-field"
 value={form.category_id}
 onChange={(e) =>
 setForm((p) => ({...p, category_id: Number(e.target.value) || 0 }))
 }
 required
 >
 <option value={0}>Select Category</option>
 {categories.map((cat, index) => (<option key={cat.value || `cat-form-${index}`} value={cat.value}>
 {cat.label}
 </option>))}
 </select>
 {err("category_id") && (<p className="supplier-field-error">{err("category_id")}</p>)}
 </div>

 <div className="form-field">
 <label>Status</label>
 <select name="status" className="select-field" value={form.status} onChange={handleInputChange}>
 {statusOptions.map((s) => (<option key={s} value={s}>
 {PRODUCT_STATUS_LABELS[s]}
 </option>))}
 </select>
 {err("status") && <p className="supplier-field-error">{err("status")}</p>}
 </div>

 <div className="form-field">
 <label>Slug</label>
 <input
 type="text"
 name="slug"
 className="text-field"
 value={form.slug}
 onChange={handleInputChange}
 placeholder="leather-duffel-bag"
 />
 {err("slug") && <p className="supplier-field-error">{err("slug")}</p>}
 </div>

 <div className="form-field">
 <label>SKU Code</label>
 <input
 type="text"
 name="sku_code"
 className="text-field"
 value={form.sku_code}
 onChange={handleInputChange}
 />
 {err("sku_code") && <p className="supplier-field-error">{err("sku_code")}</p>}
 </div>

 <div className="form-field">
 <label>HSN Code</label>
 <input
 type="text"
 name="hsn_code"
 className="text-field"
 value={form.hsn_code}
 onChange={handleInputChange}
 />
 {err("hsn_code") && <p className="supplier-field-error">{err("hsn_code")}</p>}
 </div>

 <div className="form-field">
 <label>Min Price (₹)</label>
 <input
 type="number"
 name="min_price"
 min={0}
 step="0.01"
 className="text-field"
 value={form.min_price}
 onChange={handleInputChange}
 />
 {err("min_price") && <p className="supplier-field-error">{err("min_price")}</p>}
 </div>

 <div className="form-field">
 <label>Max Price (₹)</label>
 <input
 type="number"
 name="max_price"
 min={0}
 step="0.01"
 className="text-field"
 value={form.max_price}
 onChange={handleInputChange}
 />
 {err("max_price") && <p className="supplier-field-error">{err("max_price")}</p>}
 </div>

 <div className="form-field">
 <label>MOQ</label>
 <input
 type="number"
 name="moq"
 min={1}
 className="text-field"
 value={form.moq}
 onChange={handleInputChange}
 placeholder="Minimum order quantity"
 />
 {err("moq") && <p className="supplier-field-error">{err("moq")}</p>}
 </div>

 <div className="form-field">
 <label>Monthly capacity</label>
 <input
 type="text"
 name="monthly_capacity"
 className="text-field"
 value={form.monthly_capacity}
 onChange={handleInputChange}
 />
 {err("monthly_capacity") && (<p className="supplier-field-error">{err("monthly_capacity")}</p>)}
 </div>

 <div className="form-field">
 <label>Lead time</label>
 <input
 type="text"
 name="lead_time"
 className="text-field"
 value={form.lead_time}
 onChange={handleInputChange}
 placeholder="e.g. 2–3 weeks"
 />
 {err("lead_time") && <p className="supplier-field-error">{err("lead_time")}</p>}
 </div>

 <div className="form-field">
 <label>Availability</label>
 <select
 name="availability"
 className="select-field"
 value={form.availability}
 onChange={handleInputChange}
 >
 <option value="">Not set</option>
 {availabilityOptions.map((a) => (<option key={a} value={a}>
 {PRODUCT_AVAILABILITY_LABELS[a]}
 </option>))}
 </select>
 {err("availability") && (<p className="supplier-field-error">{err("availability")}</p>)}
 </div>

 <div className="form-field full-span" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
 <input
 type="checkbox"
 name="export_ready"
 id="export_ready"
 checked={form.export_ready}
 onChange={handleInputChange}
 />
 <label htmlFor="export_ready" style={{ margin: 0 }}>
 Export ready
 </label>
 </div>

 <div className="form-field full-span">
 <label>Description</label>
 <textarea
 name="description"
 className="textarea-field"
 value={form.description}
 onChange={handleInputChange}
 placeholder="Describe the product, materials, craftsmanship..."
 rows={4}
 />
 {err("description") && (<p className="supplier-field-error">{err("description")}</p>)}
 </div>

 <div className="form-field full-span">
 <label>Thumbnail image</label>
 <p className="supplier-upload-help">Main image for listings and detail pages.</p>
 <div className="supplier-upload-grid supplier-upload-grid--images">
 <label
 className={`supplier-upload-card supplier-upload-card--image${
 thumbnail.preview ? " supplier-upload-card--filled" : ""
 }`}
 >
 <input
 type="file"
 accept="image/*"
 className="supplier-upload-card__file"
 onChange={onThumbnailFile}
 />
 {thumbnail.preview ? (<Image className="supplier-upload-card__preview" src={thumbnail.preview} alt="" width={200} height={150} unoptimized />) : (<div className="supplier-upload-card__placeholder">
 <span className="supplier-upload-card__icons" aria-hidden>
 <FaImage className="supplier-upload-card__icon supplier-upload-card__icon--back" />
 <FaImage className="supplier-upload-card__icon supplier-upload-card__icon--front" />
 </span>
 <span className="supplier-upload-card__add" aria-hidden>
 <FaPlus />
 </span>
 </div>)}
 </label>
 </div>
 {(thumbnail.file || thumbnail.serverPath) && (<button type="button" className="btn-ghost" style={{ marginTop: 8 }} onClick={clearThumbnail}>
 Remove thumbnail
 </button>)}
 {err("thumbnail_image") && (<p className="supplier-field-error">{err("thumbnail_image")}</p>)}
 </div>

 <div className="form-field full-span">
 <label>Product images</label>
 <p className="supplier-upload-help">
 Up to {PRODUCT_GALLERY_SLOTS} gallery images (multipart upload).
 </p>
 <div className="supplier-upload-grid supplier-upload-grid--images">
 {gallery.map((slot, index) => {
 const preview = slot.preview;
 return (<label
 key={`product-image-slot-${index}`}
 className={`supplier-upload-card supplier-upload-card--image${
 preview ? " supplier-upload-card--filled" : ""
 }`}
 >
 <input
 type="file"
 accept="image/*"
 className="supplier-upload-card__file"
 onChange={onGallerySlotChange(index)}
 />
 {preview ? (<Image className="supplier-upload-card__preview" src={preview} alt="" width={200} height={150} unoptimized />) : (<div className="supplier-upload-card__placeholder">
 <span className="supplier-upload-card__icons" aria-hidden>
 <FaImage className="supplier-upload-card__icon supplier-upload-card__icon--back" />
 <FaImage className="supplier-upload-card__icon supplier-upload-card__icon--front" />
 </span>
 <span className="supplier-upload-card__add" aria-hidden>
 <FaPlus />
 </span>
 </div>)}
 </label>);
 })}
 </div>
 {err("product_images") && (<p className="supplier-field-error">{err("product_images")}</p>)}
 </div>

 <div className="form-field full-span">
 <label htmlFor="product-video-url">Video URL</label>
 <input
 id="product-video-url"
 type="url"
 name="video_url"
 className="text-field"
 value={form.video_url}
 onChange={handleInputChange}
 placeholder="https://www.youtube.com/watch?v=…"
 />
 {err("video_url") && <p className="supplier-field-error">{err("video_url")}</p>}
 </div>

 <div className="form-field">
 <label>Color options</label>
 <input
 type="text"
 name="color_options"
 className="text-field"
 value={form.color_options}
 onChange={handleInputChange}
 placeholder="e.g. Tan, Black, Brown"
 />
 {err("color_options") && (<p className="supplier-field-error">{err("color_options")}</p>)}
 </div>

 <div className="form-field full-span">
 <label>Search tags</label>
 <input
 type="text"
 name="search_tags"
 className="text-field"
 value={form.search_tags}
 onChange={handleInputChange}
 placeholder="Comma-separated: leather, travel, handmade"
 />
 {err("search_tags") && (<p className="supplier-field-error">{err("search_tags")}</p>)}
 </div>
 </div>

 <div className="panel-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
 <button type="submit" className="btn">
 {editingId ? "Update Product" : "Save Product"}
 </button>
 </div>
 </form>
 </section>)}

 <section className="panel" style={{ padding: "15px" }}>
 <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
 <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
 <FaSearch
 style={{
 position: "absolute",
 left: "12px",
 top: "50%",
 transform: "translateY(-50%)",
 color: "#94a3b8",
 }}
 />
 <input
 type="text"
 className="text-field"
 style={{ paddingLeft: "35px" }}
 placeholder="Search by name or SKU..."
 value={query.search}
 onChange={(e) => setQuery((prev) => ({...prev, search: e.target.value, page: 1 }))}
 />
 </div>
 <select
 className="select-field"
 style={{ width: "200px" }}
 value={query.status}
 onChange={(e) => setQuery((prev) => ({...prev, status: e.target.value, page: 1 }))}
 >
 <option value="">All status</option>
 {statusOptions.map((s) => (<option key={s} value={s}>
 {PRODUCT_STATUS_LABELS[s]}
 </option>))}
 </select>
 <select
 className="select-field"
 style={{ width: "200px" }}
 value={query.category_id || ""}
 onChange={(e) =>
 setQuery((prev) => ({
...prev,
 category_id: e.target.value ? Number(e.target.value) : undefined,
 page: 1,
 }))
 }
 >
 <option key="all" value="">
 All Categories
 </option>
 {categories.map((cat, index) => (<option key={cat.value || `cat-filter-${index}`} value={cat.value}>
 {cat.label}
 </option>))}
 </select>
 </div>
 </section>

 <section className="panel">
 <div className="panel-head">
 <div>
 <h2>Your Products</h2>
 <p className="panel-meta">List of products in your catalogue.</p>
 </div>
 </div>
 <div className="table-shell">
 <table className="data-table">
 <thead>
 <tr>
 <th style={{ width: 72 }}>Image</th>
 <th>Product</th>
 <th>Category</th>
 <th>Price (₹)</th>
 <th>MOQ</th>
 <th>Availability</th>
 <th>Export</th>
 <th>Status</th>
 <th>Tags</th>
 <th>Video</th>
 <th>Approval</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {isLoading ? (<tr key="loading">
 <td colSpan={12} style={{ textAlign: "center", padding: "40px" }}>
 Loading products...
 </td>
 </tr>) : products.length === 0 ? (<tr key="empty">
 <td colSpan={12} style={{ textAlign: "center", padding: "40px" }}>
 No products found
 </td>
 </tr>) : (products.map((product, index) => {
 const thumb = resolveAssetUrl(product.thumbnail_image ?? undefined);
 const statusNorm = normalizeProductStatus(product.status);
 const isActive = statusNorm === ProductStatus.ACTIVE;
 return (<tr key={product.id || `product-${index}`}>
 <td>
 {thumb ? (<Image
 src={thumb}
 alt=""
 width={48}
 height={48}
 unoptimized
 style={{
 objectFit: "cover",
 borderRadius: 8,
 border: "1px solid #e2e8f0",
 }}
 />) : (<span className="micro-copy">—</span>)}
 </td>
 <td>
 <Link href={`/supplier/products/${product.id}`} style={{ fontWeight: 600 }}>
 {product.product_name}
 </Link>
 <div className="micro-copy">{product.sku_code || "No SKU"}</div>
 </td>
 <td>{product.category?.name || product.category_name || "N/A"}</td>
 <td>
 {product.min_price != null || product.max_price != null
 ? `${product.min_price ?? "—"} – ${product.max_price ?? "—"}`
 : "—"}
 </td>
 <td>{product.moq ?? "—"}</td>
 <td>{formatAvailability(product.availability)}</td>
 <td>{product.export_ready ? "Yes" : "No"}</td>
 <td>
 <span
 className={`status-badge ${
 isActive ? "status-success" : "status-warning"
 }`}
 >
 {formatStatus(product.status)}
 </span>
 </td>
 <td style={{ maxWidth: 140 }} className="micro-copy">
 {product.search_tags ? (<span title={product.search_tags}>
 {product.search_tags.length > 40
 ? `${product.search_tags.slice(0, 40)}…`
 : product.search_tags}
 </span>) : ("—")}
 </td>
 <td>
 {product.video_url?.trim() ? (<a
 href={product.video_url.trim()}
 target="_blank"
 rel="noopener noreferrer"
 className="btn-outline"
 style={{ padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 6 }}
 >
 <FaExternalLinkAlt size={12} /> Open
 </a>) : ("—")}
 </td>
 <td>
 <span
 className={`status-badge ${
 product.approval_status === "Approved"
 ? "status-success"
 : product.approval_status === "Rejected"
 ? "status-danger"
 : "status-info"
 }`}
 >
 {product.approval_status || "Pending"}
 </span>
 </td>
 <td>
 <div className="table-actions">
 <Link href={`/supplier/products/${product.id}`} className="btn-outline" title="View">
 View
 </Link>
 <button
 type="button"
 onClick={() => handleEdit(product)}
 className="btn-outline"
 title="Edit"
 >
 <FaEdit />
 </button>
 <button
 type="button"
 onClick={() => handleDelete(product.id)}
 className="btn-ghost"
 title="Delete"
 style={{ color: "#ef4444" }}
 >
 <FaTrash />
 </button>
 </div>
 </td>
 </tr>);
 }))}
 </tbody>
 </table>
 </div>
 </section>
 </div>);
}
