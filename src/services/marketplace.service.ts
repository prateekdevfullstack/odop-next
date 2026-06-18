import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchDistricts(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.districts, options);
}

export async function fetchMarketplaceProductsByDistrict(
  districtId: string | number,
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.marketplaceProductList(districtId),
    options
  );
}

export async function fetchMarketplaceDistrictsAuth(
  options?: RequestOptions
) {
  return httpClient.get(ENDPOINTS.marketplaceAuth.districts, options);
}

export async function createMarketplace(
  data: Record<string, unknown>,
  options?: RequestOptions
) {
  return httpClient.post(ENDPOINTS.marketplaceAuth.create, data, options);
}

export async function createMarketplaceProduct(
  data: FormData,
  options?: RequestOptions
) {
  return httpClient.post(
    ENDPOINTS.marketplaceAuth.createProduct,
    data,
    options
  );
}

export async function fetchMarketplaceProductCategories(
  options?: RequestOptions
) {
  return httpClient.get(
    ENDPOINTS.marketplaceAuth.productListCategory,
    options
  );
}
