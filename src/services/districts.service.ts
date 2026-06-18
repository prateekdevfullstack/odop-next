import { ENDPOINTS, httpClient, type RequestOptions } from "@/lib/api";
import type { DistrictLinkedProduct, DistrictProduct } from "@/components/DistrictProductCard";
import type {
  PublicDistrict,
  PublicDistrictListMeta,
  PublicDistrictListParams,
  PublicDistrictListResult,
  PublicDistrictProductCategoryImage,
  PublicDistrictProductCategoryLink,
  PublicDistrictDocumentary,
  PublicDistrictProjectReport,
  DistrictDetailResponse,
  DistrictDetailDocumentary,
  DistrictDetailNablLab,
  DistrictDetailProduct,
  DistrictDetailProjectReport,
  DistrictDetailSuccessStory,
  DistrictSchemesData,
} from "@/lib/api/districts.types";
import { resolvePublicAssetUrl } from "@/lib/scheme-media";

const DEFAULT_META: PublicDistrictListMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 100,
  total: 0,
};

export function publicDistrictSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveDistrictMediaUrl(path?: string | null): string {
  if (!path) return "";
  return resolvePublicAssetUrl(path);
}

function isPrimaryProductLink(
  link: PublicDistrictProductCategoryLink,
  item: PublicDistrict
): boolean {
  const primaryCategoryId = item.primaryProductCategory?.id;
  return (
    link.productCategory?.type === "primary" ||
    (primaryCategoryId != null && link.product_category_id === primaryCategoryId)
  );
}

function isPrimaryDistrictProduct(
  product: Pick<DistrictDetailProduct, "id" | "type">,
  item: PublicDistrict
): boolean {
  const primaryCategoryId = item.primaryProductCategory?.id;
  return (
    product.type === "primary" ||
    (primaryCategoryId != null && product.id === primaryCategoryId)
  );
}

function sortDistrictDetailProductsPrimaryFirst(
  products: DistrictDetailProduct[],
  item: PublicDistrict
): DistrictDetailProduct[] {
  const primary: DistrictDetailProduct[] = [];
  const rest: DistrictDetailProduct[] = [];

  for (const product of products) {
    if (isPrimaryDistrictProduct(product, item)) {
      primary.push(product);
    } else {
      rest.push(product);
    }
  }

  return [...primary, ...rest];
}

function coerceProductLabel(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["hi", "hindi", "en", "name", "label"]) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
  }
  return "";
}

function getProductDisplayName(
  link: PublicDistrictProductCategoryLink,
  isHi: boolean
): string | null {
  const category = link.productCategory;
  if (!category) return null;

  const name = coerceProductLabel(category.name);

  if (isHi) {
    const hindi = coerceProductLabel(category.name_hindi ?? category.nameHindi);
    return hindi || name || null;
  }

  return name || null;
}

/** All unique products from cityProductCategoryLinks; exactly one primary first. */
export function mapCityProductCategoryLinks(
  item: PublicDistrict,
  isHi = false
): DistrictLinkedProduct[] {
  const links = item.cityProductCategoryLinks ?? [];
  const seen = new Set<string>();
  const primaryItems: DistrictLinkedProduct[] = [];
  const restItems: DistrictLinkedProduct[] = [];
  let primaryAssigned = false;

  const addLink = (link: PublicDistrictProductCategoryLink, forceNotPrimary = false) => {
    const name = getProductDisplayName(link, isHi);
    if (!name) return;

    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const isPrimary = !forceNotPrimary && !primaryAssigned && isPrimaryProductLink(link, item);
    if (isPrimary) primaryAssigned = true;

    const entry: DistrictLinkedProduct = { id: link.id, name, isPrimary };
    if (isPrimary) primaryItems.push(entry);
    else restItems.push(entry);
  };

  // First pass: primary links — only first one gets isPrimary = true
  for (const link of links) {
    if (isPrimaryProductLink(link, item)) addLink(link);
  }
  // Second pass: remaining links
  for (const link of links) {
    if (!isPrimaryProductLink(link, item)) addLink(link, false);
  }

  return [...primaryItems, ...restItems];
}

function getFirstProductName(item: PublicDistrict): string {
  const products = mapCityProductCategoryLinks(item, false);
  const primary = products.find((p) => p.isPrimary);
  return primary?.name ?? products[0]?.name ?? "-";
}

function resolveDistrictCardBanner(item: PublicDistrict, isHi: boolean): string {
  const path = isHi
    ? item.districtImageHindi?.trim() || item.districtImage?.trim()
    : item.districtImage?.trim() || item.districtImageHindi?.trim();
  return resolveDistrictMediaUrl(path) || "/assets/img/placeholder.jpg";
}

