import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import type { ApiResponse } from "@/lib/api/types";

export interface EventCategory {
  value: number;
  label: string;
}

export interface EventCategoryListResponse {
  success: boolean;
  data: EventCategory[];
}

export interface PublicEvent {
  id: number;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  category_id?: number;
  categoryId?: number;
  eventDateType?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface PaginatedEventsResponse {
  count: number;
  rows: PublicEvent[];
  /** Available months with events for the queried year, e.g. [{ month: 1, name: "January", count: 5 }] */
  months?: Array<{ month: number; name?: string; count?: number }>;
}

export interface FetchEventsParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  categorySlug?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchCategoriesParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchEventCategories(
  params?: FetchCategoriesParams,
  options?: RequestOptions
): Promise<ApiResponse<EventCategoryListResponse>> {
  return httpClient.get<EventCategoryListResponse>(
    ENDPOINTS.eventCategories.list,
    { ...options, params }
  );
}

export async function fetchAllEventCategories(
  options?: RequestOptions
): Promise<ApiResponse<EventCategoryListResponse>> {
  return httpClient.get<EventCategoryListResponse>(
    ENDPOINTS.eventCategories.all,
    options
  );
}

export async function fetchEventCategoryDetail(
  id: string | number,
  options?: RequestOptions
): Promise<ApiResponse<unknown>> {
  return httpClient.get<unknown>(
    ENDPOINTS.eventCategories.detail(id),
    options
  );
}

export async function fetchPublicEvents(
  params?: FetchEventsParams,
  options?: RequestOptions
): Promise<ApiResponse<PaginatedEventsResponse>> {
  return httpClient.get<PaginatedEventsResponse>(
    ENDPOINTS.events.list,
    { ...options, params }
  );
}


export async function fetchPublicGalleryEvents(
  params?: FetchEventsParams,
  options?: RequestOptions
): Promise<ApiResponse<PaginatedEventsResponse>> {
  return httpClient.get<PaginatedEventsResponse>(
    ENDPOINTS.events.gallery,
    {
      ...options,
      params,
    }
  );
}


export interface PastEventItem {
  id: number;
  title?: string;
  description?: string;
  shortDescription?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  venueName?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  badgeText?: string;
  badgeIcon?: string;
  category?: { id: number; name: string; slug: string };
  [key: string]: unknown;
}

export interface PastEventsResponse {
  data?: PastEventItem[] | { rows?: PastEventItem[]; count?: number };
  rows?: PastEventItem[];
  count?: number;
}

export async function fetchPastEvents(
  params?: Record<string, string | number | boolean | null | undefined>,
  options?: RequestOptions
): Promise<ApiResponse<PastEventsResponse>> {
  return httpClient.get<PastEventsResponse>(
    ENDPOINTS.pastEvents.list,
    { ...options, params }
  );
}
