import type { Types } from 'mongoose';
import type { VariantStatus } from '../constants/variant-status.constant';
import type { ProductVariantRecord } from '../models/product-variant.model';
import type { ProductVariantResponse } from '../types/product-variant.types';

type ProductVariantLean = ProductVariantRecord & { _id: Types.ObjectId };

export const toProductVariantResponse = (
  variant: ProductVariantLean,
): ProductVariantResponse => ({
  id: variant._id.toString(),
  productId: variant.productId.toString(),
  variantName: variant.variantName,
  sku: variant.sku,
  barcode: variant.barcode,
  unit: variant.unit,
  unitValue: variant.unitValue,
  mrp: variant.mrp,
  defaultSellingPrice: variant.defaultSellingPrice,
  weightInGrams: variant.weightInGrams,
  lengthCm: variant.lengthCm,
  widthCm: variant.widthCm,
  heightCm: variant.heightCm,
  imageUrl: variant.imageUrl,
  attributeValues: variant.attributeValues,
  isDefault: variant.isDefault,
  isVisible: variant.isVisible,
  status: variant.status as VariantStatus,
  createdAt: variant.createdAt,
  updatedAt: variant.updatedAt,
});
