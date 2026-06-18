export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://udyamsarthi.co.in",
  IMAGE_BASE_URL:
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    "https://udyamsarthi.co.in/storage/",
  NEW_BASE_URL: process.env.NEXT_PUBLIC_NEW_BASE_URL || "https://odopapi.samadhandigitech.com",
  API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_NEW_BASE_URL ||
    "https://odopapi.samadhandigitech.com",

  //NEW_BASE_URL: process.env.NEXT_PUBLIC_NEW_BASE_URL || "http://localhost:3001",

  CHAT_BASE_URL:
    process.env.CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.NEXT_PUBLIC_NEW_BASE_URL ||
    "https://odopapi.samadhandigitech.com",

  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
