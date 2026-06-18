export type DistrictAdminUser = {
  id: number;
  name: string;
  email: string;
  mobile_no?: string;
  role_id?: number;
  role_name?: string;
  district_id?: number;
  district_name?: string;
};

export type DistrictAdminAuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: DistrictAdminUser;
    token: string;
  };
};

export type DistrictEntityStatus = 0 | 1;

export type DistrictSupplierUser = {
  id: number;
  name: string;
  email: string;
  mobile_no: string;
  role_id?: number;
};

export type DistrictSupplier = {
  id: number;
  user_id?: number;
  user?: DistrictSupplierUser;
  name?: string;
  email?: string;
  mobile_no?: string;
  enterprise_name?: string;
  registered_address?: string;
  address?: string;
  district?: string;
  district_id?: number;
  product_category_id?: number;
  gst_number?: string;
  udyam_registration?: string;
  website?: string;
  proprietor_director_name?: string;
  pan_number?: string;
  bulk_order?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  productCategory?: { id: number; name?: string };
  product_category?: { id: number; name: string };
  districtMaster?: { id: number; districtName: string; state_id: number; status: number } | null;
};

export type DistrictArtisan = {
  id: number;
  user_id?: number;
  user?: DistrictSupplierUser;
  name?: string;
  email?: string;
  mobile_no?: string;
  enterprise_name: string;
  address: string;
  district: string;
  enterprise_type: string;
  artisan_type?: string;
  district_id?: number;
  product_category_id?: number;
  category_id?: number;
  contact_person?: string;
  pincode?: string;
  gst_number?: string;
  udyam_registration?: string;
  website?: string;
  name_prefix?: string;
  aadhar_number?: string;
  craft_specialization?: string;
  craftSpecialization?: { id: number; product_category_id: number; specialization_name: string } | null;
  production_capacity?: string;
  customized_order?: string;
  social_links?: Record<string, unknown>;
  artisan_description?: string;
  artisan_logo?: string;
  status?: DistrictEntityStatus;
  is_verified?: DistrictEntityStatus;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  product_category?: { id: number; name: string };
  productCategory?: { id: number; name: string };
  category?: { id: number; name: string; slug?: string };
  districtMaster?: { id: number; districtName: string; state_id: number; status: number } | null;
};

export type DistrictExporter = {
  id: number;
  user_id?: number;
  user?: DistrictSupplierUser;
  name?: string;
  email?: string;
  mobile_no?: string;
  export_company_name?: string;
  enterprise_name?: string;
  office_address?: string;
  address?: string;
  district?: string;
  exporter_type?: string;
  district_id?: number;
  product_category_id?: number;
  owner_director_name?: string;
  iec_number?: string;
  rcmc_details?: string;
  year_of_establishment?: string | number;
  designation?: string;
  email_id?: string;
  contact_person?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  productCategory?: { id: number; name?: string };
  product_category?: { id: number; name: string };
  districtMaster?: { id: number; districtName: string; state_id: number; status: number } | null;
};

export type PaginatedMeta = {
  total?: number;
  last_page?: number;
  per_page?: number;
  current_page?: number;
};

export type DistrictEntityListResponse<T> = {
  data?: T[];
  meta?: PaginatedMeta;
};

export type DistrictEntityFormValues = {
  name: string;
  name_prefix: string;
  email: string;
  mobile_no: string;
  enterprise_name: string;
  address: string;
  district: string;
  enterprise_type: string;
  entity_type: string;
  product_category_id: string;
  category_id: string;
  craft_specialization: string;
  contact_person: string;
  pincode: string;
  gst_number: string;
  udyam_registration: string;
  website: string;
  aadhar_number: string;
  production_capacity: string;
  customized_order: string;
  description: string;
  status: string;
  is_verified: string;
  district_id: string;
  registered_address: string;
  proprietor_director_name: string;
  pan_number: string;
  bulk_order: string;
  export_company_name: string;
  office_address: string;
  iec_number: string;
  owner_director_name: string;
  rcmc_details: string;
  year_of_establishment: string;
  designation: string;
  email_id: string;
};
