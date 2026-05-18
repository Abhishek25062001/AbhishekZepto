import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { FOOD_TYPE_VALUES } from '../constants/food-type.constant';
import { PRODUCT_APPROVAL_STATUS_VALUES } from '../constants/product-approval-status.constant';
import { PRODUCT_STATUS_VALUES } from '../constants/product-status.constant';
import { PRODUCT_TYPE_VALUES } from '../constants/product-type.constant';

export type ProductRecord = {
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: Types.ObjectId;
  subcategoryId: Types.ObjectId | null;
  brandId: Types.ObjectId | null;
  productType: (typeof PRODUCT_TYPE_VALUES)[number];
  foodType: (typeof FOOD_TYPE_VALUES)[number] | null;
  taxCategoryId: Types.ObjectId | null;
  hsnCode: string | null;
  searchKeywords: string[];
  tags: string[];
  defaultImageUrl: string | null;
  imageUrls: string[];
  attributeSummary: Record<string, unknown> | null;
  isFeatured: boolean;
  isVisible: boolean;
  approvalStatus: (typeof PRODUCT_APPROVAL_STATUS_VALUES)[number];
  status: (typeof PRODUCT_STATUS_VALUES)[number];
  approvedBy: Types.ObjectId | null;
  approvedAt: Date | null;
  rejectedBy: Types.ObjectId | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const ProductSchema = new Schema<ProductRecord>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: null, trim: true },
    shortDescription: { type: String, default: null, trim: true },
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
    subcategoryId: { type: Schema.Types.ObjectId, default: null, ref: 'Category' },
    brandId: { type: Schema.Types.ObjectId, default: null, ref: 'Brand' },
    productType: { type: String, enum: PRODUCT_TYPE_VALUES, required: true },
    foodType: { type: String, enum: FOOD_TYPE_VALUES, default: null },
    taxCategoryId: { type: Schema.Types.ObjectId, default: null },
    hsnCode: { type: String, default: null, trim: true },
    searchKeywords: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    defaultImageUrl: { type: String, default: null, trim: true },
    imageUrls: { type: [String], default: [] },
    attributeSummary: { type: Schema.Types.Mixed, default: null },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    approvalStatus: {
      type: String,
      enum: PRODUCT_APPROVAL_STATUS_VALUES,
      default: 'draft',
    },
    status: {
      type: String,
      enum: PRODUCT_STATUS_VALUES,
      default: 'active',
    },
    approvedBy: { type: Schema.Types.ObjectId, default: null },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: Schema.Types.ObjectId, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null, trim: true },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<ProductRecord>,
);

ProductSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ subcategoryId: 1 });
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ approvalStatus: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ isVisible: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ createdAt: 1 });
ProductSchema.index({ updatedAt: -1 });
ProductSchema.index({ foodType: 1 });
ProductSchema.index(
  { categoryId: 1, status: 1, approvalStatus: 1, isVisible: 1 },
);
ProductSchema.index(
  { brandId: 1, status: 1, approvalStatus: 1, isVisible: 1 },
);
ProductSchema.index(
  { foodType: 1, status: 1, approvalStatus: 1, isVisible: 1 },
);
ProductSchema.index(
  { isFeatured: 1, status: 1, approvalStatus: 1, isVisible: 1 },
);
ProductSchema.index({
  name: 'text',
  slug: 'text',
  shortDescription: 'text',
  description: 'text',
  searchKeywords: 'text',
  tags: 'text',
});

export const ProductModel = model<ProductRecord>(
  'Product',
  ProductSchema,
  COLLECTION_NAMES.PRODUCTS,
);
