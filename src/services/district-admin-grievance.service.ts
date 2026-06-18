import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { getDistrictAdminToken } from "@/lib/district-admin/session";
import {
  withDistrictAdminAuth,
  unwrapEntity,
  unwrapList,
} from "./district-admin-api";
import type {
  GrievanceDashboardData,
  GrievanceReportData,
  GrievanceReportType,
  GrievanceTicket,
  GrievanceTicketListQuery,
  UpdateTicketStatusPayload,
} from "@/types/grievance-ticket";

function cleanQuery(
  query: GrievanceTicketListQuery
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

export async function listDistrictGrievanceTickets(
  query: GrievanceTicketListQuery = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.districtAdmin.grievances, {
    ...withDistrictAdminAuth(options),
    params: cleanQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      ...query,
    }),
  });
  return unwrapList<GrievanceTicket>(res.data);
}

export async function getDistrictGrievanceTicket(
  id: number | string,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.districtAdmin.grievanceDetail(id),
    { ...withDistrictAdminAuth(options) }
  );
  const entity = unwrapEntity<GrievanceTicket>(res.data);
  return { ...res, data: entity };
}

export async function updateDistrictGrievanceStatus(
  id: number | string,
  payload: UpdateTicketStatusPayload,
  options?: RequestOptions
) {
  const res = await httpClient.patch<unknown>(
    ENDPOINTS.districtAdmin.grievanceStatusUpdate(id),
    payload,
    { ...withDistrictAdminAuth(options) }
  );
  const entity = unwrapEntity<GrievanceTicket>(res.data);
  return { ...res, data: entity };
}

export async function getDistrictGrievanceDashboard(
  query?: {
    scheme_id?: string | number;
    date_from?: string;
    date_to?: string;
  },
  options?: RequestOptions
): Promise<GrievanceDashboardData | null> {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.districtAdmin.grievanceDashboard,
    {
      ...withDistrictAdminAuth(options),
      params: query,
    }
  );
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === "object" && "summary" in inner) {
      return inner as GrievanceDashboardData;
    }
  }
  if (body && typeof body === "object" && "summary" in body) {
    return body as GrievanceDashboardData;
  }
  return null;
}

export async function getDistrictGrievanceReports(
  query: {
    report_type?: GrievanceReportType;
    scheme_id?: string | number;
    date_from?: string;
    date_to?: string;
  },
  options?: RequestOptions
): Promise<GrievanceReportData | null> {
  const res = await httpClient.get<unknown>(
    ENDPOINTS.districtAdmin.grievanceReports,
    {
      ...withDistrictAdminAuth(options),
      params: query,
    }
  );
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === "object" && "rows" in inner) {
      return inner as GrievanceReportData;
    }
  }
  if (body && typeof body === "object" && "rows" in body) {
    return body as GrievanceReportData;
  }
  return null;
}

export async function exportDistrictGrievances(
  query: GrievanceTicketListQuery,
  format: "csv" | "excel"
) {
  const token = getDistrictAdminToken();
  const headers: Record<string, string> = {
    Accept:
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const qs = new URLSearchParams();
  qs.set("format", format);
  for (const [key, value] of Object.entries(cleanQuery(query))) {
    qs.set(key, String(value));
  }

  const url = `${ENDPOINTS.districtAdmin.grievanceExport}?${qs.toString()}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error("Export failed");
  }
  const blob = await response.blob();
  const ext = format === "excel" ? "xlsx" : "csv";
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `grievance_report_${new Date().toISOString().split("T")[0]}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
}
