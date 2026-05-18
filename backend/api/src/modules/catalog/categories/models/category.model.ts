import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import type { DbStatus } from '../../../../database/constants/db-status.constants';
import { CATEGORY_STATUS_VALUES } from '../constants/category-status.constant';

export type CategoryRecord = {
  name: string;
  slug: string;
  description: string | null;
  parentCategoryId: Types.ObjectId | null;
  level: number;
  displayOrder: number;
  iconUrl: string | null;
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

const CategorySchema = new Schema<CategoryRecord>(
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
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Category',
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    iconUrl: {
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
      enum: CATEGORY_STATUS_VALUES,
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
  baseSchemaOptions as SchemaOptions<CategoryRecord>,
);

CategorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
CategorySchema.index({ parentCategoryId: 1 });
CategorySchema.index({ status: 1 });
CategorySchema.index({ isVisible: 1 });
CategorySchema.index({ displayOrder: 1 });

export const CategoryModel = model<CategoryRecord>(
  'Category',
  CategorySchema,
  COLLECTION_NAMES.CATEGORIES,
);
