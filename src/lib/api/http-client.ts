import { API_CONFIG, HTTP_STATUS } from "./config";
import { notifyAuthChange } from "@/lib/auth-events";
import { ApiError, ApiResponse, RequestOptions, HttpMethod } from "./types";

function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    [HTTP_STATUS.BAD_REQUEST]: "Bad request. Please check your input.",
    [HTTP_STATUS.UNAUTHORIZED]: "Authentication required. Please log in.",
    [HTTP_STATUS.FORBIDDEN]: "You do not have permission to access this resource.",
    [HTTP_STATUS.NOT_FOUND]: "The requested resource was not found.",
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: "Validation failed. Please check the submitted data.",
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "An internal server error occurred. Please try again later.",
    [HTTP_STATUS.BAD_GATEWAY]: "Bad gateway. The server received an invalid response.",
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable. Please try again later.",
    [HTTP_STATUS.GATEWAY_TIMEOUT]: "Gateway timeout. The server took too long to respond.",
  };
  return messages[status] || `Request failed with status ${status}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function handleErrorResponse(response: Response): Promise<never> {
  let errorData: Record<string, unknown> = {};
  try {
    const body = await parseResponseBody(response);
    if (typeof body === "object" && body !== null) {
      errorData = body as Record<string, unknown>;
    }
  } catch {
    // Response body could not be parsed
  }

  const messageRaw = errorData.message;
  const message = Array.isArray(messageRaw)
    ? messageRaw.map(String).join(". ")
    : (typeof messageRaw === "string" && messageRaw) || getStatusMessage(response.status);

  let errors = errorData.errors as Record<string, string[]> | undefined;
  if (!errors && Array.isArray(messageRaw)) {
    errors = { form: messageRaw.map(String) };
  }

  throw new ApiError(message, response.status, { errors });
}

function createAbortController(timeout: number): {
  controller: AbortController;
  timeoutId: ReturnType<typeof setTimeout>;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

async function request<T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const timeout = options?.timeout ?? API_CONFIG.TIMEOUT;
  const { controller, timeoutId } = createAbortController(timeout);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options?.headers,
  };

  // Automatically add Authorization header if token exists in localStorage
  if (typeof window !== "undefined" && !options?.skipAuth) {
    const token = localStorage.getItem("auth_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method,
    headers,
    signal: options?.signal ?? controller.signal,
  };

  if (body) {
    fetchOptions.body =
      body instanceof FormData ? body : JSON.stringify(body);
  }

  if (options?.cache) {
    fetchOptions.cache = options.cache;
  }

  if (options?.next) {
    fetchOptions.next = options.next;
  }

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (
        response.status === HTTP_STATUS.UNAUTHORIZED &&
        typeof window !== "undefined" &&
        !options?.skipAuth &&
        !options?.skipAuthRedirect
      ) {
        const path = window.location.pathname;
        const cfcPortalMatch = path.match(/^\/cfc\/portal(\/|$)/);
        if (cfcPortalMatch) {
          localStorage.removeItem("cfc_token");
          localStorage.removeItem("cfc_user");
          if (!path.includes("/cfc/login")) {
            window.location.href = "/cfc/login";
          }
        } else {
        const districtAdminMatch = path.match(
          /^\/([^/]+)\/district-administrator(\/|$)/
        );
        if (districtAdminMatch) {
          localStorage.removeItem("district_admin_token");
          localStorage.removeItem("district_admin_user");
          localStorage.removeItem("district_admin_district");
          localStorage.removeItem("district_admin_district_slug");
          if (!path.endsWith("/district")) {
            window.location.href = `/${districtAdminMatch[1]}/district`;
          }
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          notifyAuthChange();
          if (!path.includes("/login")) {
            window.location.href = "/login";
          }
        }
        }
      }
      await handleErrorResponse(response);
    }

    const data = (await parseResponseBody(response)) as T;

    return {
      data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      if (options?.signal?.aborted) {
        throw new ApiError("Request was cancelled.", 0, { isAbortError: true });
      }
      throw new ApiError(
        "Request timed out. Please check your connection and try again.",
        0,
        { isTimeoutError: true }
      );
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error. Please check your internet connection.",
        0,
        { isNetworkError: true }
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred.",
      0
    );
  }
}

async function requestWithRetry<T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  options?: RequestOptions,
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<ApiResponse<T>> {
  try {
    return await request<T>(method, url, body, options);
  } catch (error) {
    if (error instanceof ApiError) {
      const isRetryable =
        error.isNetworkError ||
        error.isTimeoutError ||
        error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;

      if (isRetryable && retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.RETRY_DELAY)
        );
        return requestWithRetry<T>(method, url, body, options, retries - 1);
      }
    }
    throw error;
  }
}

function withQueryString(
  url: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  if (!qs) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${qs}`;
}

export const httpClient = {
  get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const { params, ...rest } = options ?? {};
    const finalUrl = withQueryString(url, params);
    return requestWithRetry<T>("GET", finalUrl, undefined, rest);
  },

  post<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return requestWithRetry<T>("POST", url, body, options);
  },

  put<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return requestWithRetry<T>("PUT", url, body, options);
  },

  patch<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return requestWithRetry<T>("PATCH", url, body, options);
  },

  delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return requestWithRetry<T>("DELETE", url, undefined, options);
  },
};
