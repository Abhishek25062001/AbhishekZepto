import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { APP_SURFACE_VALUES, type AppSurface } from '../constants/app-surface.constant';
import { PUSH_PLATFORM_VALUES, type PushPlatform } from '../constants/push-platform.constant';

export type DeviceTokenRecord = {
  userId: Types.ObjectId;
  role: string;
  appSurface: AppSurface;
  deviceId: string;
  fcmToken: string;
  platform: PushPlatform;
  appVersion: string | null;
  deviceName: string | null;
  isActive: boolean;
  lastUsedAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const DeviceTokenSchema = new Schema<DeviceTokenRecord>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, trim: true },
    appSurface: { type: String, enum: APP_SURFACE_VALUES, required: true },
    deviceId: { type: String, required: true, trim: true },
    fcmToken: { type: String, required: true, trim: true },
    platform: { type: String, enum: PUSH_PLATFORM_VALUES, required: true },
    appVersion: { type: String, default: null, trim: true },
    deviceName: { type: String, default: null, trim: true },
    isActive: { type: Boolean, required: true, default: true },
    lastUsedAt: { type: Date, required: true, default: Date.now },
    revokedAt: { type: Date, default: null },
  },
  baseSchemaOptions as SchemaOptions<DeviceTokenRecord>,
);

DeviceTokenSchema.index({ userId: 1 });
DeviceTokenSchema.index({ role: 1 });
DeviceTokenSchema.index({ appSurface: 1 });
DeviceTokenSchema.index({ deviceId: 1 });
DeviceTokenSchema.index({ fcmToken: 1 });
DeviceTokenSchema.index({ isActive: 1 });
DeviceTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const DeviceTokenModel = model<DeviceTokenRecord>(
  'DeviceToken',
  DeviceTokenSchema,
  COLLECTION_NAMES.DEVICE_TOKENS,
);

export { DeviceTokenSchema };