export function mapPublicDistrictToCard(item: PublicDistrict, isHi = false): DistrictProduct {
  const slug = publicDistrictSlug(item.districtName);
  const products = mapCityProductCategoryLinks(item, isHi);
  const images: string[] = [];
  const seenImageUrls = new Set<string>();
  for (const link of item.cityProductCategoryLinks ?? []) {
    for (const entry of link.cityProductCategoryImages ?? []) {
      const url = resolveDistrictMediaUrl(entry.image ?? entry.url ?? entry.path ?? "");
      if (!url) continue;
      const key = url.toLowerCase();
      if (seenImageUrls.has(key)) continue;
      seenImageUrls.add(key);
      images.push(url);
    }
  }

  const name = isHi
    ? item.nameHindi?.trim() || item.districtName
    : item.districtName;

  return {
    id: item.id,
    slug,
    name,
    img: images[0] ?? resolveDistrictCardBanner(item, isHi),
    products: products ?? [],
    profile: slug ? `/districts/${slug}` : "#",
    images,
  };
}

function mapDistrictSuccessStories(item: PublicDistrict): DistrictDetailSuccessStory[] {
  return (item.successStories ?? [])
    .filter((story) => !story.isDeleted)
    .map((story) => ({
      id: story.id,
      name: story.name,
      businessName: story.businessName ?? "",
      shortDescription: story.shortDescription ?? "",
      fullStory: story.fullStory ?? "",
      profileImage: resolveDistrictMediaUrl(story.profileImage),
      productImages: (story.productImages ?? [])
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((img) => resolveDistrictMediaUrl(img.imagePath))
        .filter(Boolean),
      isFeatured: Boolean(story.isFeatured),
    }));
}

function mapDistrictNablLabs(item: PublicDistrict): DistrictDetailNablLab[] {
  return (item.nablLabs ?? [])
    .filter((lab) => !lab.isDeleted)
    .map((lab) => {
      const discipline = lab.discipline;
      const disciplines = Array.isArray(discipline)
        ? discipline
        : discipline
          ? [String(discipline)]
          : [];

      return {
        id: lab.id,
        lab_name: lab.lab_name,
        lab_name_hindi: lab.lab_name_hindi ?? "",
        lab_code: lab.lab_code ?? "",
        address: lab.address ?? "",
        district: lab.district ?? item.districtName,
        disciplines,
        contact_number: lab.contact_number ?? "",
        email: lab.email ?? "",
        status: lab.status ?? "",
        product_name: lab.product?.name ?? "",
        product_name_hindi: lab.product?.name_hindi ?? "",
      };
    });
}

function mapDistrictDocumentaries(item: PublicDistrict): DistrictDetailDocumentary[] {
  const districtThumb = resolveDistrictMediaUrl(item.documentaryThumbnail);
  const fromApi = (item.documentaries ?? []).map((doc, index) =>
    mapDocumentaryEntry(doc, index + 1, districtThumb)
  );

  if (fromApi.length > 0) {
    return fromApi;
  }

  const fallback: DistrictDetailDocumentary[] = [];
  const thumb = districtThumb;

  if (item.documentaryVideoUrlEnglish?.trim()) {
    fallback.push({
      id: 10001,
      title: `${item.districtName} Documentary (English)`,
      thumbnail: thumb,
      video_url: item.documentaryVideoUrlEnglish.trim(),
      description: "",
      language: "en",
    });
  }

  if (item.documentaryVideoUrlHindi?.trim()) {
    fallback.push({
      id: 10002,
      title: `${item.districtName} Documentary (Hindi)`,
      thumbnail: thumb,
      video_url: item.documentaryVideoUrlHindi.trim(),
      description: "",
      language: "hi",
    });
  }

  return fallback;
}

function mapDocumentaryEntry(
  doc: PublicDistrictDocumentary,
  fallbackId: number,
  districtThumbnailFallback?: string
): DistrictDetailDocumentary {
  const title = doc.name ?? doc.title ?? "Documentary";
  return {
    id: doc.id ?? fallbackId,
    title,
    thumbnail: resolveDistrictMediaUrl(doc.thumbnail) || districtThumbnailFallback || "",
    video_url: (doc.video_url ?? doc.videoUrl ?? doc.url ?? "").trim(),
    description: doc.short_description ?? doc.description ?? "",
    language: normalizeDocumentaryLanguage(doc.language, title),
  };
}

// Returns "hi" or "en". Uses explicit language field if present, else infers from title.
function normalizeDocumentaryLanguage(language: string | null | undefined, title: string): string {
  const raw = (language ?? "").trim().toLowerCase();
  if (raw === "hi" || raw === "hindi" || raw.includes("हिंदी")) return "hi";
  if (raw === "en" || raw === "english") return "en";
  if (/hindi|हिंदी/i.test(title)) return "hi";
  return "en";
}

