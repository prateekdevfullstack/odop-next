#!/usr/bin/env node
/**
 * Migrate districts from legacy mobile API → new DB (CreateCityDto)
 *
 * Modes:
 *   --sync (default for npm run migrate:districts:sync)  PATCH if exists, else POST
 *   --create-only                                       POST only; skip existing names
 *   --update-only                                       PATCH only; skip unknown names
 *
 * Usage:
 *   node --env-file=.env scripts/migrate-districts-to-cities.mjs --sync --with-details
 *   node --env-file=.env scripts/migrate-districts-to-cities.mjs --dry-run --sync
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decrypt128, getEncryptedBody } from "./lib/aes128.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const OLD_API_BASE =
  process.env.OLD_API_BASE_URL?.replace(/\/$/, "") ||
  "https://udyamsarthi.co.in";
const NEW_API_BASE =
  process.env.NEW_API_BASE_URL?.replace(/\/$/, "") ||
  "https://odopapi.samadhandigitech.com";

function normalizeAdminToken(raw) {
  const t = String(raw || "").trim();
  if (!t) return "";
  return t.replace(/^Bearer\s+/i, "");
}

const ADMIN_TOKEN = normalizeAdminToken(process.env.ADMIN_TOKEN);
const DEFAULT_STATE_ID = Number(process.env.DEFAULT_STATE_ID || "1");
const DEFAULT_CATEGORY_ID = Number(process.env.DEFAULT_CATEGORY_ID || "1");
const DEFAULT_PRODUCT_CATEGORY_ID = Number(
  process.env.DEFAULT_PRODUCT_CATEGORY_ID || "1"
);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || "300");
const LEGACY_DELAY_MS = Number(process.env.LEGACY_DELAY_MS || "400");
const LEGACY_RETRY_ATTEMPTS = Number(process.env.LEGACY_RETRY_ATTEMPTS || "4");

const argv = process.argv.slice(2);
const args = new Set(argv);
const DRY_RUN = args.has("--dry-run");
const WITH_DETAILS =
  args.has("--with-details") || process.env.MIGRATE_WITH_DETAILS === "1";
const CREATE_ONLY = args.has("--create-only");
const UPDATE_ONLY = args.has("--update-only");
const SYNC = args.has("--sync") || (!CREATE_ONLY && !UPDATE_ONLY && args.has("--sync"));
const SKIP_EXISTING = args.has("--skip-existing");
const LIMIT = (() => {
  const i = argv.indexOf("--limit");
  return i >= 0 ? Number(argv[i + 1]) : 0;
})();

/** Effective mode when flags omitted: --sync if npm passes it, else legacy create+skip */
const MODE = SYNC
  ? "sync"
  : UPDATE_ONLY
    ? "update"
    : CREATE_ONLY
      ? "create"
      : SKIP_EXISTING
        ? "create-skip"
        : "sync";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickBestMatch(label, options, getLabel) {
  const needle = normalizeLabel(label);
  if (!needle) return null;

  let best = null;
  let bestScore = 0;

  for (const opt of options) {
    const hay = normalizeLabel(getLabel(opt));
    if (!hay) continue;

    if (hay === needle) return opt;
    if (hay.includes(needle) || needle.includes(hay)) {
      const score = Math.min(hay.length, needle.length);
      if (score > bestScore) {
        bestScore = score;
        best = opt;
      }
    }

    const needleWords = needle.split(" ").filter((w) => w.length > 2);
    const matched = needleWords.filter((w) => hay.includes(w)).length;
    if (matched > 0) {
      const score = matched * 10;
      if (score > bestScore) {
        bestScore = score;
        best = opt;
      }
    }
  }

  return best;
}

function uniqueInts(ids, fallback) {
  const set = new Set(ids.filter((n) => Number.isInteger(n) && n > 0));
  if (set.size === 0) set.add(fallback);
  return [...set];
}

function asOptionalString(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const s = String(value).trim();
  if (!s || s.toLowerCase() === "null") return undefined;
  return s;
}

function asOptionalNumberString(value) {
  return asOptionalString(value);
}

function youtubeEmbedToWatch(url) {
  if (!url || url === "null") return undefined;
  const s = String(url).trim();
  const m = s.match(
    /(?:youtu\.be\/|v\/|embed\/|watch\?v=)([A-Za-z0-9_-]{11})/
  );
  if (m) return `https://www.youtube.com/watch?v=${m[1]}`;
  return s.startsWith("http") ? s : undefined;
}

