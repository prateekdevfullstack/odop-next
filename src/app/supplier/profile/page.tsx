"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getProductCategories,
  getSupplierProfile,
  updateSupplierProfile,
  type ProductCategory,
  type SupplierProfile,
  type SupplierProfilePayload,
} from "@/services/supplier-product.service";

type SupplierProfileForm = {
  enterprise_name: string;
  email: string;
  mobile_number: string;
  district: string;
  district_id: string;
  registered_address: string;
  name: string;
  product_category_id: string;
  gst_number: string;
  udyam_registration: string;
  proprietor_director_name: string;
  pan_number: string;
  bulk_order: string;
  website: string;
};

const emptyProfileForm: SupplierProfileForm = {
  enterprise_name: "",
  email: "",
  mobile_number: "",
  district: "",
  district_id: "",
  registered_address: "",
  name: "",
  product_category_id: "",
  gst_number: "",
  udyam_registration: "",
  proprietor_director_name: "",
  pan_number: "",
  bulk_order: "false",
  website: "",
};

function normalizeSupplierProfile(payload: SupplierProfilePayload): SupplierProfile | null {
  if ("data" in payload && payload.data) {
    return payload.data;
  }
  if ("id" in payload) {
    return payload;
  }
  return null;
}

function getCategoryOptionValue(category: ProductCategory): string {
  return String(category.value ?? category.id);
}

export default function SupplierProfilePage() {
  const [formData, setFormData] = useState<SupplierProfileForm>(emptyProfileForm);
  const [categoriesProduct, setCategoriesProduct] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const website = formData.website.trim();
    let formattedWebsite = website;
    if (website && !/^https?:\/\//i.test(website)) {
      formattedWebsite = `https://${website}`;
    }

    const payload = {
      enterprise_name: formData.enterprise_name.trim() || "null",
      registered_address: formData.registered_address.trim() || "null",
      product_category_id: formData.product_category_id ? String(formData.product_category_id) : "null",
      gst_number: formData.gst_number.trim() || "null",
      udyam_registration: formData.udyam_registration.trim() || "null",
      proprietor_director_name: formData.proprietor_director_name.trim() || "null",
      pan_number: formData.pan_number.trim() || "null",
      bulk_order: formData.bulk_order === "true" ? "true" : "false",
      website: formattedWebsite || "null",
      district_id: formData.district_id ? String(formData.district_id) : "null",
    };

    const fd = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      fd.append(key, val);
    });

    setIsSaving(true);
    try {
      await updateSupplierProfile(fd);
      toast.success("Supplier profile updated successfully");
    } catch (error) {
      console.error("Error updating supplier profile:", error);
      toast.error("Failed to update supplier profile");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchSupplierProfile() {
      setIsLoading(true);
      try {
        const [categoriesResponse, response] = await Promise.all([
          getProductCategories(),
          getSupplierProfile(),
        ]);
        const categoriesData = categoriesResponse.data;
        const profile = normalizeSupplierProfile(response.data);

        if (isMounted) {
          setCategoriesProduct(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || []);
        }

        if (isMounted && profile) {
          setFormData({
            enterprise_name: profile.enterprise_name || "",
            email: profile.user?.email || "",
            mobile_number: profile.user?.mobile_no || "",
            district: profile.districtMaster?.districtName || profile.district || "",
            district_id: profile.district_id != null ? String(profile.district_id) : "",
            registered_address: profile.registered_address || profile.address || "",
            name: profile.user?.name || "",
            product_category_id: profile.product_category_id != null ? String(profile.product_category_id) : "",
            gst_number: profile.gst_number || "",
            udyam_registration: profile.udyam_registration || "",
            proprietor_director_name: profile.proprietor_director_name || "",
            pan_number: profile.pan_number || "",
            bulk_order: profile.bulk_order === true || String(profile.bulk_order) === "true" ? "true" : "false",
            website: profile.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching supplier profile:", error);
        if (isMounted) {
          toast.error("Failed to load supplier profile");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSupplierProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <span className="eyebrow">Supplier Identity</span>
        <h1>Supplier Profile</h1>
        <p>Maintain your business details and contact information for buyers.</p>
      </header>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Business Information</h2>
            <p className="panel-meta">Publicly visible details on the ODOP portal.</p>
          </div>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>District</label>
              <input
                type="text"
                className="text-field"
                value={formData.district}
                readOnly
                placeholder={isLoading ? "Loading..." : "District"}
              />
            </div>

            <div className="form-field">
              <label>Product Category</label>
              <select
                className="select-field"
                name="product_category_id"
                value={formData.product_category_id}
                onChange={handleInputChange}
                disabled={isLoading || isSaving}
              >
                <option value="">{isLoading ? "Loading..." : "Select product category"}</option>
                {categoriesProduct.map((categoryProduct, index) => {
                  const optionValue = getCategoryOptionValue(categoryProduct);
                  return (
                    <option
                      key={`${optionValue}-${index}`}
                      value={optionValue}
                    >
                      {categoryProduct.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label>Business / Firm Name</label>
              <input
                type="text"
                className="text-field"
                name="enterprise_name"
                value={formData.enterprise_name}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "Business name"}
              />
            </div>

            <div className="form-field">
              <label>Proprietor/Director Name</label>
              <input
                type="text"
                className="text-field"
                name="proprietor_director_name"
                value={formData.proprietor_director_name}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "Proprietor/Director name"}
              />
            </div>

            <div className="form-field">
              <label>PAN Number</label>
              <input
                type="text"
                className="text-field"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "PAN number"}
              />
            </div>

            <div className="form-field">
              <label>Accepts Bulk Orders</label>
              <select
                className="select-field"
                name="bulk_order"
                value={formData.bulk_order}
                onChange={handleInputChange}
                disabled={isLoading || isSaving}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="form-field">
              <label>Owner name</label>
              <input
                type="text"
                className="text-field"
                value={formData.name}
                readOnly
                placeholder={isLoading ? "Loading..." : "Name"}
              />
            </div>

            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                className="text-field"
                value={formData.email}
                readOnly
                placeholder={isLoading ? "Loading..." : "Email address"}
              />
            </div>

            <div className="form-field">
              <label>Mobile Number</label>
              <input
                type="text"
                className="text-field"
                value={formData.mobile_number}
                readOnly
                placeholder={isLoading ? "Loading..." : "Mobile number"}
              />
            </div>

            <div className="form-field">
              <label>GST Number</label>
              <input
                type="text"
                className="text-field"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "GST number"}
              />
            </div>

            <div className="form-field">
              <label>Udyam Registration</label>
              <input
                type="text"
                className="text-field"
                name="udyam_registration"
                value={formData.udyam_registration}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "Udyam registration"}
              />
            </div>

            <div className="form-field">
              <label>Website</label>
              <input
                type="text"
                className="text-field"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "https://example.com"}
              />
            </div>

            <div className="form-field full-span">
              <label>Registered Address</label>
              <textarea
                className="textarea-field"
                name="registered_address"
                value={formData.registered_address}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "Registered address"}
              />
            </div>
          </div>

          <div className="panel-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn" disabled={isLoading || isSaving}>
              {isSaving ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
