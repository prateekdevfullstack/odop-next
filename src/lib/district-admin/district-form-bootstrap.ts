import type { DistrictEntityFormValues } from "@/types/district-admin";
import { getDistrictAdminUser } from "./session";

/** Apply district name and id from the logged-in district admin (URL-scoped session). */
export function bootstrapDistrictFormValues(
  values: DistrictEntityFormValues,
  districtName: string
): DistrictEntityFormValues {
  const adminUser = getDistrictAdminUser();
  return {
    ...values,
    district: districtName || values.district,
    district_id: adminUser?.district_id
      ? String(adminUser.district_id)
      : values.district_id,
  };
}

export function validateDistrictId(
  values: DistrictEntityFormValues
): Record<string, string> {
  if (!values.district_id?.trim()) {
    return {
      district_id:
        "District could not be determined from your session. Please sign in again.",
    };
  }
  return {};
}
