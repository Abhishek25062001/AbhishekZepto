import type { BaseUnit } from '../constants/product-unit.constants';
import type { CatalogStatus } from '../constants/catalog-status.constants';

export type ProductUnitResponse = {
  id: string;
  code: string;
  name: string;
  baseUnit: BaseUnit;
  conversionFactor: number;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductUnitFormValues = {
  code: string;
  name: string;
  baseUnit: BaseUnit;
  conversionFactor: number;
  status: CatalogStatus;
};

export type ProductUnitListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CatalogStatus;
  baseUnit?: BaseUnit;
  sortBy?: 'code' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
