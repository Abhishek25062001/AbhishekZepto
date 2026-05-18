import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import type { DbStatus } from '../../../../database/constants/db-status.constants';
import { BRAND_STATUS_VALUES } from '../constants/brand-status.constant';

export type BrandRecord = {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: DbStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const BrandSchema = new Schema<BrandRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: null,
      trim: true,
    },
    bannerUrl: {
      type: String,
      default: null,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: BRAND_STATUS_VALUES,
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
  baseSchemaOptions as SchemaOptions<BrandRecord>,
);

BrandSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
BrandSchema.index({ status: 1 });
BrandSchema.index({ isVisible: 1 });
BrandSchema.index({ isFeatured: 1 });

export const BrandModel = model<BrandRecord>('Brand', BrandSchema, COLLECTION_NAMES.BRANDS);
