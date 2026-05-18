import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import type { DbStatus } from '../../../../database/constants/db-status.constants';
import { BASE_UNIT_VALUES } from '../constants/base-unit.constant';
import { PRODUCT_UNIT_STATUS_VALUES } from '../constants/product-unit-status.constant';

export type ProductUnitRecord = {
  code: string;
  name: string;
  baseUnit: (typeof BASE_UNIT_VALUES)[number];
  conversionFactor: number;
  status: DbStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const ProductUnitSchema = new Schema<ProductUnitRecord>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    baseUnit: {
      type: String,
      enum: BASE_UNIT_VALUES,
      required: true,
    },
    conversionFactor: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: PRODUCT_UNIT_STATUS_VALUES,
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<ProductUnitRecord>,
);

ProductUnitSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
ProductUnitSchema.index({ status: 1 });
ProductUnitSchema.index({ baseUnit: 1 });
ProductUnitSchema.index({ createdAt: 1 });

export const ProductUnitModel = model<ProductUnitRecord>(
  'ProductUnit',
  ProductUnitSchema,
  COLLECTION_NAMES.PRODUCT_UNITS,
);
