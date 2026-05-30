import type { InAppNotification } from '../../../../../../packages/shared/api';

export const getNotificationTarget = (notification: InAppNotification): string | null => {
  if (notification.notificationType === 'order_update') {
    return typeof notification.dataPayload.orderId === 'string'
      ? `/orders/active/${notification.dataPayload.orderId}`
      : '/orders/active';
  }

  if (notification.notificationType === 'delivery_update') {
    return typeof notification.dataPayload.orderId === 'string'
      ? `/orders/active/${notification.dataPayload.orderId}`
      : '/orders/active';
  }

  return null;
};
