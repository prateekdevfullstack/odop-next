export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Rejected";

export type TicketActionType =
  | "created"
  | "assigned"
  | "status_change"
  | "comment";

export interface ActivityLogItem {
  id: number;
  action_type: TicketActionType;
  old_status: string | null;
  new_status: string | null;
  remarks: string | null;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
}

export interface GrievanceTicket {
  id: number;
  ticket_number: string;
  status: TicketStatus;
  full_name: string;
  email: string | null;
  mobile_number: string;
  district_id: number;
  district_name: string | null;
  scheme_id: number;
  scheme_name: string | null;
  scheme_query_id: number;
  query_title: string | null;
  description: string | null;
  attachment_url: string | null;
  assigned_admin_id: number | null;
  assigned_admin_name: string | null;
  admin_remark: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  activity_log?: ActivityLogItem[];
}

export type GrievanceTicketListQuery = {
  page?: number;
  limit?: number;
  status?: string;
  scheme_id?: string | number;
  date_from?: string;
  date_to?: string;
  ticket_number?: string;
  mobile_number?: string;
  q?: string;
};

export interface DashboardSummary {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  rejected: number;
}

export interface DashboardCountItem {
  scheme_id?: number;
  scheme_name?: string;
  district_id?: number;
  district_name?: string;
  status?: string;
  count: number;
}

export interface GrievanceDashboardData {
  summary: DashboardSummary;
  scheme_wise: DashboardCountItem[];
  district_wise: DashboardCountItem[];
  status_wise: DashboardCountItem[];
}

export type GrievanceReportType =
  | "status"
  | "date"
  | "scheme"
  | "district"
  | "product"
  | "issue";

export interface GrievanceReportRow {
  key: string;
  label: string;
  count: number;
}

export interface GrievanceReportData {
  report_type: GrievanceReportType;
  rows: GrievanceReportRow[];
  total: number;
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus;
  admin_remark?: string;
}
