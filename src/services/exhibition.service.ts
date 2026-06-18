import { httpClient, ENDPOINTS, type RequestOptions } from "@/lib/api";

export async function fetchStateExhibitions(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.exhibition.stateExhibition, options);
}

export async function fetchExhibitionList(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.exhibition.exhibitionList, options);
}

export async function fetchPressGallery(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.exhibition.pressGallery, options);
}

export async function fetchPhotoGallery(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.exhibition.photoGallery, options);
}

export async function fetchVideoGallery(options?: RequestOptions) {
  return httpClient.get(ENDPOINTS.exhibition.videoGallery, options);
}
