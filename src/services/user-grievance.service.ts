import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import { unwrapEntity, unwrapList } from "@/services/district-admin-api";
import type {
  GrievanceTicket,
  GrievanceTicketListQuery,
} from "@/types/grievance-ticket";

export async function listUserGrievanceTickets(
  query: GrievanceTicketListQuery = {},
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.users.grievances, {
    ...options,
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
  });
  return unwrapList<GrievanceTicket>(res.data);
}

export async function getUserGrievanceTicket(
  id: number | string,
  options?: RequestOptions
) {
  const res = await httpClient.get<unknown>(ENDPOINTS.users.grievanceDetail(id), options);
  const entity = unwrapEntity<GrievanceTicket>(res.data);
  return { ...res, data: entity };
}

export async function addUserGrievanceComment(
  id: number | string,
  remarks: string,
  options?: RequestOptions
) {
  return httpClient.post<unknown>(
    ENDPOINTS.users.grievanceComments(id),
    { remarks: remarks.trim() },
    options
  );
}
