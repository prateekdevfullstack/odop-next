export interface AccessedSupplierProfile {
  id: number;
  user_id: number;
  enterprise_name: string;
  proprietor_director_name: string;
  district_id: number | null;
  product_category_id: number | null;
  phone_number: string | null;
}

export interface AccessedSupplierLog {
  id: number;
  accessed_by_user_id: number;
  supplier_id: number;
  createdAt: string;
  supplier: AccessedSupplierProfile;
}

export interface AccessedSuppliersResponse {
  success: boolean;
  message: string;
  data: AccessedSupplierLog[];
}

/* ── New supplier phone access logs API types ── */

export interface PhoneAccessLogEntry {
  id: number;
  accessed_by_user_id: number;
  supplier_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  accessedByUser: {
    id: number;
    name: string;
    email: string;
    mobile_no: string;
  };
  supplier_profile: {
    supplier_type: string;
    profile: {
      id: number;
      user_id: number;
      /** Artisan fields */
      enterprise_name?: string | null;
      address?: string | null;
      district?: string | null;
      enterprise_type?: string | null;
      artisan_type?: string | null;
      /** Exporter fields */
      export_company_name?: string | null;
      office_address?: string | null;
      owner_director_name?: string | null;
      iec_number?: string | null;
      exporter_type?: string | null;
      /** Common fields */
      district_id: number | null;
      product_category_id: number | null;
      contact_person?: string | null;
    };
  };
}

export interface PhoneAccessLogsMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface PhoneAccessLogsResponse {
  success: boolean;
  message: string;
  data: PhoneAccessLogEntry[];
  meta: PhoneAccessLogsMeta;
}
