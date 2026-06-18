export type UnifiedEnquirySourceType = "scheme_enquiry" | "contact_enquiry";
export type UnifiedEnquiryQueryType = "scheme_related" | "general";
export type GrievanceStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Rejected";
export type UnifiedEnquirySortField =
  | "created_at"
  | "updated_at"
  | "status"
  | "ticket_number"
  | "full_name";

export interface UnifiedEnquiryListItem {
  id: number;
  source_type: UnifiedEnquirySourceType;
  query_type: UnifiedEnquiryQueryType;
  ticket_number: string;
  user_id: number | null;
  full_name: string;
  email: string | null;
  mobile_number: string;
  district_id: number;
  district_name: string | null;
  assigned_admin_id: number | null;
  assigned_admin_name: string | null;
  status: GrievanceStatus;
  admin_remark: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  scheme_id?: number | null;
  scheme_name?: string | null;
  product_category_id?: number | null;
  product_category_name?: string | null;
  scheme_query_id?: number | null;
  query_title?: string | null;
  description?: string | null;
  attachment_url?: string | null;
  query_category_id?: number | null;
  category_title?: string | null;
  organization_name?: string | null;
  message?: string | null;
}

export interface UnifiedEnquiryListQuery {
  page?: number;
  limit?: number;
  source_type?: "grievance" | "scheme_enquiry" | "contact_enquiry";
  query_type?: "scheme_related" | "general";
  scheme_id?: number;
  product_category_id?: number;
  query_category_id?: number;
  status?: GrievanceStatus;
  date_from?: string;
  date_to?: string;
  mobile_number?: string;
  ticket_number?: string;
  assigned_admin_id?: number;
  district_id?: number;
  q?: string;
  sort_by?: UnifiedEnquirySortField;
  sort_order?: "asc" | "desc";
}

export interface UnifiedEnquiryListResponse {
  success: true;
  message: string;
  data: UnifiedEnquiryListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
