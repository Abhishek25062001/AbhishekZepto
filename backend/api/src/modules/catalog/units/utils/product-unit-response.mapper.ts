import type { Types } from 'mongoose';
import type { BaseUnit } from '../constants/base-unit.constant';
import type { ProductUnitStatus } from '../constants/product-unit-status.constant';
import type { ProductUnitRecord } from '../models/product-unit.model';
import type { ProductUnitResponse } from '../types/product-unit.types';

type ProductUnitLean = ProductUnitRecord & { _id: Types.ObjectId };

export const toProductUnitResponse = (unit: ProductUnitLean): ProductUnitResponse => ({
  id: unit._id.toString(),
  code: unit.code,
  name: unit.name,
  baseUnit: unit.baseUnit as BaseUnit,
  conversionFactor: unit.conversionFactor,
  status: unit.status as ProductUnitStatus,
  createdAt: unit.createdAt,
  updatedAt: unit.updatedAt,
});
