import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { getDistrictSupervisorToken } from "@/lib/district-supervisor/session";
import type {
  PhoneAccessLogEntry,
  PhoneAccessLogsResponse,
} from "@/types/user-access";

export type DistrictProfileSummaryItem = {
  districtId: number;
  district: string;
  totalArtisans: number;
  totalExporters: number;
  totalManufacturers: number;
  artisanPhoneAccessLogCount: number;
  exporterPhoneAccessLogCount: number;
  manufacturerPhoneAccessLogCount: number;
};

export type DistrictProfileSummaryData = {
  totalArtisans: number;
  totalExporters: number;
  totalManufacturers: number;
  data: DistrictProfileSummaryItem[];
};

export type DistrictProfileSummaryResponse = {
  success: boolean;
  message: string;
  data: DistrictProfileSummaryData;
};

const EMPTY_DISTRICT_COUNTS = {
  totalArtisans: 0,
  totalExporters: 0,
  totalManufacturers: 0,
  artisanPhoneAccessLogCount: 0,
  exporterPhoneAccessLogCount: 0,
  manufacturerPhoneAccessLogCount: 0,
};

function withRequestedDistrictFallback(
  response: DistrictProfileSummaryResponse,
  districtId?: number | string,
  districtName?: string
): DistrictProfileSummaryResponse {
  if (!districtId || !districtName || response.data.data.length > 0) {
    return response;
  }

  return {
    ...response,
    data: {
      ...EMPTY_DISTRICT_COUNTS,
      data: [
        {
          districtId: Number(districtId),
          district: districtName,
          ...EMPTY_DISTRICT_COUNTS,
        },
      ],
    },
  };
}

export async function getSupervisorAccessedSuppliers(
  params?: {
    district_id?: string | number;
    page?: number;
  },
  options?: RequestOptions
): Promise<{
  logs: PhoneAccessLogEntry[];
  meta: { total: number; current_page: number; last_page: number; per_page: number };
}> {
  const token = getDistrictSupervisorToken();
  const response = await httpClient.get<PhoneAccessLogsResponse>(
    ENDPOINTS.supplierPhoneAccessLogs,
    {
      ...options,
      params: {
        ...options?.params,
        ...(params?.district_id ? { district_id: params.district_id } : {}),
        ...(params?.page ? { page: params.page } : {}),
      },
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      skipAuth: true,
    }
  );

  const body = response.data as unknown as PhoneAccessLogsResponse;
  const logs = Array.isArray(body?.data) ? body.data : [];
  return {
    logs,
    meta: body?.meta ?? { total: 0, current_page: 1, last_page: 1, per_page: 10 },
  };
}

export async function fetchDistrictProfileSummary(
  districtId?: number | string,
  districtName?: string,
  options?: RequestOptions
) {
  const token = getDistrictSupervisorToken();
  const response = await httpClient.get<DistrictProfileSummaryResponse>(
    ENDPOINTS.districtAdminSupervisor.profileSummary,
    {
      ...options,
      params: {
        ...options?.params,
        district_id: districtId,
      },
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      skipAuth: true,
    }
  );

  return {
    ...response,
    data: withRequestedDistrictFallback(response.data, districtId, districtName),
  };
}
