import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";
import type {
  AccessedSupplierLog,
  AccessedSuppliersResponse,
} from "@/types/user-access";

export async function getAccessedSuppliers(
  options?: RequestOptions
): Promise<AccessedSupplierLog[]> {
  const response = await httpClient.get<AccessedSuppliersResponse>(
    ENDPOINTS.users.accessedSuppliers,
    options
  );

  const body = response.data as unknown as AccessedSuppliersResponse;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body as unknown as AccessedSupplierLog[];
  return [];
}

export async function fetchUserProfile(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.profile, options);
}

export type UpdateUserProfileBody = {
  name?: string;
  email?: string;
  password?: string;
  current_password?: string;
};

/** PATCH /api/users/profile — portal user (USER_ROLE) self-update. */
export async function patchUserProfile(
  body: UpdateUserProfileBody,
  options?: RequestOptions
) {
  // skipAuthRedirect: a 401 here means "current password incorrect",
  // not an expired session — don't log the user out.
  return httpClient.patch(ENDPOINTS.users.profileUpdate, body, {
    skipAuthRedirect: true,
    ...options,
  });
}

export async function updateUserProfile(
  data: Record<string, unknown>,
  options?: RequestOptions
) {
  return httpClient.post(ENDPOINTS.profileUpdate, data, options);
}

export async function uploadProfileImage(
  formData: FormData,
  options?: RequestOptions
) {
  return httpClient.post(ENDPOINTS.uploadProfileImage, formData, options);
}

export async function forgotPassword(
  data: Record<string, unknown>,
  options?: RequestOptions
) {
  return httpClient.post(ENDPOINTS.forgotPassword, data, options);
}
