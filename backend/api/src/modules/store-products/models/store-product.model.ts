import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { STORE_PRODUCT_DISCOUNT_TYPE_VALUES } from '../constants/store-product-discount-type.constant';
import { STORE_PRODUCT_STATUS_VALUES } from '../constants/store-product-status.constant';

export type StoreProductRecord = {
  storeId: Types.ObjectId;
  vendorId: Types.ObjectId;
  cityId: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId | null;
  sku: string;
  storeSku: string | null;
  mrp: number;
  sellingPrice: number;
  discountType: (typeof STORE_PRODUCT_DISCOUNT_TYPE_VALUES)[number];
  discountValue: number;
  finalPrice: number;
  taxCategoryId: Types.ObjectId | null;
  isAvailable: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  isPriceLocked: boolean;
  priceUpdatedAt: Date | null;
  availabilityUpdatedAt: Date | null;
  status: (typeof STORE_PRODUCT_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const StoreProductSchema = new Schema<StoreProductRecord>(
  {
    storeId: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
    vendorId: { type: Schema.Types.ObjectId, required: true },
    cityId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    variantId: { type: Schema.Types.ObjectId, required: true, ref: 'ProductVariant' },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    brandId: { type: Schema.Types.ObjectId, default: null },
    sku: { type: String, required: true, trim: true, uppercase: true },
    storeSku: { type: String, default: null, trim: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountType: {
      type: String,
      enum: STORE_PRODUCT_DISCOUNT_TYPE_VALUES,
      default: 'none',
    },
    discountValue: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    taxCategoryId: { type: Schema.Types.ObjectId, default: null },
    isAvailable: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPriceLocked: { type: Boolean, default: false },
    priceUpdatedAt: { type: Date, default: null },
    availabilityUpdatedAt: { type: Date, default: null },
    status: { type: String, enum: STORE_PRODUCT_STATUS_VALUES, default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<StoreProductRecord>,
);

StoreProductSchema.index(
  { storeId: 1, variantId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
StoreProductSchema.index(
  { storeId: 1, storeSku: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false, storeSku: { $type: 'string' } },
  },
);
StoreProductSchema.index({ storeId: 1 });
StoreProductSchema.index({ vendorId: 1 });
StoreProductSchema.index({ cityId: 1 });
StoreProductSchema.index({ productId: 1 });
StoreProductSchema.index({ variantId: 1 });
StoreProductSchema.index({ categoryId: 1 });
StoreProductSchema.index({ brandId: 1 });
StoreProductSchema.index({ status: 1 });
StoreProductSchema.index({ isAvailable: 1 });
StoreProductSchema.index({ isVisible: 1 });
StoreProductSchema.index({ isFeatured: 1 });
StoreProductSchema.index({ sku: 1 });
StoreProductSchema.index({ createdAt: -1 });
StoreProductSchema.index({ finalPrice: 1 });
StoreProductSchema.index(
  { cityId: 1, status: 1, isVisible: 1, isAvailable: 1 },
);
StoreProductSchema.index(
  { storeId: 1, status: 1, isVisible: 1, isAvailable: 1 },
);
StoreProductSchema.index({ productId: 1, variantId: 1 });

export const StoreProductModel = model<StoreProductRecord>(
  'StoreProduct',
  StoreProductSchema,
  COLLECTION_NAMES.STORE_PRODUCTS,
);
