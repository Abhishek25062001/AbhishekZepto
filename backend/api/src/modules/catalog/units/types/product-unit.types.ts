import type { Types } from 'mongoose';
import type { BaseUnit } from '../constants/base-unit.constant';
import type { ProductUnitStatus } from '../constants/product-unit-status.constant';
import type { ProductUnitRecord } from '../models/product-unit.model';

export type { BaseUnit, ProductUnitStatus };

export type ProductUnitDocument = ProductUnitRecord & {
  _id: Types.ObjectId;
};

export type CreateProductUnitInput = {
  code: string;
  name: string;
  baseUnit: BaseUnit;
  conversionFactor: number;
  status?: ProductUnitStatus;
};

export type UpdateProductUnitInput = {
  code?: string;
  name?: string;
  baseUnit?: BaseUnit;
  conversionFactor?: number;
  status?: ProductUnitStatus;
};

export type ProductUnitListQuery = {
  page: number;
  limit: number;
  status?: ProductUnitStatus;
  baseUnit?: BaseUnit;
  search?: string;
  sortBy?: 'code' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type ProductUnitResponse = {
  id: string;
  code: string;
  name: string;
  baseUnit: BaseUnit;
  conversionFactor: number;
  status: ProductUnitStatus;
  createdAt: Date;
  updatedAt: Date;
};
