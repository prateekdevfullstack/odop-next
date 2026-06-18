import { ENDPOINTS, httpClient, type RequestOptions } from "@/lib/api";
import type { GIProduct, GIProductListResponse } from "@/lib/api/gi-products.types";
import { resolveDistrictCardImage } from "@/lib/district-card-media";

export interface GIProductCardData {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  img: string;
  images: string[];
  href: string;
}

function coerceLabel(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function collectGalleryImages(product: GIProduct): string[] {
  const seen = new Set<string>();
  const images: string[] = [];

  const add = (path?: string | null) => {
    const value = path?.trim();
    if (!value) return;
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    images.push(value);
  };

  add(product.thumbnail);

  for (const entry of product.productCategoryImages ?? []) {
    add(entry.image ?? entry.url ?? entry.path);
  }

  add(product.category?.thumbnail);

  return images;
}

export function mapGIProductToCard(product: GIProduct, isHi: boolean): GIProductCardData {
  const images = collectGalleryImages(product);
  const img = resolveDistrictCardImage(product.thumbnail);
  const name = isHi
    ? coerceLabel(product.nameHindi) || coerceLabel(product.name)
    : coerceLabel(product.name);
  const subtitle =
    coerceLabel(product.short_description) ||
    coerceLabel(product.category?.name) ||
    "";

  return {
    id: product.id,
    slug: product.slug,
    name,
    subtitle,
    img,
    images,
    href: `/suppliers?product_category_id=${product.id}`,
  };
}

export interface FetchGIProductsParams {
  page?: number;
  limit?: number;
}

export async function fetchGIProducts(
  params?: FetchGIProductsParams,
  options?: RequestOptions
): Promise<GIProduct[]> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const url = `${ENDPOINTS.public.giProducts}?page=${page}&limit=${limit}`;
  const response = await httpClient.get<GIProductListResponse>(url, options);
  const rows = Array.isArray(response.data?.data) ? response.data.data : [];
  return rows.filter((item) => item?.isGIProduct && item.isDeleted !== 1);
}

export async function fetchGIProductCards(
  isHi: boolean,
  limit = 4,
  options?: RequestOptions
): Promise<GIProductCardData[]> {
  const products = await fetchGIProducts({ limit }, options);
  return products.slice(0, limit).map((product) => mapGIProductToCard(product, isHi));
}
