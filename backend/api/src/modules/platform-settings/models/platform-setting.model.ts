import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  PLATFORM_SETTING_CATEGORIES,
  PLATFORM_SETTING_CATEGORY,
  PLATFORM_SETTING_SCOPE_TYPE,
  PLATFORM_SETTING_SCOPE_TYPES,
  PLATFORM_SETTING_VALUE_TYPE,
  PLATFORM_SETTING_VALUE_TYPES,
} from '../constants/platform-settings.constants';
import type { PlatformSettingRecord } from '../types/platform-settings.types';

const PlatformSettingSchema = new Schema<PlatformSettingRecord>(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    category: {
      type: String,
      enum: PLATFORM_SETTING_CATEGORIES,
      default: PLATFORM_SETTING_CATEGORY.PLATFORM,
      index: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
    valueType: {
      type: String,
      enum: PLATFORM_SETTING_VALUE_TYPES,
      default: PLATFORM_SETTING_VALUE_TYPE.JSON,
    },
    scopeType: {
      type: String,
      enum: PLATFORM_SETTING_SCOPE_TYPES,
      default: PLATFORM_SETTING_SCOPE_TYPE.GLOBAL,
      index: true,
    },
    scopeId: { type: String, default: null, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    isSensitive: { type: Boolean, default: false, index: true },
    isEditable: { type: Boolean, default: true, index: true },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
  },
  baseSchemaOptions as SchemaOptions<PlatformSettingRecord>,
);

PlatformSettingSchema.index({ category: 1, scopeType: 1, scopeId: 1 });
PlatformSettingSchema.index({ key: 1, category: 1 });

export const PlatformSettingModel = model<PlatformSettingRecord>(
  'PlatformSetting',
  PlatformSettingSchema,
  COLLECTION_NAMES.PLATFORM_SETTINGS,
);
