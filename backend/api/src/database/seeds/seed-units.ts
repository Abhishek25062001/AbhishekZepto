import { Types } from 'mongoose';
import {
  createProductUnit,
  findProductUnitByCode,
  updateProductUnitById,
} from '../../modules/catalog/units/repositories/product-unit.repository';
import { CATALOG_UNIT_SEEDS } from './catalog-seed-data';

export type UnitSeedIdMap = Map<string, Types.ObjectId>;

export const seedUnits = async (dryRun: boolean): Promise<UnitSeedIdMap> => {
  const ids: UnitSeedIdMap = new Map();

  if (dryRun) {
    for (const item of CATALOG_UNIT_SEEDS) {
      console.log('Dry run: would upsert unit', item.code);
      ids.set(item.code, new Types.ObjectId());
    }
    return ids;
  }

  for (const item of CATALOG_UNIT_SEEDS) {
    const payload = {
      code: item.code,
      name: item.name,
      baseUnit: item.baseUnit,
      conversionFactor: item.conversionFactor,
      status: 'active' as const,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findProductUnitByCode(item.code);

    if (existing) {
      await updateProductUnitById(existing._id.toString(), payload);
      ids.set(item.code, existing._id);
      console.log('Updated unit:', item.code);
    } else {
      const created = await createProductUnit(payload);
      ids.set(item.code, created._id);
      console.log('Seeded unit:', item.code);
    }
  }

  return ids;
};
