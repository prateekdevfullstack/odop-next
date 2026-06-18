export type SupplierConnectKind =
  | "supplier"
  | "exporter"
  | "manufacturer"
  | "artisan";

const SUPPLIER_TYPE_QUERY: Partial<Record<SupplierConnectKind, string>> = {
  exporter: "Exporters",
  manufacturer: "Manufacturers",
  artisan: "Artisans",
};

/** Links to /suppliers filtered by district, product category, and optional supplier type. */
export function buildSupplierDirectoryHref(
  districtId: number,
  kind: SupplierConnectKind
): string {
  const params = new URLSearchParams();
  params.set("district_id", String(districtId));

  const supplierType = SUPPLIER_TYPE_QUERY[kind];
  if (supplierType) {
    params.set("supplier_type", supplierType);
  }

  return `/suppliers?${params.toString()}`;
}

export const SUPPLIER_CONNECT_BUTTONS: Array<{
  kind: SupplierConnectKind;
  label: string;
  shortLabel: string;
  icon: string;
}> = [
  { kind: "exporter", label: "Connect with Exporter", shortLabel: "Exporter", icon: "fa-store" },
  {
    kind: "manufacturer",
    label: "Connect with Manufacturer",
    shortLabel: "Manufacturer",
    icon: "fa-industry",
  },
  { kind: "artisan", label: "Connect with Artisan", shortLabel: "Artisan", icon: "fa-hands" },
];
