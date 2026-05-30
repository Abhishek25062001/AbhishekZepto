import type { InAppNotification } from '../../../../../../packages/shared/api';

export const getNotificationTarget = (notification: InAppNotification): string | null => {
  if (notification.notificationType === 'order_update') {
    return typeof notification.dataPayload.orderId === 'string'
      ? `order:${notification.dataPayload.orderId}`
      : 'orders';
  }

  if (notification.notificationType === 'delivery_update') {
    return typeof notification.dataPayload.orderId === 'string'
      ? `tracking:${notification.dataPayload.orderId}`
      : 'tracking';
  }

  return null;
};
