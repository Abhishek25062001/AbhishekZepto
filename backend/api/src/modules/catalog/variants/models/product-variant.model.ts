import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { VARIANT_STATUS_VALUES } from '../constants/variant-status.constant';

export type ProductVariantRecord = {
  productId: Types.ObjectId;
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
  status: (typeof VARIANT_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const ProductVariantSchema = new Schema<ProductVariantRecord>(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    variantName: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    barcode: { type: String, default: null, trim: true },
    unit: { type: String, required: true, trim: true, lowercase: true },
    unitValue: { type: Number, required: true },
    mrp: { type: Number, required: true },
    defaultSellingPrice: { type: Number, default: null },
    weightInGrams: { type: Number, default: null },
    lengthCm: { type: Number, default: null },
    widthCm: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    imageUrl: { type: String, default: null, trim: true },
    attributeValues: { type: Schema.Types.Mixed, default: null },
    isDefault: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    status: {
      type: String,
      enum: VARIANT_STATUS_VALUES,
      default: 'active',
    },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<ProductVariantRecord>,
);

ProductVariantSchema.index(
  { sku: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
ProductVariantSchema.index({ productId: 1 });
ProductVariantSchema.index({ barcode: 1 }, { sparse: true });
ProductVariantSchema.index({ status: 1 });
ProductVariantSchema.index({ isVisible: 1 });

export const ProductVariantModel = model<ProductVariantRecord>(
  'ProductVariant',
  ProductVariantSchema,
  COLLECTION_NAMES.PRODUCT_VARIANTS,
);
