import type { CatalogStatus } from './customer-category.types';

export type CustomerProductVariant = {
  id: string;
  productId: string;
  variantName: string;
  sku: string;
  barcode: string | null;
  unit: string;
  unitValue: number;
  mrp: number;
  defaultSellingPrice: number;
  weightInGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  imageUrl: string | null;
  attributeValues: Record<string, unknown> | null;
  isDefault: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};
