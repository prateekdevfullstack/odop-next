/** Backend-accepted values for `supplier_type` and `artisan_type`. */
export const ENTITY_TYPE_OPTIONS = [
  "Manufacturers",
  "Wholesalers",
  "Distributors",
  "Shopkeepers"
] as const;

export const SUPPLIER_TYPE_OPTIONS = ENTITY_TYPE_OPTIONS;
export const ARTISAN_TYPE_OPTIONS = ENTITY_TYPE_OPTIONS;

export const ARTISAN_NAME_PREFIX_OPTIONS = [
  "Mr.",
  "Miss",
  "Mrs.",
  "Do not wish to disclose",
] as const;

/** Backend `craft_specialization` string values (CreateArtisanDto). */
export const CRAFT_SPECIALIZATION_OPTIONS = [
  "statues",
  "home decor items",
  "wall decor",
  "floor decor",
  "ceiling",
] as const;

export const ARTISAN_CUSTOMIZED_ORDER_OPTIONS = ["Yes", "No"] as const;

export type ArtisanCustomizedOrderOption = (typeof ARTISAN_CUSTOMIZED_ORDER_OPTIONS)[number];

export type EntityTypeOption = (typeof ENTITY_TYPE_OPTIONS)[number];

export enum ExporterType {
  MANUFACTURER = 'Manufacturer',
  MERCHANT = 'Merchant',
  BUYING_HOUSE = 'Buying House',
}
