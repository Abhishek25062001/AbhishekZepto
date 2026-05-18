import type { StoreProductRecord } from '../models/store-product.model';
import type { StoreProductDocument, StoreProductResponse } from '../types/store-product.types';

export const toStoreProductResponse = (
  record: StoreProductDocument | (StoreProductRecord & { _id: { toString(): string } }),
): StoreProductResponse => ({
  id: record._id.toString(),
  storeId: record.storeId.toString(),
  vendorId: record.vendorId.toString(),
  cityId: record.cityId.toString(),
  productId: record.productId.toString(),
  variantId: record.variantId.toString(),
  categoryId: record.categoryId.toString(),
  brandId: record.brandId ? record.brandId.toString() : null,
  sku: record.sku,
  storeSku: record.storeSku,
  mrp: record.mrp,
  sellingPrice: record.sellingPrice,
  discountType: record.discountType,
  discountValue: record.discountValue,
  finalPrice: record.finalPrice,
  taxCategoryId: record.taxCategoryId ? record.taxCategoryId.toString() : null,
  isAvailable: record.isAvailable,
  isVisible: record.isVisible,
  isFeatured: record.isFeatured,
  isPriceLocked: record.isPriceLocked,
  priceUpdatedAt: record.priceUpdatedAt,
  availabilityUpdatedAt: record.availabilityUpdatedAt,
  status: record.status,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});
