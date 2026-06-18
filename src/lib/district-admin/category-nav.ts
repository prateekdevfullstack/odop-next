import type { ReadonlyURLSearchParams } from "next/navigation";

export const PRODUCT_CATEGORY_QUERY_KEY = "productCategoryId";

export type ProductCategoryQuery = {
  productCategoryId?: number | string;
};

export function buildProductCategoryQuery(query?: ProductCategoryQuery): string {
  if (!query?.productCategoryId) return "";
  return `?${PRODUCT_CATEGORY_QUERY_KEY}=${encodeURIComponent(String(query.productCategoryId))}`;
}

export function parseProductCategoryId(
  searchParams: ReadonlyURLSearchParams | URLSearchParams | null | undefined
): string {
  return searchParams?.get(PRODUCT_CATEGORY_QUERY_KEY)?.trim() ?? "";
}

export function getProductCategoryName(
  categories: { id: number; name: string }[],
  categoryId: string
): string {
  if (!categoryId) return "";
  const match = categories.find((c) => String(c.id) === categoryId);
  return match?.name ?? "";
}

export type EntityNavType = "artisan" | "supplier" | "exporter";

export function parseEntityTypeFromPath(pathname: string): EntityNavType | null {
  if (pathname.includes("/artisans")) return "artisan";
  if (pathname.includes("/suppliers")) return "supplier";
  if (pathname.includes("/exporters")) return "exporter";
  return null;
}
