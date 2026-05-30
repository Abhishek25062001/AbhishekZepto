import { Types } from 'mongoose';

import { DeviceTokenModel } from '../models/device-token.model';
import type {
  DeviceTokenDocument,
  DeviceTokenUpsertPayload,
} from '../types/push-notification.types';
import type { AppSurface } from '../constants/app-surface.constant';

const toObjectId = (value: string | Types.ObjectId): Types.ObjectId =>
  value instanceof Types.ObjectId ? value : new Types.ObjectId(value);

export const upsertDeviceToken = async (
  payload: DeviceTokenUpsertPayload,
): Promise<DeviceTokenDocument> => {
  const now = new Date();
  const updated = await DeviceTokenModel.findOneAndUpdate(
    {
      userId: payload.userId,
      deviceId: payload.deviceId,
    },
    {
      $set: {
        appSurface: payload.appSurface,
        appVersion: payload.appVersion ?? null,
        deviceName: payload.deviceName ?? null,
        fcmToken: payload.fcmToken,
        isActive: true,
        lastUsedAt: now,
        platform: payload.platform,
        revokedAt: null,
        role: payload.role,
      },
      $setOnInsert: {
        userId: payload.userId,
        deviceId: payload.deviceId,
      },
    },
    { new: true, upsert: true },
  ).lean();

  return updated as DeviceTokenDocument;
};

export const findActiveTokensByUser = async (
  userId: string | Types.ObjectId,
  appSurface: AppSurface,
): Promise<DeviceTokenDocument[]> =>
  DeviceTokenModel.find({
    appSurface,
    isActive: true,
    userId: toObjectId(userId),
  }).lean();

export const revokeDeviceToken = async (
  userId: string | Types.ObjectId,
  deviceId: string,
): Promise<DeviceTokenDocument | null> =>
  DeviceTokenModel.findOneAndUpdate(
    {
      userId: toObjectId(userId),
      deviceId,
      isActive: true,
    },
    {
      $set: {
        isActive: false,
        revokedAt: new Date(),
      },
    },
    { new: true },
  ).lean();

export const deactivateTokenByFcmToken = async (
  fcmToken: string,
): Promise<DeviceTokenDocument | null> =>
  DeviceTokenModel.findOneAndUpdate(
    {
      fcmToken,
      isActive: true,
    },
    {
      $set: {
        isActive: false,
        revokedAt: new Date(),
      },
    },
    { new: true },
  ).lean();
