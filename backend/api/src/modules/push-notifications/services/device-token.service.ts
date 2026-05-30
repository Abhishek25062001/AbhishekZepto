import { Types } from 'mongoose';

import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { AUDIT_EVENTS, writeAuditLog } from '../../audit';
import { APP_SURFACE } from '../constants/app-surface.constant';
import {
  revokeDeviceToken,
  upsertDeviceToken,
} from '../repositories/device-token.repository';
import type {
  DeviceTokenDocument,
  RegisterDeviceTokenInput,
} from '../types/push-notification.types';

export const registerCustomerDeviceToken = async (
  userId: string,
  payload: RegisterDeviceTokenInput,
): Promise<DeviceTokenDocument> => {
  const token = await upsertDeviceToken({
    ...payload,
    appSurface: APP_SURFACE.CUSTOMER_APP,
    role: AUTH_ROLE.CUSTOMER,
    userId: new Types.ObjectId(userId),
  });
  void writeAuditLog({
    actorId: new Types.ObjectId(userId),
    actorRole: AUTH_ROLE.CUSTOMER,
    actorSurface: APP_SURFACE.CUSTOMER_APP,
    cityId: null,
    entityId: token._id,
    entityType: 'device_token',
    eventType: AUDIT_EVENTS.PUSH_DEVICE_TOKEN_REGISTERED,
    ipAddress: null,
    metadata: { appSurface: token.appSurface, deviceId: token.deviceId, platform: token.platform },
    requestId: null,
    status: 'success',
    storeId: null,
    traceId: null,
    userAgent: null,
    vendorId: null,
  });
  return token;
};

export const registerDeliveryDeviceToken = async (
  userId: string,
  payload: RegisterDeviceTokenInput,
): Promise<DeviceTokenDocument> => {
  const token = await upsertDeviceToken({
    ...payload,
    appSurface: APP_SURFACE.DELIVERY_AGENT_APP,
    role: AUTH_ROLE.DELIVERY_AGENT,
    userId: new Types.ObjectId(userId),
  });
  void writeAuditLog({
    actorId: new Types.ObjectId(userId),
    actorRole: AUTH_ROLE.DELIVERY_AGENT,
    actorSurface: APP_SURFACE.DELIVERY_AGENT_APP,
    cityId: null,
    entityId: token._id,
    entityType: 'device_token',
    eventType: AUDIT_EVENTS.PUSH_DEVICE_TOKEN_REGISTERED,
    ipAddress: null,
    metadata: { appSurface: token.appSurface, deviceId: token.deviceId, platform: token.platform },
    requestId: null,
    status: 'success',
    storeId: null,
    traceId: null,
    userAgent: null,
    vendorId: null,
  });
  return token;
};

export const removeDeviceToken = async (
  userId: string,
  deviceId: string,
): Promise<DeviceTokenDocument | null> => {
  const token = await revokeDeviceToken(userId, deviceId);
  if (token) {
    void writeAuditLog({
      actorId: new Types.ObjectId(userId),
      actorRole: token.role,
      actorSurface: token.appSurface,
      cityId: null,
      entityId: token._id,
      entityType: 'device_token',
      eventType: AUDIT_EVENTS.PUSH_DEVICE_TOKEN_REVOKED,
      ipAddress: null,
      metadata: { appSurface: token.appSurface, deviceId: token.deviceId },
      requestId: null,
      status: 'success',
      storeId: null,
      traceId: null,
      userAgent: null,
      vendorId: null,
    });
  }

  return token;
};