function authHeaders(token, json = false) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${normalizeAdminToken(token)}`,
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

async function fetchLegacyJson(path, attempt = 0) {
  const res = await fetch(`${OLD_API_BASE}${path}`);
  if (res.status === 429 && attempt < LEGACY_RETRY_ATTEMPTS) {
    const wait = LEGACY_DELAY_MS * (attempt + 2);
    console.warn(`  Legacy rate limit on ${path}; retry in ${wait}ms`);
    await sleep(wait);
    return fetchLegacyJson(path, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`Legacy API ${path} → HTTP ${res.status}`);
  }
  const json = await res.json();
  const body = getEncryptedBody(json);
  if (!body) {
    throw new Error(`Legacy API ${path} → missing encrypted body`);
  }
  return decrypt128(body);
}

async function fetchLegacyDistrictsList() {
  const data = await fetchLegacyJson("/api/mobile/districts");
  const list = data?.data?.district ?? data?.district ?? [];
  if (!Array.isArray(list)) {
    throw new Error("Unexpected districts list shape");
  }
  return list.sort((a, b) =>
    String(a.name || a.district_name || "").localeCompare(
      String(b.name || b.district_name || "")
    )
  );
}

async function fetchLegacyDistrictDetail(slug) {
  const data = await fetchLegacyJson(`/api/mobile/district/${slug}`);
  return data?.data ?? data;
}

async function fetchLegacyDistrictIntro(districtId) {
  try {
    const data = await fetchLegacyJson(
      `/api/mobile/district-intro/${districtId}`
    );
    return (
      data?.data?.districtIntro?.[0] ?? data?.districtIntro?.[0] ?? null
    );
  } catch {
    return null;
  }
}

async function fetchNewLookups() {
  const [catRes, prodRes] = await Promise.all([
    fetch(`${NEW_API_BASE}/api/public/categories`),
    fetch(`${NEW_API_BASE}/api/public/product-categories/dropdown`),
  ]);

  const categories = catRes.ok ? (await catRes.json())?.data ?? [] : [];
  const productCategories = prodRes.ok
    ? (await prodRes.json())?.data ?? []
    : [];

  return { categories, productCategories };
}

async function fetchAllExistingCities(token) {
  const byName = new Map();
  const byLegacyId = new Map();
  if (!token) return { byName, byLegacyId, list: [] };

  let page = 1;
  const limit = 200;
  const all = [];

  while (true) {
    const res = await fetch(
      `${NEW_API_BASE}/api/admin/cities?page=${page}&limit=${limit}`,
      { headers: authHeaders(token) }
    );
    if (!res.ok) {
      console.warn(`Could not load cities (HTTP ${res.status})`);
      break;
    }
    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : [];
    all.push(...rows);

    for (const city of rows) {
      const nameKey = normalizeLabel(city.districtName || city.name || "");
      if (nameKey) byName.set(nameKey, city);
      const seq = String(city.sequence ?? "").trim();
      if (seq && /^\d+$/.test(seq)) {
        byLegacyId.set(Number(seq), city);
      }
    }

    const totalPages = json?.pagination?.totalPages ?? 1;
    if (page >= totalPages || rows.length === 0) break;
    page++;
  }

  return { byName, byLegacyId, list: all };
}

function findExistingCity(payload, legacyRow, existing) {
  const legacyId = Number(legacyRow?.id);
  if (legacyId && existing.byLegacyId.has(legacyId)) {
    return existing.byLegacyId.get(legacyId);
  }
  const nameKey = normalizeLabel(payload.districtName);
  if (nameKey && existing.byName.has(nameKey)) {
    return existing.byName.get(nameKey);
  }
  // Fuzzy: first word match for renamed districts (e.g. Bhagpat / Baghpat)
  for (const [key, city] of existing.byName) {
    const a = nameKey.split(" ")[0];
    const b = key.split(" ")[0];
    if (a.length >= 4 && a === b) return city;
  }
  return null;
}

function resolveCategoryIds(district, categories, productCategories) {
  const hints = [
    district.title,
    district.get_sub_category?.name,
    ...(district.district_product || []).map((p) => p.name),
    district.secondary_product,
    district.tertiary_product,
  ].filter(Boolean);

  const categoryIds = [];
  const productCategoryIds = [];

  for (const hint of hints) {
    const cat = pickBestMatch(hint, categories, (c) => c.name);
    if (cat?.id) categoryIds.push(Number(cat.id));

    const pc = pickBestMatch(hint, productCategories, (c) => c.label);
    if (pc?.value) productCategoryIds.push(Number(pc.value));
  }

  return {
    category_ids: uniqueInts(categoryIds, DEFAULT_CATEGORY_ID),
    product_category_ids: uniqueInts(
      productCategoryIds,
      DEFAULT_PRODUCT_CATEGORY_ID
    ),
  };
}

function mapDistrictToCreateCityDto(district, detail, intro, lookups, index) {
  const d = detail?.district
    ? { ...district, ...detail.district }
    : district;

  const introRow = intro || null;
  const videoEn =
    youtubeEmbedToWatch(introRow?.introurl) ||
    youtubeEmbedToWatch(d.url);
  const videoHi =
    youtubeEmbedToWatch(introRow?.hindi_introurl) || videoEn;

  const sub = d.get_sub_category || {};
  const firstProduct = (d.district_product || [])[0] || {};

  const documentaryThumb =
    sub.thumbnail ||
    firstProduct.thumbnail ||
    d.thumbnail ||
    sub.hindi_thumbnail ||
    d.hindi_thumbnail;

  const { category_ids, product_category_ids } = resolveCategoryIds(
    { ...d, district_product: detail?.district?.district_product ?? d.district_product },
    lookups.categories,
    lookups.productCategories
  );

  const payload = {
    districtName: String(d.name || d.district_name || "").trim(),
    nameHindi: asOptionalString(d.hindi_name),
    districtDescriptionHeading: asOptionalString(
      d.title || sub.name || firstProduct.name
    ),
    districtDescriptionHeadingHindi: asOptionalString(
      d.hindi_title || sub.hindi_name || firstProduct.hindi_name
    ),
    districtDescription: asOptionalString(
      d.description ||
        d.short_description ||
        sub.description ||
        firstProduct.description
    ),
    districtDescriptionHindi: asOptionalString(
      d.hindi_description ||
        d.hindi_short_description ||
        sub.hindi_description ||
        firstProduct.hindi_description
    ),
    districtImage: asOptionalString(d.thumbnail || firstProduct.thumbnail),
    districtImageHindi: asOptionalString(
      d.hindi_thumbnail || sub.hindi_thumbnail || firstProduct.hindi_thumbnail
    ),
    documentaryThumbnail: asOptionalString(documentaryThumb),
    documentaryVideoUrlEnglish: videoEn,
    documentaryVideoUrlHindi: videoHi,
    population: asOptionalNumberString(d.population ?? d.population_count),
    areaSqKm: asOptionalNumberString(d.area_sq_km ?? d.area ?? d.areaSqKm),
    state_id: Number(d.state_id) > 0 ? Number(d.state_id) : DEFAULT_STATE_ID,
    category_ids,
    product_category_ids,
    status:
      d.status === undefined || d.status === null
        ? 1
        : Number(d.status) === 0
          ? 0
          : 1,
    sequence: String(d.id ?? index + 1),
  };

  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined || payload[key] === "") {
      delete payload[key];
    }
  }

  return payload;
}

async function postCity(payload, token) {
  const res = await fetch(`${NEW_API_BASE}/api/admin/cities`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  return parseApiResponse(res);
}

async function patchCity(id, payload, token) {
  const res = await fetch(`${NEW_API_BASE}/api/admin/cities/${id}`, {
    method: "PATCH",
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  return parseApiResponse(res);
}

async function parseApiResponse(res) {
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg =
      json?.message ||
      (Array.isArray(json?.message) ? json.message.join(", ") : null) ||
      text;
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return json;
}

async function main() {
  console.log("District → City migration");
  console.log(`  Legacy API: ${OLD_API_BASE}`);
  console.log(`  New API:    ${NEW_API_BASE}`);
  console.log(
    `  Mode:       ${MODE}${DRY_RUN ? " (dry-run)" : ""}${WITH_DETAILS ? " + details" : ""}`
  );

  if (!DRY_RUN && !ADMIN_TOKEN) {
    console.error(
      "\nADMIN_TOKEN is required. Use --dry-run to preview payloads.\n"
    );
    process.exit(1);
  }

  const [districts, lookups, existing] = await Promise.all([
    fetchLegacyDistrictsList(),
    fetchNewLookups(),
    fetchAllExistingCities(ADMIN_TOKEN),
  ]);

  const slice = LIMIT > 0 ? districts.slice(0, LIMIT) : districts;
  console.log(
    `\nLegacy districts: ${districts.length} | Existing cities: ${existing.list.length} | Processing: ${slice.length}\n`
  );

  const results = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < slice.length; i++) {
    const row = slice[i];
    const slug = row.slug;
    const label = row.name || row.district_name || slug || `#${i}`;

    let detail = null;
    let intro = null;

    if (WITH_DETAILS && slug) {
      try {
        detail = await fetchLegacyDistrictDetail(slug);
        await sleep(LEGACY_DELAY_MS);
      } catch (err) {
        console.warn(`  [${label}] detail: ${err.message}`);
      }
    }

    if (WITH_DETAILS && row.id) {
      intro = await fetchLegacyDistrictIntro(row.id);
      await sleep(LEGACY_DELAY_MS);
    }

    const payload = mapDistrictToCreateCityDto(
      row,
      detail,
      intro,
      lookups,
      i
    );

    if (!payload.districtName) {
      console.warn(`  [skip] row ${i}: missing districtName`);
      skipped++;
      continue;
    }

    const hasDesc = Boolean(payload.districtDescription);
    const hasDescHi = Boolean(payload.districtDescriptionHindi);
    const existingCity = findExistingCity(payload, row, existing);

    const shouldCreate =
      MODE === "create" ||
      MODE === "create-skip" ||
      (MODE === "sync" && !existingCity);
    const shouldUpdate =
      MODE === "update" ||
      (MODE === "sync" && Boolean(existingCity));

    if (MODE === "create-skip" && existingCity) {
      console.log(`  [skip] ${payload.districtName} (exists, no update)`);
      skipped++;
      results.push({
        districtName: payload.districtName,
        status: "skipped",
        reason: "exists",
      });
      continue;
    }

    if (MODE === "update" && !existingCity) {
      console.log(`  [skip] ${payload.districtName} (not in DB)`);
      skipped++;
      continue;
    }

    const summary = {
      districtName: payload.districtName,
      descLen: payload.districtDescription?.length ?? 0,
      descHiLen: payload.districtDescriptionHindi?.length ?? 0,
    };

    if (DRY_RUN) {
      console.log(
        `  [dry-run] ${existingCity ? "PATCH" : "POST"} ${payload.districtName}`,
        `en=${summary.descLen} hi=${summary.descHiLen}`
      );
      results.push({
        ...summary,
        status: existingCity ? "would-update" : "would-create",
        payload,
      });
      continue;
    }

    try {
      if (existingCity && shouldUpdate) {
        const res = await patchCity(existingCity.id, payload, ADMIN_TOKEN);
        updated++;
        console.log(
          `  [updated] ${payload.districtName} #${existingCity.id}`,
          `en=${summary.descLen} hi=${summary.descHiLen}${!hasDescHi ? " (no hindi in source)" : ""}`
        );
        results.push({
          ...summary,
          status: "updated",
          id: existingCity.id,
        });
      } else if (shouldCreate && !existingCity) {
        const res = await postCity(payload, ADMIN_TOKEN);
        const id = res?.data?.id;
        created++;
        if (id) {
          const city = { id, districtName: payload.districtName, sequence: payload.sequence };
          existing.byName.set(normalizeLabel(payload.districtName), city);
          if (row.id) existing.byLegacyId.set(Number(row.id), city);
        }
        console.log(
          `  [created] ${payload.districtName} #${id ?? "?"}`,
          `en=${summary.descLen} hi=${summary.descHiLen}`
        );
        results.push({ ...summary, status: "created", id });
      } else {
        skipped++;
        console.log(`  [skip] ${payload.districtName}`);
      }
    } catch (err) {
      failed++;
      console.error(`  [fail] ${payload.districtName}: ${err.message}`);
      results.push({
        ...summary,
        status: "failed",
        error: err.message,
      });
    }

    await sleep(REQUEST_DELAY_MS);
  }

  const outDir = join(__dirname, "output");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(
    outDir,
    `migrate-districts-${DRY_RUN ? "dry-run-" : ""}${Date.now()}.json`
  );
  writeFileSync(
    outFile,
    JSON.stringify(
      {
        meta: {
          mode: MODE,
          withDetails: WITH_DETAILS,
          totals: { processed: slice.length, created, updated, skipped, failed },
        },
        results,
      },
      null,
      2
    )
  );

  console.log(
    `\nDone. created=${created} updated=${updated} skipped=${skipped} failed=${failed}`
  );
  console.log(`Report: ${outFile}\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
