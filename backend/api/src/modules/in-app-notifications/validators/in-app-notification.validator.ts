import { z } from 'zod';

import { IN_APP_NOTIFICATION_TYPE_VALUES } from '../constants/in-app-notification-type.constant';

const booleanQueryValidator = z.preprocess((value) => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean());

export const notificationListQueryValidator = z.object({
  isRead: booleanQueryValidator.optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  notificationType: z.enum(IN_APP_NOTIFICATION_TYPE_VALUES).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const notificationIdParamsValidator = z.object({
  notificationId: z.string().trim().min(1),
});

export const customerNotificationListQueryValidator = notificationListQueryValidator;
export const deliveryNotificationListQueryValidator = notificationListQueryValidator;
export const vendorNotificationListQueryValidator = notificationListQueryValidator;
export const adminNotificationListQueryValidator = notificationListQueryValidator;

export const customerNotificationIdParamsValidator = notificationIdParamsValidator;
export const deliveryNotificationIdParamsValidator = notificationIdParamsValidator;
export const vendorNotificationIdParamsValidator = notificationIdParamsValidator;
export const adminNotificationIdParamsValidator = notificationIdParamsValidator;

export type NotificationListQueryBody = z.infer<typeof notificationListQueryValidator>;
