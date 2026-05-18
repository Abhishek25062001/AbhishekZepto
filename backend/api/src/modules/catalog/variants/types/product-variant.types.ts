import type { VariantStatus } from '../constants/variant-status.constant';

export type ProductVariantListQuery = {
  page: number;
  limit: number;
  status?: VariantStatus;
  isVisible?: boolean;
  isDefault?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'variantName' | 'mrp';
  sortOrder?: 'asc' | 'desc';
};

export type CreateProductVariantInput = {
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
  status?: VariantStatus;
};

export type UpdateProductVariantInput = Partial<CreateProductVariantInput>;

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
  status: VariantStatus;
  createdAt: Date;
  updatedAt: Date;
};
