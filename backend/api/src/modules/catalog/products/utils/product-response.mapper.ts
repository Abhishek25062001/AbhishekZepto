import type { Types } from 'mongoose';
import type { FoodType } from '../constants/food-type.constant';
import type { ProductApprovalStatus } from '../constants/product-approval-status.constant';
import type { ProductStatus } from '../constants/product-status.constant';
import type { ProductType } from '../constants/product-type.constant';
import type { ProductRecord } from '../models/product.model';
import type { ProductResponse } from '../types/product.types';

type ProductLean = ProductRecord & { _id: Types.ObjectId };

export const toProductResponse = (product: ProductLean): ProductResponse => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  description: product.description,
  shortDescription: product.shortDescription,
  categoryId: product.categoryId.toString(),
  subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : null,
  brandId: product.brandId ? product.brandId.toString() : null,
  productType: product.productType as ProductType,
  foodType: (product.foodType as FoodType | null) ?? null,
  taxCategoryId: product.taxCategoryId ? product.taxCategoryId.toString() : null,
  hsnCode: product.hsnCode,
  searchKeywords: product.searchKeywords,
  tags: product.tags,
  defaultImageUrl: product.defaultImageUrl,
  imageUrls: product.imageUrls,
  attributeSummary: product.attributeSummary,
  isFeatured: product.isFeatured,
  isVisible: product.isVisible,
  approvalStatus: product.approvalStatus as ProductApprovalStatus,
  status: product.status as ProductStatus,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});
