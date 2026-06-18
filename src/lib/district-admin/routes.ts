import {
  buildProductCategoryQuery,
  type ProductCategoryQuery,
} from "@/lib/district-admin/category-nav";

export type { ProductCategoryQuery };

export function districtAdminBasePath(districtSlug: string): string {
  return `/${encodeURIComponent(districtSlug)}/district`;
}

export function districtAdminLoginPath(districtSlug: string): string {
  return districtAdminBasePath(districtSlug);
}

export function districtAdminDashboardPath(districtSlug: string): string {
  return `${districtAdminBasePath(districtSlug)}/dashboard`;
}

export function districtAdminSuppliersPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/suppliers${buildProductCategoryQuery(query)}`;
}

export function districtAdminSupplierAddPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/suppliers/add${buildProductCategoryQuery(query)}`;
}

export function districtAdminSupplierDetailPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/suppliers/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminSupplierEditPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/suppliers/edit/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminArtisansPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/artisans${buildProductCategoryQuery(query)}`;
}

export function districtAdminArtisanAddPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/artisans/add${buildProductCategoryQuery(query)}`;
}

export function districtAdminArtisanDetailPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/artisans/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminArtisanEditPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/artisans/edit/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminExportersPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/exporters${buildProductCategoryQuery(query)}`;
}

export function districtAdminExporterAddPath(
  districtSlug: string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/exporters/add${buildProductCategoryQuery(query)}`;
}

export function districtAdminExporterDetailPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/exporters/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminExporterEditPath(
  districtSlug: string,
  id: number | string,
  query?: ProductCategoryQuery
): string {
  return `${districtAdminBasePath(districtSlug)}/exporters/edit/${id}${buildProductCategoryQuery(query)}`;
}

export function districtAdminContactUsPath(districtSlug: string): string {
  return `${districtAdminBasePath(districtSlug)}/contact-us`;
}

export function districtAdminGrievancesPath(districtSlug: string): string {
  return `${districtAdminContactUsPath(districtSlug)}/scheme-related-enquiry`;
}

export function districtAdminGrievanceTicketsPath(districtSlug: string): string {
  return `${districtAdminGrievancesPath(districtSlug)}/tickets`;
}

export function districtAdminGrievanceTicketDetailPath(
  districtSlug: string,
  id: number | string
): string {
  return `${districtAdminGrievanceTicketsPath(districtSlug)}/${id}`;
}

export function districtAdminGrievanceReportsPath(districtSlug: string): string {
  return `${districtAdminGrievancesPath(districtSlug)}/reports`;
}

export function districtAdminContactEnquiriesPath(districtSlug: string): string {
  return `${districtAdminContactUsPath(districtSlug)}/general-enquiry`;
}

export function districtAdminContactEnquiryDetailPath(
  districtSlug: string,
  id: number | string
): string {
  return `${districtAdminContactEnquiriesPath(districtSlug)}/${id}`;
}

export function districtAdminUnifiedEnquiriesPath(districtSlug: string): string {
  return `${districtAdminBasePath(districtSlug)}/enquiries`;
}

export function productCategoryQueryFromId(
  productCategoryId?: number | string | null
): ProductCategoryQuery | undefined {
  if (productCategoryId === undefined || productCategoryId === null || productCategoryId === "") {
    return undefined;
  }
  return { productCategoryId };
}
