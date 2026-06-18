import { z } from "zod";
import { ProductAvailability, ProductStatus } from "@/types/supplier-product";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

const optionalPositiveInt = z.preprocess(
  (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    if (!Number.isFinite(n)) return Number.NaN;
    return n;
  },
  z.union([
    z.undefined(),
    z.number().int().positive({ message: "Must be a positive integer" }),
  ])
);

const optionalNonNegativeNumber = z.preprocess(
  (v) => {
    const n = Number(v);
    if (v === "" || v === null || v === undefined || Number.isNaN(n)) return undefined;
    if (n < 0) return NaN;
    return n;
  },
  z.number().min(0).optional()
);

const optionalMoq = z.preprocess(
  (v) => {
    const n = Number(v);
    if (v === "" || v === null || v === undefined || Number.isNaN(n)) return undefined;
    return n;
  },
  z.number().min(1, "MOQ must be at least 1").optional()
);

export const supplierProductFormSchema = z
  .object({
    user_id: optionalPositiveInt,
    category_id: z.coerce
      .number({ invalid_type_error: "Select a category" })
      .int()
      .positive({ message: "Select a category" }),
    product_name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(255, "Product name must be at most 255 characters"),
    slug: z.string().max(255).optional().default(""),
    sku_code: z.string().max(100, "SKU must be at most 100 characters").optional().default(""),
    hsn_code: z.string().max(20, "HSN must be at most 20 characters").optional().default(""),
    description: z.string().optional().default(""),
    min_price: optionalNonNegativeNumber,
    max_price: optionalNonNegativeNumber,
    moq: optionalMoq,
    monthly_capacity: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
    lead_time: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
    availability: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.nativeEnum(ProductAvailability).optional()
    ),
    video_url: z
      .string()
      .optional()
      .default("")
      .transform((s) => (s.trim() === "" ? undefined : s.trim()))
      .pipe(
        z.union([
          z.undefined(),
          z.string().url({ message: "Enter a valid URL" }),
        ])
      ),
    color_options: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
    export_ready: z.boolean().optional().default(false),
    search_tags: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),
    status: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.nativeEnum(ProductStatus).optional()
    ),
  })
  .superRefine((data, ctx) => {
    const slug = data.slug?.trim();
    if (slug && !SLUG_REGEX.test(slug)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["slug"],
        message: "Slug may only use lowercase letters, numbers, and hyphens",
      });
    }
    if (data.min_price !== undefined && data.max_price !== undefined && data.max_price < data.min_price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_price"],
        message: "Max price must be greater than or equal to min price",
      });
    }
  });

export type SupplierProductFormValues = z.infer<typeof supplierProductFormSchema>;
