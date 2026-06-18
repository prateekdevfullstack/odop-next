/**
 * @deprecated Use entity-specific schemas:
 * - district-admin-artisan.schema.ts
 * - district-admin-supplier.schema.ts
 * - district-admin-exporter.schema.ts
 */
export {
  districtArtisanCreateSchema as districtEntityCreateSchema,
  districtArtisanUpdateSchema as districtEntityUpdateSchema,
  type DistrictArtisanCreateInput as DistrictEntityCreateInput,
  type DistrictArtisanUpdateInput as DistrictEntityUpdateInput,
} from "./district-admin-artisan.schema";
