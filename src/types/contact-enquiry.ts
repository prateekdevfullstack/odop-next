import type { ActivityLogItem, TicketStatus } from "@/types/grievance-ticket";

export type ContactEnquiryStatus = TicketStatus;

export interface EnquiryQueryCategoryOption {
  id: number;
  category_title: string;
}

export interface ContactEnquiry {
  id: number;
  ticket_number: string;
  status: ContactEnquiryStatus;
  full_name: string;
  email: string | null;
  mobile_number: string;
  district_id: number;
  district_name: string | null;
  query_category_id: number;
  category_title: string | null;
  organization_name: string | null;
  message: string | null;
  assigned_admin_id: number | null;
  assigned_admin_name: string | null;
  admin_remark: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  activity_log?: ActivityLogItem[];
}

export type ContactEnquiryListQuery = {
  page?: number;
  limit?: number;
  status?: string;
  query_category_id?: string | number;
  ticket_number?: string;
  mobile_number?: string;
  date_from?: string;
  date_to?: string;
  q?: string;
};

export interface CreateContactEnquiryPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  district_id: number;
  query_category_id?: number;
  organization_name?: string;
  message: string;
}

export interface CreateContactEnquiryResult {
  id: number;
  ticket_number: string;
  status: ContactEnquiryStatus;
}

export interface UpdateContactEnquiryStatusPayload {
  status: ContactEnquiryStatus;
  admin_remark?: string;
}