function mapDistrictProjectReports(item: PublicDistrict): DistrictDetailProjectReport[] {
  return (item.projectReports ?? []).map((report, index) =>
    mapProjectReportEntry(report, index + 1)
  );
}

function mapProjectReportEntry(
  report: PublicDistrictProjectReport,
  fallbackId: number
): DistrictDetailProjectReport {
  const title = report.title ?? report.name ?? "Project Report";
  const slug =
    report.slug ??
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return {
    id: report.id ?? fallbackId,
    title,
    description: report.description ?? report.short_description ?? "",
    thumbnail: resolveDistrictMediaUrl(report.thumbnail ?? report.image),
    slug,
    file_url: resolveDistrictMediaUrl(
      report.report_url ?? report.pdf ?? report.file ?? report.url
    ),
  };
}

export function mapPublicDistrictToDetailView(item: PublicDistrict): DistrictDetailResponse {
  const slug = publicDistrictSlug(item.districtName);
  const firstProductName = getFirstProductName(item);

  return {
    district: {
      id: item.id,
      name: item.districtName,
      hindi_name: item.nameHindi || "",
      title: item.districtDescriptionHeading || firstProductName,
      hindi_title: item.districtDescriptionHeadingHindi || "",
      short_description: item.districtDescriptionHeading || firstProductName,
      description: item.districtDescription || "",
      hindi_description: item.districtDescriptionHindi || "",
      thumbnail: resolveDistrictMediaUrl(item.districtImage || item.districtImageHindi),
      documentaryThumbnail: resolveDistrictMediaUrl(item.documentaryThumbnail),
      slug,
      url: item.documentaryVideoUrlEnglish || item.documentaryVideoUrlHindi || "",
      district_product: sortDistrictDetailProductsPrimaryFirst(
        (item.cityProductCategoryLinks ?? []).map((link) => {
        const resolvedImages = (link.cityProductCategoryImages ?? [])
          .map((img: PublicDistrictProductCategoryImage) =>
            resolveDistrictMediaUrl(img.image ?? "")
          )
          .filter(Boolean);

        const linkedCfcs = (item.cfcs ?? [])
          .filter((cfc) => cfc.product_category_id === link.product_category_id)
          .map((cfc) => {
            const productCategoryName =
              cfc.productCategory?.name ?? cfc.product?.name ?? link.productCategory.name;
            const majorInitiativesRaw = cfc.major_initiatives?.trim() ?? "";
            const majorInitiativesItems = majorInitiativesRaw
              ? majorInitiativesRaw
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
              : [];

            return {
              id: cfc.id,
              product_category_id: cfc.product_category_id,
              product_category_name: productCategoryName,
              name: cfc.name,
              spv_name: cfc.spv_name ?? "",
              address: cfc.address ?? "",
              contact_number: cfc.contact_number ?? "",
              intervention: cfc.intervention ?? "",
              facilities_available: cfc.facilities_available ?? "",
              max_capacity_usage:
                cfc.max_capacity_usage != null ? String(cfc.max_capacity_usage) : "",
              capacity_usage_month_year_wise: cfc.capacity_usage_month_year_wise ?? "",
              project_cost: cfc.project_cost != null ? String(cfc.project_cost) : "",
              income_month_year_wise: cfc.income_month_year_wise ?? "",
              expenses_month_year_wise: cfc.expenses_month_year_wise ?? "",
              beneficiary_last_month:
                cfc.beneficiary_last_month != null ? String(cfc.beneficiary_last_month) : "",
              total_beneficiary_current_financial_year:
                cfc.total_beneficiary_current_financial_year != null
                  ? String(cfc.total_beneficiary_current_financial_year)
                  : "",
              beneficiary_out_of_district:
                cfc.beneficiary_out_of_district != null
                  ? String(cfc.beneficiary_out_of_district)
                  : "",
              major_initiatives: majorInitiativesRaw,
              major_initiatives_items: majorInitiativesItems,
              thumbnail: resolveDistrictMediaUrl(cfc.thumbnail),
              attachment_url: resolveDistrictMediaUrl(cfc.cfc_attachment),
              video_url: cfc.video_url?.trim() || "",
              cfc_category: cfc.cfc_category ?? "",
              status: cfc.status ?? "",
            };
          });

        return {
          id: link.product_category_id,
          linkId: link.id,
          name: link.productCategory.name,
          hindi_name:
            link.productCategory.name_hindi ?? link.productCategory.nameHindi ?? "",
          slug: link.productCategory.slug,
          thumbnail: resolveDistrictMediaUrl(link.productCategory.thumbnail),
          description:
            link.description ||
            link.productCategory.description ||
            link.productCategory.short_description ||
            "",
          hindi_description: link.description_hindi ?? "",
          status: String(link.productCategory.status),
          type: link.productCategory.type,
          images: resolvedImages,
          cfcs: linkedCfcs,
        };
      }),
        item
      ),
      success_stories: mapDistrictSuccessStories(item),
      documentaries: mapDistrictDocumentaries(item),
      nabl_labs: mapDistrictNablLabs(item),
      project_reports: mapDistrictProjectReports(item),
    },
    districtType: (item.cityCategoryLinks ?? []).map((link) => ({
      id: link.category.id,
      name: link.category.name,
      hindi_name: "",
      slug: link.category.slug,
      thumbnail: resolveDistrictMediaUrl(link.category.thumbnail),
      descriptions: "",
      district_famous: [],
    })),
  };
}

