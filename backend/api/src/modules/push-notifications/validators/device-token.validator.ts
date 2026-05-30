import { z } from 'zod';

import { PUSH_PLATFORM_VALUES } from '../constants/push-platform.constant';
import { PUSH_NOTIFICATION_STATUS_VALUES } from '../constants/push-status.constant';

export const deviceTokenBodySchema = z.object({
  appVersion: z.string().trim().max(64).optional(),
  deviceId: z.string().trim().min(1),
  deviceName: z.string().trim().max(128).optional(),
  fcmToken: z.string().trim().min(1),
  platform: z.enum(PUSH_PLATFORM_VALUES),
});

export const deviceTokenParamsSchema = z.object({
  deviceId: z.string().trim().min(1),
});

export const registerCustomerDeviceTokenBodyValidator = deviceTokenBodySchema;
export const registerDeliveryDeviceTokenBodyValidator = deviceTokenBodySchema;
export const removeCustomerDeviceTokenParamsValidator = deviceTokenParamsSchema;
export const removeDeliveryDeviceTokenParamsValidator = deviceTokenParamsSchema;

export const pushLogListQueryValidator = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  notificationType: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  status: z.enum(PUSH_NOTIFICATION_STATUS_VALUES).optional(),
  userId: z.string().trim().min(1).optional(),
});

export const pushLogIdParamsValidator = z.object({
  logId: z.string().trim().min(1),
});

export type DeviceTokenBody = z.infer<typeof deviceTokenBodySchema>;
