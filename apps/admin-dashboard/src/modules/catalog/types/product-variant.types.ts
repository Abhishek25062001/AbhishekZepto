import type { CatalogStatus } from '../constants/catalog-status.constants';

export type ProductVariantResponse = {
  id: string;
  productId: string;
  variantName: string;
  sku: string;
  barcode: string | null;
  unit: string;
  unitValue: number;
  mrp: number;
  defaultSellingPrice: number | null;
  weightInGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  imageUrl: string | null;
  attributeValues: Record<string, unknown> | null;
  isDefault: boolean;
  isVisible: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariantFormValues = {
  variantName: string;
  sku: string;
  barcode?: string | null;
  unit: string;
  unitValue: number;
  mrp: number;
  defaultSellingPrice?: number | null;
  weightInGrams?: number | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  imageUrl?: string | null;
  imageMediaFileId?: string;
  attributeValues?: Record<string, unknown> | null;
  isDefault?: boolean;
  isVisible?: boolean;
  status?: CatalogStatus;
};

export type ProductVariantListQuery = {
  page?: number;
  limit?: number;
  status?: CatalogStatus;
  isVisible?: boolean;
  isDefault?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'variantName' | 'mrp';
  sortOrder?: 'asc' | 'desc';
};