export function parsePublicDistrictListResponse(
  payload: unknown
): PublicDistrictListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], meta: { ...DEFAULT_META } };
  }

  const root = payload as {
    data?: PublicDistrict[];
    pagination?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  };

  const items = Array.isArray(root.data) ? root.data : [];
  const pagination = root.pagination;

  return {
    items,
    meta: {
      current_page: pagination?.page ?? 1,
      last_page: pagination?.totalPages ?? 1,
      per_page: pagination?.limit ?? (items.length || 100),
      total: pagination?.total ?? items.length,
    },
  };
}

function parsePublicDistrictDetailResponse(payload: unknown): PublicDistrict | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: PublicDistrict }).data;
  return data?.id ? data : null;
}

export async function fetchPublicDistricts(
  params: PublicDistrictListParams = {},
  options?: RequestOptions
) {
  const {
    page = 1,
    limit = 100,
    search,
    sort_by = "district_name",
    sort_order = "desc",
  } = params;

  return httpClient.get<unknown>(ENDPOINTS.publicDistricts.list, {
    skipAuth: true,
    ...options,
    params: {
      page,
      limit,
      search: search?.trim() || undefined,
      sort_by,
      sort_order,
    },
  });
}

export async function fetchPublicDistrictDetail(
  id: string | number,
  options?: RequestOptions
) {
  return httpClient.get<unknown>(ENDPOINTS.publicDistricts.detail(String(id)), {
    skipAuth: true,
    ...options,
  });
}

export async function getPublicDistrictDetailView(
  slugOrId: string,
  options?: RequestOptions
): Promise<DistrictDetailResponse | null> {
  if (/^\d+$/.test(slugOrId)) {
    const response = await fetchPublicDistrictDetail(slugOrId, options);
    const district = parsePublicDistrictDetailResponse(response.data);
    return district ? mapPublicDistrictToDetailView(district) : null;
  }

  const slug = slugOrId.toLowerCase();
  const listResponse = await fetchPublicDistricts(
    {
      search: slug.replace(/-/g, " "),
      limit: 100,
      sort_by: "district_name",
      sort_order: "desc",
    },
    options
  );
  const { items } = parsePublicDistrictListResponse(listResponse.data);
  const match = items.find((item) => publicDistrictSlug(item.districtName) === slug);

  if (!match) return null;

  const detailResponse = await fetchPublicDistrictDetail(match.id, options);
  const district = parsePublicDistrictDetailResponse(detailResponse.data);
  return district ? mapPublicDistrictToDetailView(district) : mapPublicDistrictToDetailView(match);
}

export async function getPublicDistrictCards(
  params: PublicDistrictListParams = {},
  options?: RequestOptions
): Promise<{
  items: PublicDistrict[];
  districts: DistrictProduct[];
  meta: PublicDistrictListMeta;
}> {
  const response = await fetchPublicDistricts(params, options);
  const parsed = parsePublicDistrictListResponse(response.data);

  return {
    items: parsed.items,
    districts: parsed.items.map((item) => mapPublicDistrictToCard(item)),
    meta: parsed.meta,
  };
}

export async function fetchDistrictSchemes(
  districtId: string | number,
  options?: RequestOptions
): Promise<DistrictSchemesData | null> {
  try {
    const response = await httpClient.get<unknown>(
      ENDPOINTS.publicDistricts.schemes(districtId),
      { skipAuth: true, ...options }
    );
    const data = response.data as { data?: DistrictSchemesData; district_name?: string };
    if (!data) return null;
    if (data.data) return data.data;
    if (data.district_name !== undefined) return data as DistrictSchemesData;
    return null;
  } catch {
    return null;
  }
}
